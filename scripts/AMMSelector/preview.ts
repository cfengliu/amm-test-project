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

  const estimated = await ammSelector.callStatic.getAmountOutMin(
    "0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5",
    "0x9108Ab1bb7D054a3C1Cd62329668536f925397e5",
    "100",
  );
  console.log(estimated);

  // const estimatedETH = await ammSelector.callStatic.getEstimatedETHforDAI("100");
  // console.log(estimatedETH);

  // const estimatedDAI = await ammSelector.callStatic.getEstimatedDAIforETH("100");
  // console.log(estimatedDAI);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
