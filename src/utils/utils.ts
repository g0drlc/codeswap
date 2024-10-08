import { BlockchainName, BlockchainsInfo, ChainType, CrossChainTrade, OnChainTrade, EvmCrossChainTrade, EvmOnChainTrade, Web3Pure, nativeTokensList, BLOCKCHAIN_NAME } from "rubic-sdk";
import BigNumber from "bignumber.js";
import { TradeProvider } from "@/constants/provider/trade-provider";
import { TRADES_PROVIDERS } from "@/constants/provider/trade-providers";
import { blockchainScanner } from "@/constants/blockchain-scanner";
import { ProviderInfo } from "@/models/ProviderInfo";
import { MinimalToken } from "@/types/token";

enum ADDRESS_TYPE {
  WALLET = 'WALLET',
  TOKEN = 'TOKEN',
  TRANSACTION = 'TRANSACTION',
  BLOCK = 'BLOCK'
}

export interface AppGasData {
  amount: BigNumber;
  symbol: string;
}

export function shortenAddress(address: string, chars = 4) {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function compareTokens(token0: MinimalToken, token1: MinimalToken): boolean {
  return (
    token0?.address?.toLowerCase() === token1?.address?.toLowerCase() &&
    token0?.blockchain === token1?.blockchain
  );
}

export function getProviderInfo(tradeType: TradeProvider): ProviderInfo {
  const provider = TRADES_PROVIDERS[tradeType];
  //const providerAverageTime = this.platformConfigurationService.providersAverageTime;
  //const currentProviderTime = providerAverageTime?.[tradeType as CrossChainTradeType];
  return {
    ...provider,
    //averageTime: currentProviderTime ? currentProviderTime : provider.averageTime
  };
}

export function getGasData(trade: CrossChainTrade | OnChainTrade): AppGasData | null {
  let gasData = null;
  let gasPrice = null;
  if (trade instanceof EvmCrossChainTrade) {
    gasData = trade.gasData;

    if (
      trade.from.blockchain !== BLOCKCHAIN_NAME.ETHEREUM &&
      trade.from.blockchain !== BLOCKCHAIN_NAME.FANTOM
    ) {
      gasPrice = gasData?.gasPrice?.gt(0)
        ? Web3Pure.fromWei(gasData.gasPrice)
        : Web3Pure.fromWei(gasData?.maxFeePerGas || 0);
    } else {
      gasPrice = gasData?.gasPrice?.gt(0)
        ? gasData.gasPrice
        : Web3Pure.fromWei(gasData?.maxFeePerGas || 0);
    }
  } else if (trade instanceof EvmOnChainTrade) {
    gasData = trade.gasFeeInfo;
    gasPrice = (gasData?.gasPrice?.gt(0) ? gasData.gasPrice : gasData?.maxFeePerGas);
  }

  if (!gasData || !gasData.gasLimit || !gasPrice) {
    return null;
  }
  const blockchain = trade.from.blockchain;
  const nativeToken = nativeTokensList[blockchain];
  const gasLimit = gasData?.gasLimit?.multipliedBy(gasPrice);

  return {
    amount: gasLimit as unknown as BigNumber,
    symbol: nativeToken.symbol
  };
}

export function getSlippage(trade: CrossChainTrade | OnChainTrade): number {
  if (trade instanceof EvmCrossChainTrade) {
    return "slippage" in trade ? trade.slippage as number : 0;
  } else if (trade instanceof EvmOnChainTrade) {
    return trade.slippageTolerance * 100 || 0;
  }
  return 0;
}

export function getPriceImpact(trade: CrossChainTrade | OnChainTrade): number {
  if (trade instanceof EvmCrossChainTrade) {
    return "priceImpact" in trade ? trade.priceImpact as number : 0;
  } else if (trade instanceof EvmOnChainTrade) {
    return trade.priceImpact || 0;
  }
  return 0;
}

export function getPriceMinAmount(trade: CrossChainTrade | OnChainTrade): number {
  if (trade instanceof EvmCrossChainTrade) {
    return "toTokenAmountMin" in trade ? Number(Intl.NumberFormat().format(trade.toTokenAmountMin.toNumber())) : 0;
  } else if (trade instanceof EvmOnChainTrade) {
    return "toTokenAmountMin" in trade ?  Number(Intl.NumberFormat().format(trade.toTokenAmountMin.tokenAmount.toNumber())) : 0;
  }
  return 0;
}

export function getScannerLink(address: string, blockchainName: BlockchainName, type: ADDRESS_TYPE): string {
  if (!address || !blockchainName) {
    return '';
  }

  const scannerInfo = blockchainScanner[blockchainName];
  const baseUrl = scannerInfo.baseUrl;

  let chainType: ChainType | undefined;
  try {
    chainType = BlockchainsInfo.getChainType(blockchainName);
  } catch {}
  if (
    (chainType && Web3Pure[chainType].isNativeAddress(address)) ||
    (chainType && address === Web3Pure[chainType].EMPTY_ADDRESS)
  ) {
    return baseUrl + scannerInfo.nativeCoinUrl;
  }
  return baseUrl + scannerInfo[type] + address;
}

export async function correctAddressValidator(
  fromAssetType: BlockchainName,
  toBlockchain: BlockchainName
) {
  const toChainType = BlockchainsInfo.getChainType(toBlockchain || 'ETH');
  const fromChainType = BlockchainsInfo.getChainType(fromAssetType as BlockchainName);

  return async (address: string) => {

    const isAddressCorrectValue =
      address === '' || (await Web3Pure[toChainType].isAddressCorrect(address));

    if (!isAddressCorrectValue && (address || fromChainType !== toChainType)) {
      return { wrongAddress: address };
    }

    if (!toChainType) {
      return !address?.length ? { wrongAddress: address } : null;
    }
    return null;
  };
}
