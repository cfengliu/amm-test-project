// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.4;

import { FlashLoanReceiverBase } from "./FlashLoanReceiverBase.sol";
import { ILendingPool, ILendingPoolAddressesProvider, IERC20 } from "./Interfaces.sol";
import "./Ownable.sol";
import { SafeMath } from "./Libraries.sol";

/*
 * A contract that executes the following logic in a single atomic transaction:
 *
 *   1. Gets a batch flash loan of AAVE, DAI and LINK
 *   2. Deposits all of this flash liquidity onto the Aave V2 lending pool
 *   3. Borrows 100 LINK based on the deposited collateral
 *   4. Repays 100 LINK and unlocks the deposited collateral
 *   5. Withdrawls all of the deposited collateral (AAVE/DAI/LINK)
 *   6. Repays batch flash loan including the 9bps fee
 *
 */
contract BatchFlashDemo is FlashLoanReceiverBase, Ownable {
    ILendingPoolAddressesProvider provider;
    using SafeMath for uint256;
    uint256 public flashAaveAmt0;
    uint256 public flashDaiAmt1;
    uint256 public flashLinkAmt2;
    uint256 public borrowAmt;
    address public lendingPoolAddr;

    // kovan reserve asset addresses
    // address public kovanAave = 0xB597cd8D3217ea6477232F9217fa70837ff667Af;
    // address public kovanDai = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa;
    address public kovanLink = 0xAD5ce863aE3E4E9394Ab43d4ba0D80f419F61789;

    // intantiate lending pool addresses provider and get lending pool address
    constructor(ILendingPoolAddressesProvider _addressProvider) FlashLoanReceiverBase(_addressProvider) {
        provider = _addressProvider;
        lendingPoolAddr = provider.getLendingPool();
    }

    /**
        This function is called after your contract has received the flash loaned amount
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        // // initialise lending pool instance
        ILendingPool lendingPool = ILendingPool(lendingPoolAddr);

        // deposits the flashed AAVE, DAI and Link liquidity onto the lending pool
        flashDeposit(lendingPool);

        // borrows 'borrowAmt' amount of LINK using the deposited collateral
        flashBorrow(lendingPool, kovanLink, borrowAmt);

        // repays the 'borrowAmt' mount of LINK to unlock the collateral
        flashRepay(lendingPool, kovanLink, borrowAmt);

        // withdraws the AAVE, DAI and LINK collateral from the lending pool
        flashWithdraw(lendingPool);

        // Approve the LendingPool contract allowance to *pull* the owed amount
        // i.e. AAVE V2's way of repaying the flash loan
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i].add(premiums[i]);
            IERC20(assets[i]).approve(address(_lendingPool), amountOwing);
        }

        return true;
    }

    /*
     * Deposits the flashed AAVE, DAI and LINK liquidity onto the lending pool as collateral
     */
    function flashDeposit(ILendingPool lendingPool) public {
        // approve lending pool
        // IERC20(kovanDai).approve(lendingPoolAddr, flashDaiAmt1);
        // IERC20(kovanAave).approve(lendingPoolAddr, flashAaveAmt0);
        IERC20(kovanLink).approve(lendingPoolAddr, flashLinkAmt2);

        // deposit the flashed AAVE, DAI and LINK as collateral
        // lendingPool.deposit(kovanDai, flashDaiAmt1, address(this), uint16(0));
        // lendingPool.deposit(kovanAave, flashAaveAmt0, address(this), uint16(0));
        lendingPool.deposit(kovanLink, flashLinkAmt2, address(this), uint16(0));
    }

    /*
     * Withdraws the AAVE, DAI and LINK collateral from the lending pool
     */
    function flashWithdraw(ILendingPool lendingPool) public {
        // lendingPool.withdraw(kovanAave, flashAaveAmt0, address(this));
        // lendingPool.withdraw(kovanDai, flashDaiAmt1, address(this));
        lendingPool.withdraw(kovanLink, flashLinkAmt2, address(this));
    }

    /*
     * Borrows _borrowAmt amount of _borrowAsset based on the existing deposited collateral
     */
    function flashBorrow(
        ILendingPool lendingPool,
        address _borrowAsset,
        uint256 _borrowAmt
    ) public {
        // borrowing x asset at stable rate, no referral, for yourself
        lendingPool.borrow(_borrowAsset, _borrowAmt, 1, uint16(0), address(this));
    }

    /*
     * Repays _repayAmt amount of _repayAsset
     */
    function flashRepay(
        ILendingPool lendingPool,
        address _repayAsset,
        uint256 _repayAmt
    ) public {
        // approve the repayment from this contract
        IERC20(_repayAsset).approve(lendingPoolAddr, _repayAmt);

        lendingPool.repay(_repayAsset, _repayAmt, 1, address(this));
    }

    /*
     * Repays _repayAmt amount of _repayAsset
     */
    function flashSwapBorrowRate(
        ILendingPool lendingPool,
        address _asset,
        uint256 _rateMode
    ) public {
        lendingPool.swapBorrowRateMode(_asset, _rateMode);
    }

    /*
     * This function is manually called to commence the flash loans sequence
     */
    function executeFlashLoans(
        // uint256 _flashAaveAmt0,
        // uint256 _flashDaiAmt1,
        uint256 _flashLinkAmt2,
        uint256 _borrowAmt
    ) public onlyOwner {
        address receiverAddress = address(this);

        // the various assets to be flashed
        address[] memory assets = new address[](1);
        // assets[0] = kovanAave;
        // assets[1] = kovanDai;
        assets[0] = kovanLink;

        // the amount to be flashed for each asset
        uint256[] memory amounts = new uint256[](1);
        // amounts[0] = _flashAaveAmt0;
        // amounts[1] = _flashDaiAmt1;
        amounts[0] = _flashLinkAmt2;

        // flashAaveAmt0 = _flashAaveAmt0;
        // flashDaiAmt1 = _flashDaiAmt1;
        flashLinkAmt2 = _flashLinkAmt2;
        borrowAmt = _borrowAmt;

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;
        // modes[1] = 0;
        // modes[2] = 0;

        address onBehalfOf = address(this);
        bytes memory params = "";
        uint16 referralCode = 0;

        _lendingPool.flashLoan(receiverAddress, assets, amounts, modes, onBehalfOf, params, referralCode);
    }

    /*
     * Rugpull all ERC20 tokens from the contract
     */
    function rugPull() public payable onlyOwner {
        // withdraw all ETH
        payable(_msgSender()).transfer(address(this).balance);

        // withdraw all x ERC20 tokens
        // IERC20(kovanAave).transfer(_msgSender(), IERC20(kovanAave).balanceOf(address(this)));
        // IERC20(kovanDai).transfer(_msgSender(), IERC20(kovanDai).balanceOf(address(this)));
        IERC20(kovanLink).transfer(_msgSender(), IERC20(kovanLink).balanceOf(address(this)));
    }
}
