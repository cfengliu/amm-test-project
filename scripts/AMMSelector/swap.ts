import { ethers } from "hardhat";
import { AMMSelector, AMMSelector__factory } from "../../typechain";
import { encodePath } from "./path";
import { FeeAmount } from "./constants";
import addr from "./address.json";

async function main() {
  const contractAddr = addr.contractAddr;

  const ammSelectorFactory: AMMSelector__factory = await ethers.getContractFactory("AMMSelector");
  const ammSelector: AMMSelector = <AMMSelector>await ammSelectorFactory.attach(contractAddr);

  const deadline = "1630991844";

  // const swapExactTokensForTokens = await ammSelector.swapExactTokensForTokens(addr.UNI, addr.DAI, "1000", deadline, "1");
  // console.log("1: ", swapExactTokensForTokens);

  // const swapTokensForExactTokens = await ammSelector.swapTokensForExactTokens(addr.UNI, addr.DAI, "100", deadline, "1000");
  // console.log("2: ", swapTokensForExactTokens);

  // const swapExactETHForTokens = await ammSelector.swapExactETHForTokens(addr.DAI,deadline, "1", {value: "1000"});
  // console.log("3: ",swapExactETHForTokens);

  const swapTokensForExactETH = await ammSelector.swapTokensForExactETH(addr.UNI, "10", deadline, "10000");
  console.log("4: ", swapTokensForExactETH);

  // const swapExactTokensForETH = await ammSelector.swapExactTokensForETH(addr.UNI, "1000", deadline, "1");
  // console.log("5: ",swapExactTokensForETH);

  // const swapETHForExactTokens = await ammSelector.swapETHForExactTokens(addr.UNI, "1000", deadline, {value: "10000"});
  // console.log("6: ",swapETHForExactTokens);

  // multi path swap
  // const PathArr1:string[] = [addr.WETH, addr.DAI];
  // const FeeArr1:FeeAmount[] = [FeeAmount.MEDIUM];
  // const EncodedPath1 = encodePath(PathArr1, FeeArr1);
  // const swapEthOnUniswap = await ammSelector.swapEthOnUniswap(EncodedPath1, deadline, "1", {value : "1000"});
  // console.log("7:", swapEthOnUniswap);

  // const pathArr2:string[] = [addr.UNI, addr.WETH, addr.DAI];
  // const feeArr2:FeeAmount[] = [FeeAmount.MEDIUM, FeeAmount.MEDIUM];
  // const encodedPath2 = encodePath(pathArr2, feeArr2);
  // const swapTokensInOnUniswap = await ammSelector.swapTokensInOnUniswap(encodedPath2, addr.UNI, "1000",deadline, "1");
  // console.log("8: ",swapTokensInOnUniswap);

  // const pathArr3:string[] = [addr.DAI, addr.WETH, addr.UNI];
  // const feeArr3:FeeAmount[] = [FeeAmount.MEDIUM, FeeAmount.MEDIUM];
  // const encodedPath3 = encodePath(pathArr3, feeArr3);
  // const swapTokensOutOnUniswap = await ammSelector.swapTokensOutOnUniswap(encodedPath3, addr.UNI, "1000", deadline, "10000");
  // console.log("9: ",swapTokensOutOnUniswap);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
