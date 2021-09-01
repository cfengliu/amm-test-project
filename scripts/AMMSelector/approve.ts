import { ethers } from "hardhat";
import { AMMSelector, AMMSelector__factory } from "../../typechain";

async function main() {
  const contractAddr = "0x7424323257fd3e5F705bAA0001c8BD958a05E736";

  const ammSelectorFactory: AMMSelector__factory = await ethers.getContractFactory("AMMSelector");
  const ammSelector: AMMSelector = <AMMSelector>await ammSelectorFactory.attach(contractAddr);

  const DAI = "0xad6d458402f60fd3bd25163575031acdce07538d";
  const BNT = "0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5";
  const INJ = "0x9108Ab1bb7D054a3C1Cd62329668536f925397e5";
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const WETH9 = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

  console.log(await ammSelector.approveContract(BNT));
  console.log(await ammSelector.approveContract(DAI));
}
