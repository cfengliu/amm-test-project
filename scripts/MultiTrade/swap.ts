import { ethers } from "hardhat";
import { MultiTrade, MultiTrade__factory } from "../../typechain";

async function main() {
  const contractAddr = "0x844A6BF0Ef496614245336e54d9d93B5914c5b50";

  const multiTradeFactory: MultiTrade__factory = await ethers.getContractFactory("MultiTrade");
  const multi: MultiTrade = <MultiTrade>await multiTradeFactory.attach(contractAddr);

  const estimatedDAI = await multi.multiSwap("1630058255", "1", "1", "1", { value: "100000000000000000" });

  console.log(estimatedDAI);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
