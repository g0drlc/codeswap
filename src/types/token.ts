import { BackendBlockchain, BlockchainName } from "rubic-sdk";

export interface BlockchainToken {
  blockchain: BlockchainName;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export type TokenSecurity = {
  has_info: boolean;
  trust_list: boolean | null;
  risky_security_items: number;
  attention_security_items: number;
  is_airdrop_scam: boolean | null;
  fake_token: boolean | null;
} | null;

export interface Token extends BlockchainToken {
  image: string;
  rank: number;
  price: number | null;

  /**
   * Security information about token.
   * Equals `null` in case security information is not available.
   */
  tokenSecurity?: TokenSecurity | null;
}

export interface BackendToken {
  address: string;
  name: string;
  symbol: string;
  blockchainNetwork: BackendBlockchain;
  decimals: number;
  rank: number;
  image: string;
  coingeckoId: string;
  usdPrice: number;
  token_security: TokenSecurity | null;
}

export interface TokensBackendResponse {
  readonly count: number;
  readonly next: string;
  readonly previous: string;
  readonly results: BackendToken[];
}

export interface MinimalToken {
  address: string;
  blockchain: BlockchainName;
}


