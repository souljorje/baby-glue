import { useEffect, useMemo, useRef, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatUnits } from 'viem';
import { GLUE_ADDRESS, TOKEN_ADDRESS } from '@config/contracts';
import { formatNumber } from '@lib/format';
import { zeroAddress } from 'viem';
import { useGlueDemo } from '../model/hooks';
import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { Input } from '@ui/input';
import { cn } from '@lib/cn';
import mascotImg from '../../../public/ChatGPTImage.png';

const journeySteps = [
  { id: 'intro', label: 'Welcome' },
  { id: 'connect', label: 'Connect Wallet' },
  { id: 'claim', label: 'Get Cookie Coupons' },
  { id: 'deposit', label: 'Fill Cookie Jar' },
  { id: 'unglue', label: 'Crumble For Cookies' },
  { id: 'done', label: 'Journey Complete' }
] as const;

type JourneyStepId = (typeof journeySteps)[number]['id'];

function useAnimatedNumber(targetValue: number, durationMs = 650) {
  const [animatedValue, setAnimatedValue] = useState(targetValue);

  useEffect(() => {
    const startValue = animatedValue;
    const delta = targetValue - startValue;

    if (Math.abs(delta) < 0.0000001) {
      setAnimatedValue(targetValue);
      return;
    }

    let frame = 0;
    let frameId = 0;
    const totalFrames = Math.max(12, Math.round(durationMs / 16));

    const runFrame = () => {
      frame += 1;
      const progress = frame / totalFrames;
      const eased = 1 - (1 - progress) * (1 - progress);
      setAnimatedValue(startValue + delta * Math.min(1, eased));

      if (frame < totalFrames) {
        frameId = requestAnimationFrame(runFrame);
      }
    };

    frameId = requestAnimationFrame(runFrame);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [targetValue]);

  return animatedValue;
}

function formatAnimatedStatValue(value: number, digits: number) {
  const absoluteValue = Math.abs(value);

  if (absoluteValue > 0 && absoluteValue < 10 ** -digits) {
    return `<${(10 ** -digits).toFixed(digits)}`;
  }

  return formatNumber(value, digits);
}

type InlineStatProps = {
  label: string;
  rawValue: number;
  suffix?: string;
  digits: number;
  accentClassName: string;
};

function InlineStat({ label, rawValue, suffix = '', digits, accentClassName }: InlineStatProps) {
  const animatedValue = useAnimatedNumber(rawValue);
  const [isPopping, setIsPopping] = useState(false);

  useEffect(() => {
    setIsPopping(true);
    const timeoutId = window.setTimeout(() => setIsPopping(false), 420);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [rawValue]);

  return (
    <p className="whitespace-nowrap text-xs font-black">
      <span className="uppercase tracking-wide text-muted-foreground">{label}:</span>{' '}
      <span className={cn('tabular-nums', accentClassName, isPopping && 'animate-[metric-pop_420ms_var(--ease-bounce)]')}>
        {formatAnimatedStatValue(animatedValue, digits)}{suffix}
      </span>
    </p>
  );
}

function StepConfetti({ burstKey }: { burstKey: number }) {
  return (
    <div key={burstKey} className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, index) => (
        <span
          key={`${burstKey}-${index}`}
          className="absolute top-2 block h-2 w-1.5 rounded-full animate-[confetti-fall_680ms_ease-out_forwards]"
          style={{
            left: `${8 + index * 6}%`,
            backgroundColor: index % 3 === 0 ? '#39FF14' : index % 3 === 1 ? '#FF4FD8' : '#00B7FF',
            animationDelay: `${(index % 5) * 30}ms`,
            transform: `translateY(0) rotate(${index * 17}deg)`
          }}
        />
      ))}
    </div>
  );
}

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
    isDepositSuccess,
    isUnglueSuccess,
    mascotStep,
    mascotMessage,
    metricsQuery
  } = useGlueDemo();

  const [hasStartedJourney, setHasStartedJourney] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const previousStepIdRef = useRef<JourneyStepId | null>(null);

  const isConfigured = TOKEN_ADDRESS !== zeroAddress && GLUE_ADDRESS !== zeroAddress;
  const mascotTone = mascotStep === 'warning' ? 'warning' : mascotStep === 'done' ? 'success' : 'normal';
  const isJourneyDone = isUnglueSuccess;
  const shouldShowClaimStep = isConfigured && isConnected && !isWrongChain && !hasTokens && !isJourneyDone;
  const isDepositDone = isDepositSuccess || isJourneyDone;

  const liveStepId: JourneyStepId = !isConfigured || !isConnected || isWrongChain ? 'connect' : isJourneyDone ? 'done' : shouldShowClaimStep ? 'claim' : isDepositDone ? 'unglue' : 'deposit';
  const currentStepId: JourneyStepId = hasStartedJourney ? liveStepId : 'intro';

  const currentJourneyStepIndex = journeySteps.findIndex((step) => step.id === currentStepId);
  const progressPercent = Math.round(((currentJourneyStepIndex + 1) / journeySteps.length) * 100);

  useEffect(() => {
    if (!hasStartedJourney) {
      previousStepIdRef.current = currentStepId;
      return;
    }

    const previousStepId = previousStepIdRef.current;
    if (previousStepId && previousStepId !== currentStepId) {
      setConfettiBurst((value) => value + 1);
    }

    previousStepIdRef.current = currentStepId;
  }, [currentStepId, hasStartedJourney]);

  const speechToneClassName = mascotTone === 'warning' ? 'text-yellow' : mascotTone === 'success' ? 'text-brand' : 'text-text-secondary';

  const metrics = metricsQuery.data;

  const topStats = useMemo(() => {
    if (!metrics) {
      return {
        piggyEth: 0,
        myTokens: 0,
        allTokens: 0,
        backingPerToken: 0
      };
    }

    return {
      piggyEth: Number(formatUnits(metrics.glueEthBalance, 18)),
      myTokens: Number(formatUnits(metrics.userBalance, metrics.decimals)),
      allTokens: Number(formatUnits(metrics.totalSupply, metrics.decimals)),
      backingPerToken: Number(metrics.estimatedBackingPerToken)
    };
  }, [metrics]);

  return (
    <section>
      <Card className="relative space-y-4 overflow-hidden">
        <StepConfetti burstKey={confettiBurst} />

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <InlineStat label="Cookie Jar" rawValue={topStats.piggyEth} suffix=" ETH" digits={4} accentClassName="text-brand" />
            <InlineStat label="My Coupons" rawValue={topStats.myTokens} digits={4} accentClassName="text-pink" />
            <InlineStat label="All Coupons" rawValue={topStats.allTokens} digits={4} accentClassName="text-blue" />
            <InlineStat label="Cookies/Coupon" rawValue={topStats.backingPerToken} suffix=" ETH" digits={6} accentClassName="text-yellow" />
          </div>
          <ConnectButton.Custom>
            {({ mounted, account, chain, openConnectModal, openAccountModal, openChainModal }) => {
              const isReady = mounted;
              const isConnectedWallet = isReady && account && chain;
              const walletAction = !isConnectedWallet ? openConnectModal : chain?.unsupported ? openChainModal : openAccountModal;

              return (
                <Button type="button" onClick={walletAction} className="h-10 min-w-[44px] px-2 text-2xl leading-none" aria-label="Wallet">
                  👛
                </Button>
              );
            }}
          </ConnectButton.Custom>
        </div>

        <div className="border-b border-border/70 pb-3">
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div key={currentStepId} className="space-y-4 animate-[step-swap_420ms_var(--ease-bounce)]">
          <div className="flex items-start gap-5">
            <img src={mascotImg} alt="Glue Mascot" className="h-[280px] w-[280px] shrink-0 object-contain drop-shadow-[0_0_12px_rgba(124,255,91,0.35)] sm:h-[400px] sm:w-[400px]" />
            <div>
              <p className={cn('min-h-[180px] text-2xl font-black leading-tight sm:text-3xl', speechToneClassName)}>{mascotMessage}</p>
            </div>
          </div>

          {currentStepId === 'intro' && (
            <Button onClick={() => setHasStartedJourney(true)} className="w-full">Start Journey</Button>
          )}

          {currentStepId === 'connect' && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Use Base Sepolia so Baby Glue can read your balances.</p>
              <p>Token: {TOKEN_ADDRESS}</p>
              <p>Glue vault: {GLUE_ADDRESS}</p>
            </div>
          )}

          {currentStepId === 'claim' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">This wallet has no coupons yet. Claim free cookie coupons first.</p>
              <Button onClick={handleClaimDemoTokens} disabled={isClaimBusy} className="w-full">
                {isClaimBusy ? 'Claiming...' : 'Get Cookie Coupons'}
              </Button>
            </div>
          )}

          {currentStepId === 'deposit' && (
            <div className="space-y-3">
              <Input value={depositAmount} onChange={(event) => setDepositAmount(event.target.value)} placeholder="ETH amount (ex: 0.001)" inputMode="decimal" />
              <Button onClick={handleDeposit} disabled={isDepositBusy} className="w-full">
                {isDepositBusy ? 'Baking...' : 'Bake Cookies Into Jar'}
              </Button>
            </div>
          )}

          {currentStepId === 'unglue' && (
            <div className="space-y-3">
              <Input value={burnAmount} onChange={(event) => setBurnAmount(event.target.value)} placeholder="Coupon amount (ex: 10)" inputMode="decimal" />
              <Button onClick={handleUnglue} disabled={isUnglueBusy} className="w-full">
                {isApproving ? 'Approving...' : isUnglueBusy ? 'Crumbling...' : 'Crumble Coupons'}
              </Button>
            </div>
          )}

          {currentStepId === 'done' && (
            <Button variant="ghost" onClick={() => setHasStartedJourney(false)} className="w-full">Replay From Start</Button>
          )}
        </div>
      </Card>
    </section>
  );
}
