import { ethers } from "hardhat";
import { BatchFlashDemo, BatchFlashDemo__factory } from "../../typechain";

async function main(): Promise<void> {
  const flashLoanV2Factory: BatchFlashDemo__factory = await ethers.getContractFactory("BatchFlashDemo");
  const flashLoanV2: BatchFlashDemo = <BatchFlashDemo>(
    await flashLoanV2Factory.deploy("0x88757f2f99175387ab4c6a4b3067c77a695b0349")
  );
  await flashLoanV2.deployed();
  console.log("BatchFlashDemo deployed to: ", flashLoanV2.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
