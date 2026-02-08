import { formatUnits } from 'viem';

export function formatNumber(value: number, maximumFractionDigits = 4) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);
}

export function formatTokenAmount(value: bigint, decimals: number, maximumFractionDigits = 4) {
  const asNumber = Number(formatUnits(value, decimals));
  return formatNumber(asNumber, maximumFractionDigits);
}

export function calculateBackingPerToken(glueEthBalance: bigint, totalSupply: bigint, tokenDecimals: number) {
  if (totalSupply === 0n) {
    return '0';
  }

  const precision = 10n ** BigInt(tokenDecimals);
  const weiPerToken = (glueEthBalance * precision) / totalSupply;
  const asNumber = Number(formatUnits(weiPerToken, 18));

  return formatNumber(asNumber, 12);
}
