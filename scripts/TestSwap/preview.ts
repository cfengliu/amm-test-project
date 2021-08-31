import { ethers } from "hardhat";
import { TestSwap, TestSwap__factory } from "../../typechain";

async function main() {
  const contractAddr = "0x6E2A784ad460eB4D1376F85d65968896E4E783AC";

  console.log("TestSwap preview");

  const testSwapFactory: TestSwap__factory = await ethers.getContractFactory("TestSwap");
  const testSwap: TestSwap = <TestSwap>await testSwapFactory.attach(contractAddr);

  // DAI 0xad6d458402f60fd3bd25163575031acdce07538d
  // BNT 0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5
  // INJ 0x9108Ab1bb7D054a3C1Cd62329668536f925397e5
  //UNI 0x71d82eb6a5051cff99582f4cdf2ae9cd402a4882

  console.log(
    await testSwap.getAmountOutMin(
      "0x71d82eb6a5051cff99582f4cdf2ae9cd402a4882",
      "0xad6d458402f60fd3bd25163575031acdce07538d",
      "1000000000000",
    ),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
