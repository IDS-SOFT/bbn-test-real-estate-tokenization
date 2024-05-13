// An example script that shows how to interact programmatically with a deployed contract
// You must customise it according to your contract's specifications

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

require('dotenv').config();
const { ethers } = require("hardhat");
import { expect } from "chai";

async function main() {
  const [deployer] = await ethers.getSigners();
  const contract = await ethers.getContractFactory("RealEstateToken"); // Specify here your contract name
  const contractAddress = process.env.CONTRACT_ADDRESS; // Read contract address from environment variable

  ////////////////
  //  PAYLOAD  //
  //////////////

  // Connect to the deployed RealEstateToken contract
  const [owner, user1] = await ethers.getSigners();
  const token = await ethers.getContractAt("RealEstateToken", contractAddress, owner);

  console.log("user1", user1, owner)
  // Distribute dividends
  console.log("Distributing dividends...");
  let tx = await token.distributeDividends({ value: ethers.utils.parseEther("1.0") });
  await tx.wait();
  console.log("Dividends distributed.");

  // Withdraw dividends for a user
  console.log(`Withdrawing dividends for ${user1.address}...`);
  await token.connect(user1).withdrawDividends();
  console.log("Dividends withdrawn.");

  // Transfer some tokens
  console.log(`Transferring tokens from owner to ${user1.address}...`);
  tx = await token.transfer(user1.address, 500);
  await tx.wait();
  console.log("Tokens transferred.");

  // Pause and unpause the contract (demonstrate control functions)
  console.log("Pausing the contract...");
  tx = await token.pause();
  await tx.wait();
  console.log("Contract paused.");

  console.log("Unpausing the contract...");
  tx = await token.unpause();
  await tx.wait();
  console.log("Contract unpaused.");
}

// To run it, invoke `npx hardhat run scripts/interact.ts --network <network_name>`
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});