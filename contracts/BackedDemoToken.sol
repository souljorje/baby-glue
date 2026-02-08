// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@glue-finance/expansions-pack/contracts/base/StickyAsset.sol';

contract BackedDemoToken is ERC20, ERC20Burnable, StickyAsset {
    uint256 public constant INITIAL_SUPPLY = 1_000_000e18;
    uint256 public constant DEMO_CLAIM_AMOUNT = 1_000e18;
    mapping(address => bool) public hasClaimedDemoTokens;

    constructor(address initialOwner)
        ERC20('Backed Demo Token', 'BDT')
        StickyAsset('ipfs://backed-demo-token', [true, false])
    {
        require(initialOwner != address(0), 'Invalid initial owner');
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    function claimDemoTokens() external {
        require(!hasClaimedDemoTokens[msg.sender], 'Demo tokens already claimed');
        hasClaimedDemoTokens[msg.sender] = true;
        _mint(msg.sender, DEMO_CLAIM_AMOUNT);
    }
}
