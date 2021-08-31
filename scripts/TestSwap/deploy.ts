// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { TestSwap, TestSwap__factory } from "../../typechain";

async function main(): Promise<void> {
  console.log("Starting deploying...");

  const TestSwapFactory: TestSwap__factory = await ethers.getContractFactory("TestSwap");
  const TestSwap: TestSwap = <TestSwap>await TestSwapFactory.deploy();
  await TestSwap.deployed();
  console.log("TestSwap deployed to: ", TestSwap.address);

  //DAI 0xad6d458402f60fd3bd25163575031acdce07538d
  //UNI 0x71d82eb6a5051cff99582f4cdf2ae9cd402a4882
  console.log(
    await TestSwap.getAmountOutMin(
      "0x71d82eb6a5051cff99582f4cdf2ae9cd402a4882",
      "0xad6d458402f60fd3bd25163575031acdce07538d",
      "10000",
    ),
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
