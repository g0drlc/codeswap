import { TradeProvider } from "./trade-provider";
import { ProviderInfo } from "./provider-info";
import { ON_CHAIN_PROVIDERS } from "./on-chain-providers";
import { BRIDGE_PROVIDERS } from "./cross-chain-provider";

export const TRADES_PROVIDERS: Record<TradeProvider, ProviderInfo> = {
  ...ON_CHAIN_PROVIDERS,
  ...BRIDGE_PROVIDERS
};
