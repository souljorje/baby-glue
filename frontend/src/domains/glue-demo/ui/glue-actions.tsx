import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { Input } from '@ui/input';

type GlueActionsProps = {
  depositAmount: string;
  burnAmount: string;
  setDepositAmount: (value: string) => unknown;
  setBurnAmount: (value: string) => unknown;
  handleDeposit: () => unknown;
  handleUnglue: () => unknown;
  isDepositBusy: boolean;
  isUnglueBusy: boolean;
  isApproving: boolean;
  isConnected: boolean;
  isWrongChain: boolean;
};

export function GlueActions({
  depositAmount,
  burnAmount,
  setDepositAmount,
  setBurnAmount,
  handleDeposit,
  handleUnglue,
  isDepositBusy,
  isUnglueBusy,
  isApproving,
  isConnected,
  isWrongChain
}: GlueActionsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Card className="space-y-3">
        <h3 className="text-base font-black text-foreground">Step 1: Fill the Cookie Jar</h3>
        <p className="text-sm text-text-secondary">Bake cookies into the jar to grow the shared pool.</p>
        <Input value={depositAmount} onChange={(event) => setDepositAmount(event.target.value)} placeholder="ETH amount (ex: 0.001)" inputMode="decimal" />
        <Button onClick={handleDeposit} disabled={!isConnected || isWrongChain || isDepositBusy} className="w-full">
          {isDepositBusy ? 'Baking...' : 'Bake Cookies Into Jar'}
        </Button>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-base font-black text-foreground">Step 2: Crumble for Cookies</h3>
        <p className="text-sm text-text-secondary">Crumble your coupons to grab your fair share from the jar.</p>
        <Input value={burnAmount} onChange={(event) => setBurnAmount(event.target.value)} placeholder="Coupon amount (ex: 10)" inputMode="decimal" />
        <Button variant="secondary" onClick={handleUnglue} disabled={!isConnected || isWrongChain || isUnglueBusy} className="w-full">
          {isApproving ? 'Approving...' : isUnglueBusy ? 'Crumbling...' : 'Crumble Coupons'}
        </Button>
      </Card>
    </section>
  );
}
