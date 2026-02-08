import { useEffect, useMemo, useState } from 'react';
import { maxUint256, parseEther, parseUnits, type Address, type Hash, zeroAddress } from 'viem';
import { useAccount, usePublicClient, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
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
  const normalizedMessage = errorMessage.toLowerCase();

  if (normalizedMessage.includes('rejected')) {
    return 'You canceled in wallet. That is okay, try again when ready.';
  }

  if (normalizedMessage.includes('allowance') || normalizedMessage.includes('noassetstransferred') || normalizedMessage.includes('0x2e659379')) {
    return 'Please approve token unlock first, then I can burn for your share.';
  }

  if (normalizedMessage.includes('insufficient')) {
    return 'Not enough balance yet. Add funds or use a smaller amount.';
  }

  return 'Transaction failed. Try one more time with a smaller amount.';
}

export function useGlueDemo() {
  const { address, chain, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [depositAmount, setDepositAmount] = useState('0.001');
  const [burnAmount, setBurnAmount] = useState('10');
  const [mascotStep, setMascotStep] = useState<MascotStep>('connect');
  const [errorMessage, setErrorMessage] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [unglueHash, setUnglueHash] = useState<Hash | undefined>();

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
    writeContractAsync,
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
  const isUnglueBusy = isApproving || isUnglueWalletPending || isUnglueConfirming;

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

  const handleUnglue = async () => {
    if (!address || !burnAmount || isWrongChain || !publicClient) {
      return;
    }

    const decimals = metricsQuery.data?.decimals ?? 18;
    const burnAmountWei = parseUnits(burnAmount, decimals);

    setMascotStep('unglue');
    setErrorMessage('');
    setUnglueHash(undefined);

    try {
      const allowance = await publicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'allowance',
        args: [address, TOKEN_ADDRESS]
      });

      if (allowance < burnAmountWei) {
        setIsApproving(true);
        setErrorMessage('First we unlock your tokens. Approve in wallet.');

        const approveHash = await writeContractAsync({
          address: TOKEN_ADDRESS,
          abi: TOKEN_ABI,
          functionName: 'approve',
          args: [TOKEN_ADDRESS, maxUint256]
        });

        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      setIsApproving(false);
      setErrorMessage('');

      const submittedUnglueHash = await writeContractAsync({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'unglue',
        args: [[zeroAddress], burnAmountWei, [], address]
      });

      setUnglueHash(submittedUnglueHash);
    } catch (error) {
      setIsApproving(false);
      setMascotStep('warning');

      if (error instanceof Error) {
        setErrorMessage(mapErrorToKidMessage(error.message));
      } else {
        setErrorMessage('Transaction failed. Try one more time with a smaller amount.');
      }
    }
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
    isApproving,
    isDepositSuccess,
    isUnglueSuccess,
    mascotStep,
    mascotMessage,
    metricsQuery
  };
}
