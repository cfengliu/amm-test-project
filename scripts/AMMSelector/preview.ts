import { ethers } from "hardhat";
import { AMMSelector, AMMSelector__factory } from "../../typechain";
import { encodePath } from "./path";
import { FeeAmount } from "./constants";
import addr from "./address.json";

async function main() {
  const contractAddr = addr.contractAddr;

  const ammSelectorFactory: AMMSelector__factory = await ethers.getContractFactory("AMMSelector");
  const ammSelector: AMMSelector = <AMMSelector>await ammSelectorFactory.attach(contractAddr);

  // sushiswap prview
  const estimatedTokenForEth = await ammSelector["getAmountOutOnSushiswap(address,address,uint256)"](
    addr.UNI,
    addr.DAI,
    "10000",
  );
  console.log("estimatedTokenForEth:", estimatedTokenForEth[estimatedTokenForEth.length - 1]);

  const estimatedEthForToken = await ammSelector.callStatic["getAmountOutOnSushiswap(address)"](addr.UNI, {
    value: "1000",
  });
  console.log("estimatedEthForToken:", estimatedEthForToken[estimatedEthForToken.length - 1]);

  const pathArr: string[] = [addr.UNI, addr.DAI];
  const feeArr: FeeAmount[] = [FeeAmount.MEDIUM];
  const uniToDaiPath = encodePath(pathArr, feeArr);

  const estimatedUNI = await ammSelector.callStatic.getAmountInOnUniswap(uniToDaiPath, "10000");
  console.log("estimatedUNI:", estimatedUNI);

  const estimatedDAI = await ammSelector.callStatic.getAmountOutOnUniswap(uniToDaiPath, "10000");
  console.log("estimatedDAI:", estimatedDAI);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
