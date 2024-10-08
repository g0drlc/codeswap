import { Configuration, RpcProviders, WalletProvider, CHAIN_TYPE } from 'rubic-sdk';
import { rpcList } from '@/constants/chain/rpc-list';

const rpcProviders = Object.keys(rpcList).reduce((acc, blockchain) => {
  const provider = {
    rpcList: rpcList[blockchain as keyof typeof rpcList],
    mainRpcTimeout: 8000
  };
  return { ...acc, [blockchain]: provider };
}, {} as RpcProviders);

const walletProvider: WalletProvider = {
  [CHAIN_TYPE.EVM]: {
      address: '0xf907e8cEC2A0575B4e895eB7720300F88694022e', // user wallet address
      core: typeof window !== "undefined" ? window.ethereum : undefined
  },
};

const providerAddress = {
  [CHAIN_TYPE.EVM]: {
    crossChain: process.env.NEXT_PUBLIC_FEE_WALLET,
    onChain: process.env.NEXT_PUBLIC_FEE_WALLET
  }
}

export const rubicSdkDefaultConfig: Configuration = { rpcProviders, walletProvider, providerAddress };