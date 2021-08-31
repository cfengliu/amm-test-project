import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { ethers } from "hardhat";

import { MultiTrade, MultiTrade__factory } from "../../typechain";

task("deploy:MultiTrade")
  // .addParam("greeting", "Say hello, be nice")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const multiTradeFactory: MultiTrade__factory = await ethers.getContractFactory("MultiTrade");
    const multi: MultiTrade = <MultiTrade>await multiTradeFactory.deploy();
    await multi.deployed();
    console.log("Greeter deployed to: ", multi.address);
  });
