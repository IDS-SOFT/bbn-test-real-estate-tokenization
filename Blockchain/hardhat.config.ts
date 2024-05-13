import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

task("distributeDividends", "Distributes dividends to token holders")
  .addParam("amount", "The amount of ether to distribute")
  .setAction(async (taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt("RealEstateToken", "YOUR_CONTRACT_ADDRESS_HERE");
    const tx = await contract.distributeDividends({ value: hre.ethers.utils.parseEther(taskArgs.amount) });
    await tx.wait();
    console.log(`Dividends distributed: ${taskArgs.amount} ETH`);
  });

task("withdrawDividends", "Withdraws dividends for the caller")
  .setAction(async (_, hre) => {
    const contract = await hre.ethers.getContractAt("RealEstateToken", "YOUR_CONTRACT_ADDRESS_HERE");
    const tx = await contract.withdrawDividends();
    await tx.wait();
    console.log("Dividends withdrawn");
  });
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    
    bbn_testnet: {
      url: "https://bbnrpc.hyderabad.bharatblockchain.io",
      chainId: 2023,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
  },
};

export default config;
