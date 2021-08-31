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

  // testing after deploying

  console.log(await ammSelector.getTokenBalance("0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5", ammSelector.address));
  console.log(await ammSelector.getTokenBalance("0x9108Ab1bb7D054a3C1Cd62329668536f925397e5", ammSelector.address));

  // DAI 0xad6d458402f60fd3bd25163575031acdce07538d
  // BNT 0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5
  // INJ 0x9108Ab1bb7D054a3C1Cd62329668536f925397e5;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
