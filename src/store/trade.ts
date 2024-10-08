import { atom } from 'jotai';
import BigNumber from 'bignumber.js';
import { WrappedOnChainTradeOrNull, WrappedCrossChainTradeOrNull, CrossChainTrade, OnChainTrade, PriceTokenAmount } from 'rubic-sdk';
import { ProviderInfo } from '@/models/ProviderInfo';

export interface BackendOnChainTrade extends OnChainTrade {
  gasFeeInfo?: {
    gasFeeInUsd: BigNumber;
  },
  slippageTolerance: number;
  toTokenAmountMin: PriceTokenAmount;
  priceImpact: number | null;
  
}

export interface BackendCrossChainTrade extends CrossChainTrade {
  gasData?: {
    gasLimit: BigNumber;
    gasPrice: BigNumber;
    maxFeePerGas: BigNumber;
    maxPriorityFeePerGas: BigNumber;
  },
  slippage: number | null;
  priceImpact: number | null;
}

export const tradesAtom = atom<WrappedCrossChainTradeOrNull[] | WrappedOnChainTradeOrNull[]>([]);
export const tradeAtom = atom<CrossChainTrade<unknown> | OnChainTrade | null>(null);
export const tradeInfoAtom = atom<ProviderInfo | null>(null);