import { ethers } from "hardhat";
import addr from "./address.json";

async function main() {
  const contractAddr = "0x8740637DC15e48b158A2E16BF1828791dD5401b2";

  // console.log(await allowance(addr.UNI, contractAddr));
  // console.log(await allowance(addr.DAI, contractAddr));
  console.log(await allowance(contractAddr, addr.sushiswap));
  console.log(await allowance(contractAddr, addr.uniswap));
}

async function allowance(erc20: string, spender: string) {
  const abi = ["function allowance(address owner, address spender) external view returns (uint256)"];
  const [owner] = await ethers.getSigners();
  const erc20_rw = new ethers.Contract(erc20, abi, owner);
  const res = await erc20_rw.attach(erc20).allowance(owner.address, spender);

  return res;
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
