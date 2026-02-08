import { useEffect, useMemo, useState } from 'react';
import { maxUint256, parseEther, parseUnits, type Address, type Hash, zeroAddress } from 'viem';
import { useAccount, usePublicClient, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { CHAIN_ID, GLUE_ADDRESS, TOKEN_ABI, TOKEN_ADDRESS } from '@config/contracts';
import { mascotStepSchema, type MascotStep } from './schemas';
import { useGlueMetricsQuery } from './queries';

const mascotMessageMap: Record<MascotStep, string> = {
  connect: 'Hi! Connect your wallet so I can show the Cookie Jar.',
  claim: 'Grab your cookie coupons so you have something to play with!',
  deposit: 'Bake cookies and fill the Magic Jar. Bigger jar = bigger share!',
  unglue: 'Crumble a coupon to grab your fair share of cookies from the jar.',
  done: 'Yummy! You finished the full Cookie Jar adventure!',
  warning: 'Oops! We hit a tiny bump. Read the helper line below.'
};

function mapErrorToKidMessage(errorMessage: string) {
  const normalizedMessage = errorMessage.toLowerCase();

  if (normalizedMessage.includes('rejected')) {
    return 'You canceled in wallet. That is okay, try again when ready.';
  }

  if (normalizedMessage.includes('allowance') || normalizedMessage.includes('noassetstransferred') || normalizedMessage.includes('0x2e659379')) {
    return 'Please approve coupon unlock first, then I can crumble for your cookies.';
  }

  if (normalizedMessage.includes('insufficient')) {
    return 'Not enough balance yet. Add funds or use a smaller amount.';
  }

  if (normalizedMessage.includes('already claimed')) {
    return 'This wallet already got cookie coupons. You can continue to the next step.';
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
  const [claimHash, setClaimHash] = useState<Hash | undefined>();
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
    writeContractAsync: writeClaimContractAsync,
    error: claimWriteError,
    isPending: isClaimWalletPending
  } = useWriteContract();

  const {
    isLoading: isClaimConfirming,
    isSuccess: isClaimSuccess,
    error: claimConfirmError
  } = useWaitForTransactionReceipt({ hash: claimHash });

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

  const hasTokens = (metricsQuery.data?.userBalance ?? 0n) > 0n;

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

    if (!hasTokens && !isClaimSuccess) {
      setMascotStep('claim');
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
  }, [hasTokens, isClaimSuccess, isConnected, isWrongChain, isDepositSuccess, isUnglueSuccess]);

  useEffect(() => {
    if (isClaimSuccess || isDepositSuccess || isUnglueSuccess) {
      metricsQuery.mutate();
    }
  }, [isClaimSuccess, isDepositSuccess, isUnglueSuccess, metricsQuery]);

  useEffect(() => {
    const firstError = claimWriteError || claimConfirmError || depositWriteError || depositConfirmError || unglueWriteError || unglueConfirmError;

    if (!firstError) {
      return;
    }

    setMascotStep('warning');
    setErrorMessage(mapErrorToKidMessage(firstError.message));
  }, [claimWriteError, claimConfirmError, depositWriteError, depositConfirmError, unglueWriteError, unglueConfirmError]);

  const mascotMessage = useMemo(() => {
    if (errorMessage) {
      return errorMessage;
    }

    return mascotMessageMap[mascotStepSchema.parse(mascotStep)];
  }, [errorMessage, mascotStep]);

  const isClaimBusy = isClaimWalletPending || isClaimConfirming;
  const isDepositBusy = isDepositWalletPending || isDepositConfirming;
  const isUnglueBusy = isApproving || isUnglueWalletPending || isUnglueConfirming;

  const handleClaimDemoTokens = async () => {
    if (isWrongChain) {
      return;
    }

    setMascotStep('claim');
    setErrorMessage('');
    setClaimHash(undefined);

    try {
      const submittedClaimHash = await writeClaimContractAsync({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'claimDemoTokens',
        args: []
      });

      setClaimHash(submittedClaimHash);
    } catch (error) {
      setMascotStep('warning');

      if (error instanceof Error) {
        setErrorMessage(mapErrorToKidMessage(error.message));
      } else {
        setErrorMessage('Transaction failed. Try one more time with a smaller amount.');
      }
    }
  };

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
        setErrorMessage('First we unlock your coupons. Approve in wallet.');

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
      await publicClient.waitForTransactionReceipt({ hash: submittedUnglueHash });
      await metricsQuery.mutate();
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
  };
}
