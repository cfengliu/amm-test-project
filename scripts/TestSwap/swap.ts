import { ethers } from "hardhat";
import { AMMSelector, AMMSelector__factory } from "../../typechain";

async function main() {
  const contractAddr = "0x31CEA1D19c6C2d23E6b7dd7Fa583ED143f34e2d4";

  const ammSelectorFactory: AMMSelector__factory = await ethers.getContractFactory("AMMSelector");
  const ammSelector: AMMSelector = <AMMSelector>await ammSelectorFactory.attach(contractAddr);

  // DAI 0xad6d458402f60fd3bd25163575031acdce07538d
  // BNT 0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5
  // INJ 0x9108Ab1bb7D054a3C1Cd62329668536f925397e5;

  const estimatedDAI = await ammSelector.ammSwap(1630169375, "1");

  console.log(estimatedDAI);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
