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
    address private constant WETH9 = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;

    modifier tokenTransferCheck(address token, uint256 amount) {
        require(IERC20(token).allowance(address(this), address(sushiRouter)) != 0, "This contract must be approved.");
        require(
            IERC20(token).allowance(msg.sender, address(this)) > amount,
            "The allowance must be larger than amount"
        );
        _;
    }

    constructor() {}

    // approve this contract to transfer msg.sender token
    function approveContract(address tokenIn) external {
        IERC20(tokenIn).safeApprove(address(sushiRouter), type(uint256).max);
        IERC20(tokenIn).safeApprove(address(uniswapRouter), type(uint256).max);
    }

    function _getPathForSushiSwap(address _tokenIn, address _tokenOut) private pure returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        return path;
    }

    function swapExactTokensForTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 deadline,
        uint256 amountOutMin
    ) external tokenTransferCheck(tokenIn, amountIn) returns (uint256[] memory) {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        uint256[] memory amounts = sushiRouter.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            _getPathForSushiSwap(tokenIn, tokenOut),
            msg.sender,
            deadline
        );

        return amounts;
    }

    function swapTokensForExactTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountOut,
        uint256 deadline,
        uint256 amountInMax
    ) external tokenTransferCheck(tokenIn, amountInMax) returns (uint256[] memory) {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax);

        uint256[] memory amounts = sushiRouter.swapTokensForExactTokens(
            amountOut,
            amountInMax,
            _getPathForSushiSwap(tokenIn, tokenOut),
            msg.sender,
            deadline
        );

        if (IERC20(tokenIn).balanceOf(address(this)) > 0) {
            IERC20(tokenIn).transfer(msg.sender, IERC20(tokenIn).balanceOf(address(this)));
        }

        return amounts;
    }

    function swapETHForExactTokens(
        address tokenOut,
        uint256 amountOut,
        uint256 deadline
    ) external payable returns (uint256[] memory) {
        require(msg.value > 0, "Must send ethers");

        uint256[] memory amounts = sushiRouter.swapETHForExactTokens{ value: msg.value }(
            amountOut,
            _getPathForSushiSwap(WETH9, tokenOut),
            msg.sender,
            deadline
        );

        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        require(success, "Refund failed");

        return amounts;
    }

    function swapTokensForExactETH(
        address tokenIn,
        uint256 amountOut,
        uint256 deadline,
        uint256 amountInMax
    ) external tokenTransferCheck(tokenIn, amountInMax) returns (uint256[] memory) {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax);

        uint256[] memory amounts = sushiRouter.swapTokensForExactETH(
            amountOut,
            amountInMax,
            _getPathForSushiSwap(tokenIn, WETH9),
            msg.sender,
            deadline
        );

        if (IERC20(tokenIn).balanceOf(address(this)) > 0) {
            IERC20(tokenIn).transfer(msg.sender, IERC20(tokenIn).balanceOf(address(this)));
        }

        return amounts;
    }

    function swapExactETHForTokens(
        address tokenOut,
        uint256 deadline,
        uint256 amountOutMin
    ) external payable returns (uint256[] memory) {
        require(msg.value > 0, "Must pass ethers");

        uint256[] memory amounts = sushiRouter.swapExactETHForTokens{ value: msg.value }(
            amountOutMin,
            _getPathForSushiSwap(WETH9, tokenOut),
            msg.sender,
            deadline
        );

        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");

        return amounts;
    }

    // swap with token for token or ETH on Sushi
    function swapExactTokensForETH(
        address tokenIn,
        uint256 amountIn,
        uint256 deadline,
        uint256 amountOutMin
    ) external payable tokenTransferCheck(tokenIn, amountIn) {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        address recipient = msg.sender;
        sushiRouter.swapExactTokensForETH(
            amountIn,
            amountOutMin,
            _getPathForSushiSwap(tokenIn, WETH9),
            recipient,
            deadline
        );
    }

    // sushiswap preview token swap
    function getAmountOutOnSushiswap(
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

    // sushiswap preview ETH swap
    // Use this function with .callStatic()
    function getAmountOutOnSushiswap(address _tokenOut) external payable returns (uint256[] memory) {
        uint256[] memory amountOutMins = sushiRouter.getAmountsOut(msg.value, _getPathForSushiSwap(WETH9, _tokenOut));
        return amountOutMins;
    }

    // uniswap multi path ETH swap
    function swapEthOnUniswap(
        bytes memory path,
        uint256 deadline,
        uint256 amountOutMinimum
    ) external payable {
        require(msg.value > 0, "Must pass ethers");

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
            path,
            msg.sender,
            deadline,
            msg.value,
            amountOutMinimum
        );

        uniswapRouter.exactInput{ value: msg.value }(params);
        uniswapRouter.refundETH();

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");
    }

    // uniswap multi path token swap for exact input
    function swapTokensInOnUniswap(
        bytes memory path,
        address tokenIn,
        uint256 amountIn,
        uint256 deadline,
        uint256 amountOutMinimum
    ) external payable tokenTransferCheck(tokenIn, amountIn) {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
            path,
            msg.sender,
            deadline,
            amountIn,
            amountOutMinimum
        );

        uniswapRouter.exactInput(params);
        uniswapRouter.refundETH();
    }

    // uniswap token swap for exact output
    function swapTokensOutOnUniswap(
        bytes memory path,
        address tokenIn,
        uint256 amountOut,
        uint256 deadline,
        uint256 amountInMaximum
    ) external payable tokenTransferCheck(tokenIn, amountInMaximum) {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMaximum);

        ISwapRouter.ExactOutputParams memory params = ISwapRouter.ExactOutputParams(
            path,
            msg.sender,
            deadline,
            amountOut,
            amountInMaximum
        );

        uniswapRouter.exactOutput(params);
        uniswapRouter.refundETH();

        if (IERC20(tokenIn).balanceOf(address(this)) > 0) {
            IERC20(tokenIn).transfer(msg.sender, IERC20(tokenIn).balanceOf(address(this)));
        }
    }

    // uniswap multipath preview for exact output
    function getAmountInOnUniswap(bytes memory path, uint256 amountOut) external payable returns (uint256) {
        return quoter.quoteExactOutput(path, amountOut);
    }

    // uniswap multipath preview for exact input
    function getAmountOutOnUniswap(bytes memory path, uint256 amountIn) external payable returns (uint256) {
        return quoter.quoteExactInput(path, amountIn);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");
    }

    receive() external payable {}
}
