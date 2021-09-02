// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { AMMSelector, AMMSelector__factory } from "../../typechain";

async function main(): Promise<void> {
  const ammSelectorFactory: AMMSelector__factory = await ethers.getContractFactory("AMMSelector");
  const ammSelector: AMMSelector = <AMMSelector>await ammSelectorFactory.deploy();
  await ammSelector.deployed();
  console.log("ammSelector deployed to: ", ammSelector.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
