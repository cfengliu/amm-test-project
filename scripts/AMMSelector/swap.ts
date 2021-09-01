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

  // const swapTokenForToken = await ammSelector.swapTokensOnSushiswap(
  //   BNT,
  //   INJ,
  //   "10000",
  //   "1630991844",
  //   "1",
  // );
  // console.log(swapTokenForToken);

  // const swapTokenForEth = await ammSelector.swapTokensOnSushiswap(
  //   DAI,
  //   WETH9,
  //   "10000",
  //   "1630991844",
  //   "1",
  // );
  // console.log(swapTokenForEth);

  const swapEthForToken = await ammSelector.swapETHOnSushiswap(DAI, "1630991844", "1", { value: "10000" });
  console.log(swapEthForToken);

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
