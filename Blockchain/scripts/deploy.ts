// scripts/deploy.js
async function main() {
	const [deployer] = await ethers.getSigners();
  
	console.log("Deploying contracts with the account:", deployer.address);
  
	const RealEstateToken = await ethers.getContractFactory("RealEstateToken");
	const realEstateToken = await RealEstateToken.deploy(1000000, ethers.utils.parseEther("1000"));
  
	console.log("RealEstateToken deployed to:", realEstateToken.address);
  }
  
  main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
  });
  