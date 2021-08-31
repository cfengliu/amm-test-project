import { ethers } from "hardhat";
import { AMMSelector, AMMSelector__factory } from "../../typechain";

async function main() {
  const contractAddr = "0x7A6C444bea500F3b0dc4fCf6f3e8652EA9cB3601";

  const ammSelectorFactory: AMMSelector__factory = await ethers.getContractFactory("AMMSelector");
  const ammSelector: AMMSelector = <AMMSelector>await ammSelectorFactory.attach(contractAddr);

  // DAI 0xad6d458402f60fd3bd25163575031acdce07538d
  // BNT 0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5
  // INJ 0x9108Ab1bb7D054a3C1Cd62329668536f925397e5;
  // UNI 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984

  // console.log(await ammSelector.getTokenBalance("0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5", ammSelector.address));
  // console.log(await ammSelector.getTokenBalance("0x9108Ab1bb7D054a3C1Cd62329668536f925397e5", ammSelector.address));
  // console.log(await ammSelector.getTokenBalance("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", ammSelector.address));
  // console.log(await ammSelector.getTokenBalance("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "0xb11a55dee8be8c05d018c3521366111f48ea7bd9"));

  const estimatedDAI = await ammSelector.ammSwap(
    "0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5",
    "0x9108Ab1bb7D054a3C1Cd62329668536f925397e5",
    "100",
    "1630591844",
    "1",
  );
  console.log(estimatedDAI);

  // const dai = await ammSelector.convertExactEthToDai({value: "100"});
  // console.log(dai);

  // const eth = await ammSelector.convertEthToExactDai("100", {value: "10000000"});
  // console.log(eth);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
