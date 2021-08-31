import { Contract, ContractFactory } from "@ethersproject/contracts";
import { ethers } from "hardhat";

async function main() {
  const contractAddr = "0xD814bb9cfd0c5D55caf3CEf5D1bcDDFb81475D76";

  const GreeterFac: ContractFactory = await ethers.getContractFactory("Greeter");
  console.log("GreeterFac");
  const greeter: Contract = await GreeterFac.attach(contractAddr);

  console.log(await greeter.greet());
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
