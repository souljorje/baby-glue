import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GLUE_ADDRESS, TOKEN_ADDRESS } from '@config/contracts';
import { zeroAddress } from 'viem';
import { GlueConcepts } from '../ui/glue-concepts';
import { GlueMetricsPanel } from '../ui/glue-metrics';
import { GlueActions } from '../ui/glue-actions';
import { useGlueDemo } from '../model/hooks';
import { MascotBubble } from '@ui/mascot-bubble';

export function GlueDemoPanel() {
  const {
    isConnected,
    isWrongChain,
    depositAmount,
    setDepositAmount,
    burnAmount,
    setBurnAmount,
    handleDeposit,
    handleUnglue,
    isDepositBusy,
    isUnglueBusy,
    isApproving,
    isDepositSuccess,
    isUnglueSuccess,
    mascotStep,
    mascotMessage,
    metricsQuery
  } = useGlueDemo();

  const isConfigured = TOKEN_ADDRESS !== zeroAddress && GLUE_ADDRESS !== zeroAddress;

  const mascotTone = mascotStep === 'warning' ? 'warning' : mascotStep === 'done' ? 'success' : 'normal';

  return (
    <section className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Connect wallet on Base Sepolia</p>
          <p className="text-sm text-muted-foreground">Token: {TOKEN_ADDRESS}</p>
          <p className="text-sm text-muted-foreground">Glue vault: {GLUE_ADDRESS}</p>
        </div>
        <ConnectButton />
      </div>

      {!isConfigured && (
        <MascotBubble title="Setup Needed" message="Add VITE_TOKEN_ADDRESS and VITE_GLUE_ADDRESS in frontend/.env first." tone="warning" />
      )}

      {isWrongChain && (
        <MascotBubble title="Wrong Chain" message="Please switch your wallet to Base Sepolia to continue." tone="warning" />
      )}

      <MascotBubble title="Glue Mascot" message={mascotMessage} tone={mascotTone} />

      <GlueConcepts />

      <GlueMetricsPanel metrics={metricsQuery.data} isLoading={metricsQuery.isLoading} />

      <GlueActions
        depositAmount={depositAmount}
        burnAmount={burnAmount}
        setDepositAmount={setDepositAmount}
        setBurnAmount={setBurnAmount}
        handleDeposit={handleDeposit}
        handleUnglue={handleUnglue}
        isDepositBusy={isDepositBusy}
        isUnglueBusy={isUnglueBusy}
        isApproving={isApproving}
        isConnected={isConnected}
        isWrongChain={isWrongChain}
      />

      <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <p className="rounded-xl border border-border bg-surface px-3 py-2">Deposit status: {isDepositSuccess ? 'Done' : isDepositBusy ? 'Working' : 'Waiting'}</p>
        <p className="rounded-xl border border-border bg-surface px-3 py-2">Unglue status: {isUnglueSuccess ? 'Done' : isUnglueBusy ? 'Working' : 'Waiting'}</p>
      </div>
    </section>
  );
}
