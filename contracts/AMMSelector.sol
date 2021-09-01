// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import { IERC20, SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}

// TODO: import interface
interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapTokensForExactETH(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts);
}

contract AMMSelector is Ownable {
    using SafeERC20 for IERC20;

    // SushiSwap
    IUniswapV2Router02 private constant sushiRouter = IUniswapV2Router02(0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506);

    // Uniswap V3
    IUniswapRouter private constant uniswapRouter = IUniswapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IQuoter public constant quoter = IQuoter(0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6);

    // token addresses
    // address private constant BNT = 0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5;
    // address private constant INJ = 0x9108Ab1bb7D054a3C1Cd62329668536f925397e5;
    address private constant DAI = 0xaD6D458402F60fD3Bd25163575031ACDce07538D;
    // address private constant UNI = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;
    address private constant WETH9 = 0xc778417E063141139Fce010982780140Aa0cD5Ab;

    // mapping(string => address) public tokenToAddress;

    constructor() {}

    // approve this contract to transfer msg.sender token
    // TODO uniswap v3 approve
    function approveContract(address tokenIn) external {
        IERC20(tokenIn).safeApprove(address(sushiRouter), type(uint256).max);
    }

    // swap exact token for token or ETH on sushi
    function _swapOnSushi(
        address _tokenIn,
        address _tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint256 deadline
    ) private {
        address recipient = msg.sender;

        if (_tokenOut == WETH9) {
            sushiRouter.swapExactTokensForETH(
                amountIn,
                amountOutMin,
                _getPathForSushiSwap(_tokenIn, WETH9),
                recipient,
                deadline
            );
        } else {
            sushiRouter.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                _getPathForSushiSwap(_tokenIn, _tokenOut),
                recipient,
                deadline
            );
        }
    }

    // swap exact ETH for token on sushi
    function _swapOnSushi(
        address _tokenOut,
        uint256 amountOutMin,
        uint256 deadline
    ) private {
        address recipient = msg.sender;

        sushiRouter.swapExactETHForTokens{ value: msg.value }(
            amountOutMin,
            _getPathForSushiSwap(WETH9, _tokenOut),
            recipient,
            deadline
        );

        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");
    }

    function _getPathForSushiSwap(address _tokenIn, address _tokenOut) private pure returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        return path;
    }

    // swap with token for token or ETH on Sushi
    // swap for ETH with tokenOut == WETH
    function swapTokensOnSushiswap(
        address tokenIn,
        address tokenOut,
        uint256 amount,
        uint256 deadline,
        uint256 amountOutMinSushiSwap
    ) external payable {
        require(IERC20(tokenIn).allowance(address(this), address(sushiRouter)) != 0, "This contract is approved yet.");
        require(
            IERC20(tokenIn).allowance(msg.sender, address(this)) > amount,
            "The allowance to this contract is smaller than amount"
        );

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amount);
        _swapOnSushi(tokenIn, tokenOut, IERC20(tokenIn).balanceOf(address(this)), amountOutMinSushiSwap, deadline);
    }

    // swap with ETH for token on Sushi
    function swapEthOnSushiswap(
        address tokenOut,
        uint256 deadline,
        uint256 amountOutMinSushiSwap
    ) external payable {
        require(msg.value > 0, "Must pass ethers");
        _swapOnSushi(tokenOut, amountOutMinSushiSwap, deadline);
    }

    // sushiswap preview token swap
    function getAmountOut(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn
    ) external view returns (uint256[] memory) {
        uint256[] memory amountOutMins = sushiRouter.getAmountsOut(
            _amountIn,
            _getPathForSushiSwap(_tokenIn, _tokenOut)
        );
        return amountOutMins;
    }

    // Use this function with .callStatic()
    function getAmountOut(address _tokenOut) external payable returns (uint256[] memory) {
        uint256[] memory amountOutMins = sushiRouter.getAmountsOut(msg.value, _getPathForSushiSwap(WETH9, _tokenOut));
        return amountOutMins;
    }

    // uniswap ETH swap
    function convertExactEthToDai(uint256 deadline) external payable {
        require(msg.value > 0, "Must pass non 0 ETH amount");

        address tokenIn = WETH9;
        address tokenOut = DAI;
        uint24 fee = 3000;
        address recipient = msg.sender;
        uint256 amountIn = msg.value;
        uint256 amountOutMinimum = 1;
        uint160 sqrtPriceLimitX96 = 0;

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams(
            tokenIn,
            tokenOut,
            fee,
            recipient,
            deadline,
            amountIn,
            amountOutMinimum,
            sqrtPriceLimitX96
        );

        uniswapRouter.exactInputSingle{ value: msg.value }(params);
        uniswapRouter.refundETH();

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");
    }

    function convertEthToExactDai(uint256 daiAmount) external payable {
        require(daiAmount > 0, "Must pass non 0 DAI amount");
        require(msg.value > 0, "Must pass non 0 ETH amount");

        uint256 deadline = block.timestamp + 15;
        address tokenIn = WETH9;
        address tokenOut = DAI;
        uint24 fee = 3000;
        address recipient = msg.sender;
        uint256 amountOut = daiAmount;
        uint256 amountInMaximum = msg.value;
        uint160 sqrtPriceLimitX96 = 0;

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams(
            tokenIn,
            tokenOut,
            fee,
            recipient,
            deadline,
            amountOut,
            amountInMaximum,
            sqrtPriceLimitX96
        );

        uniswapRouter.exactOutputSingle{ value: msg.value }(params);
        uniswapRouter.refundETH();

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");
    }

    // uniswap preview for exact output
    function getEstimatedETHforDAI(uint256 daiAmount) external payable returns (uint256) {
        address tokenIn = WETH9;
        address tokenOut = DAI;
        uint24 fee = 3000;
        uint160 sqrtPriceLimitX96 = 0;

        return quoter.quoteExactOutputSingle(tokenIn, tokenOut, fee, daiAmount, sqrtPriceLimitX96);
    }

    // uniswap preview for exact input
    function getEstimatedDAIforETH(uint256 ethAmount) external payable returns (uint256) {
        address tokenIn = WETH9;
        address tokenOut = DAI;
        uint24 fee = 3000;
        uint160 sqrtPriceLimitX96 = 0;

        return quoter.quoteExactInputSingle(tokenIn, tokenOut, fee, ethAmount, sqrtPriceLimitX96);
    }

    // ERC20 get token balance
    function getTokenBalance(address tokenAddr, address owner) public view returns (uint256) {
        return IERC20(tokenAddr).balanceOf(owner);
    }

    receive() external payable {}
}
