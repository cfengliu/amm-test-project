import { ethers } from "hardhat";
import { AMMSelector, AMMSelector__factory } from "../../typechain";

async function main() {
  const contractAddr = "0xE13dE5E4B373492dF57E5fC6e6ceB6A5ff796277";

  const ammSelectorFactory: AMMSelector__factory = await ethers.getContractFactory("AMMSelector");
  const ammSelector: AMMSelector = <AMMSelector>await ammSelectorFactory.attach(contractAddr);

  const DAI = "0xad6d458402f60fd3bd25163575031acdce07538d";
  const BNT = "0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5";
  const INJ = "0x9108Ab1bb7D054a3C1Cd62329668536f925397e5";
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const WETH9 = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

  // sushiswap prview
  const estimatedTokenForToken = await ammSelector["getAmountOut(address,address,uint256)"](BNT, INJ, "100000");
  console.log(estimatedTokenForToken);

  const estimatedTokenForEth = await ammSelector["getAmountOut(address,address,uint256)"](DAI, WETH9, "100000");
  console.log(estimatedTokenForEth);

  const estimatedEthForToken = await ammSelector.callStatic["getAmountOut(address)"](DAI, { value: "10000" });
  console.log(estimatedEthForToken);

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
