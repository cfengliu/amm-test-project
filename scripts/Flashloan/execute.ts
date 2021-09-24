import { ethers } from "hardhat";
import { BatchFlashDemo, BatchFlashDemo__factory } from "../../typechain";
import addr from "./address.json";

async function main() {
  const contractAddr = addr.contractAddr;

  const flashLoanV2Factory: BatchFlashDemo__factory = await ethers.getContractFactory("BatchFlashDemo");
  const flashLoanV2: BatchFlashDemo = <BatchFlashDemo>await flashLoanV2Factory.attach(contractAddr);

  const flashLoan = await flashLoanV2.executeFlashLoans("100000000000000000000", "1000000000000000000");
  // const flashLoan = await flashLoanV2.rugPull();
  // const flashLoan = await flashLoanV2.flashLinkAmt2();
  // const flashLoan = await flashLoanV2.lendingPoolAddr();

  console.log(flashLoan);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
