import { useEffect, useMemo, useState } from 'react';
import { parseEther, parseUnits, type Address, zeroAddress } from 'viem';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { CHAIN_ID, GLUE_ADDRESS, TOKEN_ABI, TOKEN_ADDRESS } from '@config/contracts';
import { mascotStepSchema, type MascotStep } from './schemas';
import { useGlueMetricsQuery } from './queries';

const mascotMessageMap: Record<MascotStep, string> = {
  connect: 'Hi! Connect your wallet so I can show your piggy bank.',
  deposit: 'Step 1: put ETH into the piggy bank. Bigger piggy bank means bigger share.',
  unglue: 'Step 2: burn some tokens to claim your fair slice of the piggy bank.',
  done: 'Great job! You completed the full Glue story.',
  warning: 'Oops! We hit a tiny bump. Read the helper line below.'
};

function mapErrorToKidMessage(errorMessage: string) {
  if (errorMessage.toLowerCase().includes('rejected')) {
    return 'You canceled in wallet. That is okay, try again when ready.';
  }

  if (errorMessage.toLowerCase().includes('insufficient')) {
    return 'Not enough balance yet. Add funds or use a smaller amount.';
  }

  return 'Transaction failed. Try one more time with a smaller amount.';
}

export function useGlueDemo() {
  const { address, chain, isConnected } = useAccount();

  const [depositAmount, setDepositAmount] = useState('0.001');
  const [burnAmount, setBurnAmount] = useState('10');
  const [mascotStep, setMascotStep] = useState<MascotStep>('connect');
  const [errorMessage, setErrorMessage] = useState('');

  const isWrongChain = Boolean(chain && chain.id !== CHAIN_ID);

  const metricsQuery = useGlueMetricsQuery({
    tokenAddress: TOKEN_ADDRESS,
    glueAddress: GLUE_ADDRESS,
    userAddress: address as Address | undefined
  });

  const {
    sendTransaction,
    data: depositHash,
    error: depositWriteError,
    isPending: isDepositWalletPending
  } = useSendTransaction();

  const {
    isLoading: isDepositConfirming,
    isSuccess: isDepositSuccess,
    error: depositConfirmError
  } = useWaitForTransactionReceipt({ hash: depositHash });

  const {
    writeContract,
    data: unglueHash,
    error: unglueWriteError,
    isPending: isUnglueWalletPending
  } = useWriteContract();

  const {
    isLoading: isUnglueConfirming,
    isSuccess: isUnglueSuccess,
    error: unglueConfirmError
  } = useWaitForTransactionReceipt({ hash: unglueHash });

  useEffect(() => {
    if (!isConnected) {
      setMascotStep('connect');
      setErrorMessage('');
      return;
    }

    if (isWrongChain) {
      setMascotStep('warning');
      setErrorMessage('Please switch wallet network to Base Sepolia first.');
      return;
    }

    if (isUnglueSuccess) {
      setMascotStep('done');
      setErrorMessage('');
      return;
    }

    if (isDepositSuccess) {
      setMascotStep('unglue');
      setErrorMessage('');
      return;
    }

    setMascotStep('deposit');
    setErrorMessage('');
  }, [isConnected, isWrongChain, isDepositSuccess, isUnglueSuccess]);

  useEffect(() => {
    if (isDepositSuccess || isUnglueSuccess) {
      metricsQuery.mutate();
    }
  }, [isDepositSuccess, isUnglueSuccess, metricsQuery]);

  useEffect(() => {
    const firstError = depositWriteError || depositConfirmError || unglueWriteError || unglueConfirmError;

    if (!firstError) {
      return;
    }

    setMascotStep('warning');
    setErrorMessage(mapErrorToKidMessage(firstError.message));
  }, [depositWriteError, depositConfirmError, unglueWriteError, unglueConfirmError]);

  const mascotMessage = useMemo(() => {
    if (errorMessage) {
      return errorMessage;
    }

    return mascotMessageMap[mascotStepSchema.parse(mascotStep)];
  }, [errorMessage, mascotStep]);

  const isDepositBusy = isDepositWalletPending || isDepositConfirming;
  const isUnglueBusy = isUnglueWalletPending || isUnglueConfirming;

  const handleDeposit = () => {
    if (!depositAmount || isWrongChain) {
      return;
    }

    setMascotStep('deposit');
    setErrorMessage('');

    sendTransaction({
      to: GLUE_ADDRESS,
      value: parseEther(depositAmount)
    });
  };

  const handleUnglue = () => {
    if (!address || !burnAmount || isWrongChain) {
      return;
    }

    const decimals = metricsQuery.data?.decimals ?? 18;

    setMascotStep('unglue');
    setErrorMessage('');

    writeContract({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'unglue',
      args: [[zeroAddress], parseUnits(burnAmount, decimals), [], address]
    });
  };

  return {
    address,
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
    isDepositSuccess,
    isUnglueSuccess,
    mascotStep,
    mascotMessage,
    metricsQuery
  };
}
