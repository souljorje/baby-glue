import type { Abi, Address } from 'viem';

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 84532);
export const TOKEN_ADDRESS = (import.meta.env.VITE_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000') as Address;
export const GLUE_ADDRESS = (import.meta.env.VITE_GLUE_ADDRESS || '0x0000000000000000000000000000000000000000') as Address;

export const TOKEN_ABI = [
  {
    type: 'function',
    stateMutability: 'view',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'unglue',
    inputs: [
      { name: 'collaterals', type: 'address[]' },
      { name: 'amount', type: 'uint256' },
      { name: 'tokenIds', type: 'uint256[]' },
      { name: 'recipient', type: 'address' }
    ],
    outputs: [
      { name: 'supplyDelta', type: 'uint256' },
      { name: 'realAmount', type: 'uint256' },
      { name: 'beforeTotalSupply', type: 'uint256' },
      { name: 'afterTotalSupply', type: 'uint256' }
    ]
  }
] as const satisfies Abi;
