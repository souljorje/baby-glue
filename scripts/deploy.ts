import { ethers } from 'hardhat';

const GLUE_STICK_ERC20 = '0x5fEe29873DE41bb6bCAbC1E4FB0Fc4CB26a7Fd74';
const READ_RETRY_COUNT = 12;
const READ_RETRY_DELAY_MS = 2500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry<T>(fn: () => Promise<T>, isValid: (value: T) => boolean, errorMessage: string) {
  let lastValue: T | undefined;

  for (let attempt = 1; attempt <= READ_RETRY_COUNT; attempt += 1) {
    const value = await fn();
    lastValue = value;

    if (isValid(value)) {
      return value;
    }

    if (attempt < READ_RETRY_COUNT) {
      await sleep(READ_RETRY_DELAY_MS);
    }
  }

  throw new Error(`${errorMessage}. Last value: ${String(lastValue)}`);
}

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH');

  const contractFactory = await ethers.getContractFactory('BackedDemoToken');
  const contract = await contractFactory.deploy(deployer.address);
  const deployTx = contract.deploymentTransaction();

  if (!deployTx) {
    throw new Error('Deployment transaction was not created');
  }

  console.log('Deployment tx hash:', deployTx.hash);

  const deployReceipt = await deployTx.wait(1);

  if (!deployReceipt || deployReceipt.status !== 1) {
    throw new Error(`Deployment transaction failed. Hash: ${deployTx.hash}`);
  }

  const tokenAddress = await contract.getAddress();
  await retry(
    () => ethers.provider.getCode(tokenAddress),
    (bytecode) => bytecode !== '0x',
    `Deployment failed: no bytecode at ${tokenAddress}`
  );

  let glueAddress = ethers.ZeroAddress;

  try {
    glueAddress = await retry(
      () => contract.getGlue(),
      (address) => address !== ethers.ZeroAddress,
      `getGlue() did not return a valid address for token ${tokenAddress}`
    );
  } catch {
    const glueStick = new ethers.Contract(
      GLUE_STICK_ERC20,
      ['function getGlueAddress(address asset) view returns (address glueAddress)'],
      deployer
    );

    glueAddress = await retry(
      () => glueStick.getGlueAddress(tokenAddress),
      (address) => address !== ethers.ZeroAddress,
      `Glue address not found in GlueStick for token ${tokenAddress}`
    );
  }

  if (glueAddress === ethers.ZeroAddress) {
    throw new Error(`Glue address not found for token ${tokenAddress}`);
  }

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
