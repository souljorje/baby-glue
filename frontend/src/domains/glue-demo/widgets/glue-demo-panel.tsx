import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GLUE_ADDRESS, TOKEN_ADDRESS } from '@config/contracts';
import { zeroAddress } from 'viem';
import { GlueMetricsPanel } from '../ui/glue-metrics';
import { useGlueDemo } from '../model/hooks';
import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { Input } from '@ui/input';
import { MascotBubble } from '@ui/mascot-bubble';

const journeySteps = [
  { id: 'connect', label: 'Connect Wallet' },
  { id: 'claim', label: 'Get Demo Tokens' },
  { id: 'deposit', label: 'Fill Piggy Bank' },
  { id: 'unglue', label: 'Burn For Share' },
  { id: 'done', label: 'Journey Complete' }
] as const;

export function GlueDemoPanel() {
  const {
    isConnected,
    isWrongChain,
    depositAmount,
    setDepositAmount,
    burnAmount,
    setBurnAmount,
    handleClaimDemoTokens,
    handleDeposit,
    handleUnglue,
    hasTokens,
    isClaimBusy,
    isDepositBusy,
    isUnglueBusy,
    isApproving,
    isClaimSuccess,
    isDepositSuccess,
    isUnglueSuccess,
    mascotStep,
    mascotMessage,
    metricsQuery
  } = useGlueDemo();

  const isConfigured = TOKEN_ADDRESS !== zeroAddress && GLUE_ADDRESS !== zeroAddress;
  const mascotTone = mascotStep === 'warning' ? 'warning' : mascotStep === 'done' ? 'success' : 'normal';
  const isJourneyDone = isUnglueSuccess;
  const shouldShowClaimStep = isConfigured && isConnected && !isWrongChain && !hasTokens && !isJourneyDone;
  const isDepositDone = isDepositSuccess || isJourneyDone;

  const currentJourneyStepIndex = !isConfigured || !isConnected || isWrongChain ? 0 : isJourneyDone ? 4 : shouldShowClaimStep ? 1 : isDepositDone ? 3 : 2;
  const currentStep = journeySteps[currentJourneyStepIndex];
  const progressPercent = Math.round(((currentJourneyStepIndex + 1) / journeySteps.length) * 100);

  return (
    <section className="space-y-4">
      <Card className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">Wallet</p>
          <p className="text-sm text-muted-foreground">Keep this menu visible to switch or disconnect anytime.</p>
        </div>
        <ConnectButton />
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">Journey Progress</p>
          <p className="text-sm font-semibold text-foreground">
            Step {currentJourneyStepIndex + 1}/{journeySteps.length}: {currentStep.label}
          </p>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>

      <MascotBubble title="Glue Mascot" message={mascotMessage} tone={mascotTone} />

      {!isConfigured && (
        <Card className="space-y-3">
          <h3 className="text-base font-black text-foreground">Step 1: App Setup</h3>
          <p className="text-sm text-muted-foreground">Add contract addresses first so the game can start.</p>
          <p className="text-sm text-muted-foreground">Set `VITE_TOKEN_ADDRESS` and `VITE_GLUE_ADDRESS` in `frontend/.env`.</p>
        </Card>
      )}

      {isConfigured && (!isConnected || isWrongChain) && (
        <Card className="space-y-3">
          <h3 className="text-base font-black text-foreground">Step 1: Connect Wallet</h3>
          <p className="text-sm text-muted-foreground">Use Base Sepolia so Baby Glue can read your balances.</p>
          <p className="text-sm text-muted-foreground">Token: {TOKEN_ADDRESS}</p>
          <p className="text-sm text-muted-foreground">Glue vault: {GLUE_ADDRESS}</p>
        </Card>
      )}

      {shouldShowClaimStep && (
        <Card className="space-y-3">
          <h3 className="text-base font-black text-foreground">Step 2: Get Demo Tokens</h3>
          <p className="text-sm text-muted-foreground">This wallet has no tokens yet. Claim free demo tokens first.</p>
          <Button onClick={handleClaimDemoTokens} disabled={isClaimBusy} className="w-full">
            {isClaimBusy ? 'Claiming...' : 'Get Demo Tokens'}
          </Button>
        </Card>
      )}

      {isConfigured && isConnected && !isWrongChain && hasTokens && !isDepositDone && (
        <Card className="space-y-3">
          <h3 className="text-base font-black text-foreground">Step 3: Fill Piggy Bank</h3>
          <p className="text-sm text-muted-foreground">Put ETH into Glue to grow shared backing for all tokens.</p>
          <Input value={depositAmount} onChange={(event) => setDepositAmount(event.target.value)} placeholder="ETH amount (ex: 0.001)" inputMode="decimal" />
          <Button onClick={handleDeposit} disabled={isDepositBusy} className="w-full">
            {isDepositBusy ? 'Sending...' : 'Put ETH In Piggy Bank'}
          </Button>
        </Card>
      )}

      {isConfigured && isConnected && !isWrongChain && hasTokens && isDepositDone && !isJourneyDone && (
        <Card className="space-y-3">
          <h3 className="text-base font-black text-foreground">Step 4: Burn For Your Share</h3>
          <p className="text-sm text-muted-foreground">Burn tokens and claim your fair part of the piggy bank.</p>
          <Input value={burnAmount} onChange={(event) => setBurnAmount(event.target.value)} placeholder="Token amount (ex: 10)" inputMode="decimal" />
          <Button onClick={handleUnglue} disabled={isUnglueBusy} className="w-full">
            {isApproving ? 'Approving...' : isUnglueBusy ? 'Burning...' : 'Burn Tokens For Share'}
          </Button>
        </Card>
      )}

      {isConfigured && isConnected && !isWrongChain && isJourneyDone && (
        <Card className="space-y-3">
          <h3 className="text-base font-black text-foreground">Step 5: You Did It</h3>
          <p className="text-sm text-muted-foreground">You finished the full Baby Glue journey: deposit, then unglue.</p>
        </Card>
      )}

      {isConfigured && isConnected && !isWrongChain && (
        <div className="space-y-3">
          <GlueMetricsPanel metrics={metricsQuery.data} isLoading={metricsQuery.isLoading} />
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <p className="rounded-xl border border-border bg-surface px-3 py-2">Claim status: {isClaimSuccess || hasTokens ? 'Done' : isClaimBusy ? 'Working' : 'Waiting'}</p>
            <p className="rounded-xl border border-border bg-surface px-3 py-2">Deposit status: {isDepositSuccess ? 'Done' : isDepositBusy ? 'Working' : 'Waiting'}</p>
            <p className="rounded-xl border border-border bg-surface px-3 py-2">Unglue status: {isUnglueSuccess ? 'Done' : isUnglueBusy ? 'Working' : 'Waiting'}</p>
          </div>
        </div>
      )}
    </section>
  );
}
