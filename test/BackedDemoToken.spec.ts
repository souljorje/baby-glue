import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('BackedDemoToken', () => {
  async function deployFixture() {
    const [owner] = await ethers.getSigners();
    const factory = await ethers.getContractFactory('BackedDemoToken');
    const token = await factory.deploy(owner.address);
    await token.waitForDeployment();

    return { owner, token };
  }

  it('mints the full initial supply to deployer', async () => {
    const { owner, token } = await deployFixture();

    expect(await token.totalSupply()).to.equal(await token.INITIAL_SUPPLY());
    expect(await token.balanceOf(owner.address)).to.equal(await token.INITIAL_SUPPLY());
  });

  it('creates a non-zero glue address', async () => {
    const { token } = await deployFixture();

    expect(await token.getGlue()).to.not.equal(ethers.ZeroAddress);
  });

  it('allows each wallet to claim demo tokens once', async () => {
    const { owner, token } = await deployFixture();
    const [, secondWallet] = await ethers.getSigners();

    await token.connect(secondWallet).claimDemoTokens();

    expect(await token.balanceOf(secondWallet.address)).to.equal(await token.DEMO_CLAIM_AMOUNT());

    await expect(token.connect(secondWallet).claimDemoTokens()).to.be.revertedWith('Demo tokens already claimed');

    expect(await token.balanceOf(owner.address)).to.equal(await token.INITIAL_SUPPLY());
  });

  it('allows proportional ETH redemption with unglue', async () => {
    const { owner, token } = await deployFixture();
    const glueAddress = await token.getGlue();
    const depositAmount = ethers.parseEther('1');
    const burnAmount = ethers.parseEther('1000');

    await owner.sendTransaction({ to: glueAddress, value: depositAmount });
    await token.approve(await token.getAddress(), burnAmount);

    const totalSupplyBefore = await token.totalSupply();
    const userEthBefore = await ethers.provider.getBalance(owner.address);

    const tx = await token.unglue([ethers.ZeroAddress], burnAmount, [], owner.address);
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('Missing transaction receipt');
    }

    const effectiveGasPrice = receipt.gasPrice ?? tx.gasPrice ?? 0n;
    const gasCost = receipt.gasUsed * effectiveGasPrice;
    const userEthAfter = await ethers.provider.getBalance(owner.address);
    const netEthDelta = userEthAfter + gasCost - userEthBefore;

    const expectedShare = (depositAmount * burnAmount) / totalSupplyBefore;

    expect(netEthDelta).to.be.greaterThan(0n);
    expect(netEthDelta).to.be.lessThanOrEqual(expectedShare);
    expect(await token.totalSupply()).to.equal(totalSupplyBefore - burnAmount);
  });

  it('reverts when burn amount is zero', async () => {
    const { owner, token } = await deployFixture();

    await expect(token.unglue([ethers.ZeroAddress], 0n, [], owner.address)).to.be.reverted;
  });
});
