import { ethers } from "hardhat";
import { AMMSelector, AMMSelector__factory } from "../../typechain";
import addr from "./address.json";

async function main() {
  const contractAddr = addr.contractAddr;

  const ammSelectorFactory: AMMSelector__factory = await ethers.getContractFactory("AMMSelector");
  const ammSelector: AMMSelector = <AMMSelector>await ammSelectorFactory.attach(contractAddr);

  console.log(await ammSelector.approveContract(addr.UNI));
  console.log(await approve(addr.UNI, contractAddr, "50000"));
}

async function approve(erc20: string, spender: string, amount: string) {
  const abi = ["function approve(address spender, uint256 amount) external returns (bool)"];
  const [owner] = await ethers.getSigners();
  const erc20_rw = new ethers.Contract(erc20, abi, owner);
  const res = await erc20_rw.attach(erc20).approve(spender, amount);

  return res;
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
