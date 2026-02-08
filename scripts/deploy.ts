import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH');

  const contractFactory = await ethers.getContractFactory('BackedDemoToken');
  const contract = await contractFactory.deploy(deployer.address);
  await contract.waitForDeployment();

  const tokenAddress = await contract.getAddress();
  const glueAddress = await contract.getGlue();

  console.log('BackedDemoToken deployed to:', tokenAddress);
  console.log('Glue vault address:', glueAddress);
  console.log('Frontend .env values:');
  console.log(`VITE_CHAIN_ID=84532`);
  console.log(`VITE_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`VITE_GLUE_ADDRESS=${glueAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
