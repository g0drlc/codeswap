"use client";
import React from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { CrossChainTrade, EvmWeb3Public, Injector, OnChainTrade, blockchainId, NotSupportedTokensError, UnsupportedReceiverAddressError, LowSlippageError, TooLowAmountError, CrossChainIsUnavailableError } from "rubic-sdk";
import useAsyncEffect from "use-async-effect";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { correctAddressValidator } from "@/utils/utils";
import useNotification from "@/hooks/useNotification";
import { EIP_1193, RpcError } from "@/utils/errorHandler";

interface SwapBlockProps {
    trade?: OnChainTrade | CrossChainTrade | null,
    receiver: string,
    setTxHash: React.Dispatch<React.SetStateAction<string>>,
    setSuccessShow: React.Dispatch<React.SetStateAction<boolean>>,
}

const SwapBlock = ({ trade, receiver, setSuccessShow, setTxHash }: SwapBlockProps) => {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { showNotification } = useNotification();

  const [needApprove, setApprove] = React.useState(true);
  const [isLoading, setLoading] = React.useState(false);

  useAsyncEffect(async () => {
      const isApproved = await trade?.needApprove() || false;
      setApprove(isApproved);
  }, [trade]);

  const checkRpcError = (error: RpcError) => {
    return EIP_1193.some(rpcError => String(error.code || "") === rpcError.code || error.message.includes(rpcError.code) || error?.message?.includes(rpcError.message.toLowerCase()))
  };

  const handleTrade = async (
    trade: OnChainTrade | CrossChainTrade | undefined | null, 
    needApprove: boolean, 
    receiver: string,
    approveHandle: () => void
  ) => {
      try {
        if (!trade) return;
        
        const validator = await correctAddressValidator(trade.from.blockchain, trade.to.blockchain);
        const validationResult = await validator(receiver);
  
        if (validationResult) {
          showNotification("Invalid receiver address", "error");
          return;
        }
        
        const blockchainAdapter: EvmWeb3Public = Injector.web3PublicService.getWeb3Public(trade.from.blockchain);
        const gasPrice = await blockchainAdapter.getGasPrice();

        if (!needApprove || trade?.from.address === '0x0000000000000000000000000000000000000000') {
            setLoading(true);
            const result = await trade?.swap({
                onConfirm: (hash: string) => {
                    console.log(`Swap transaction ${hash} was sent.`);
                },
                receiverAddress: receiver
            });
            setLoading(false);
            console.log(result);
            setTxHash(result);
            setSuccessShow(true);
        } else {
            const tx = {
                onTransactionHash: () => {
                  console.log(`Approve transaction was sent.`);
                },
                gasPrice
            }
            await trade?.approve(tx);
            approveHandle();
        }
      } catch (error: unknown) {
        console.log(error)
        setLoading(false);
        if (error instanceof NotSupportedTokensError) {
          return showNotification('Currently, Rubic does not support swaps between these tokens.', 'error');
        }
        if (error instanceof UnsupportedReceiverAddressError) {
          return showNotification('This provider doesn’t support the receiver address.', 'error');
        }
        if (error instanceof CrossChainIsUnavailableError) {
          return showNotification('Crosschain is unavailable now.', 'error')
        }
        if (error instanceof LowSlippageError) {
          return showNotification('Slippage is too low for transaction.', 'error');
        }
        if (error instanceof TooLowAmountError) {
          return showNotification(
            "The swap can't be executed with the entered amount of tokens. Please change it to the greater amount.", 'error'
          );
        } if (checkRpcError(error as RpcError)) {
          return showNotification(
            "Rejected by user", 'error'
          );
        } if (typeof error === 'string') {
          showNotification(error, "error");
        } else if (error instanceof Error) {
          showNotification(error.stack+"", "error"); // Handle Error objects
        }
      }
  };

  const handleClick = async () => {
    if (blockchainId[trade?.from.blockchain!] !== chain?.id) {
      switchChain({ chainId: blockchainId[trade?.from.blockchain!] });
    } else {
      handleTrade(trade, needApprove, receiver, () => setApprove(false));
    }
  }

  return receiver ? 
      <Button 
        className="w-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
        fullWidth={ true }
        onClick={handleClick}
        disabled={isLoading}
        startContent={isLoading?<Icon icon="eos-icons:loading"  style={{color: '#fffafa'}} />:<></>}
      >
        {
          isLoading ? 'Waiting Transaction' : (
            blockchainId[trade?.from.blockchain!] !== chain?.id ? 
              ("Switch network") 
              : (needApprove ? 'Approve' : 'Swap')
          )
        }
      </Button>
    : null;
}

export default SwapBlock;
