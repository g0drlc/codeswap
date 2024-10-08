import { getDefaultConfig, Chain } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  bsc,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { rpcList } from "@/constants/chain/rpc-list";

export const config = getDefaultConfig({
  appName: "Code Swap",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [
    { ...mainnet, 
      rpcUrls: {
        default: {
          http: ['https://lb.drpc.org/ogrpc?network=ethereum&dkey=AoribOsTqURarSE5LBVCZ3Vag6w-dnIR7495hlDYfw4q', 'https://eth.llamarpc.com', 'https://rpc.ankr.com/eth']
        }
      }
    },
    {
      ...bsc,
      rpcUrls: {
        default: {
          http: ['https://lb.drpc.org/ogrpc?network=bsc&dkey=AoribOsTqURarSE5LBVCZ3Vag6w-dnIR7495hlDYfw4q', 'https://bsc-mainnet.public.blastapi.io', 'https://binance.llamarpc.com']
        }
      }
    },
    {
      ...polygon,
      rpcUrls: {
        default: {
          http: ['https://lb.drpc.org/ogrpc?network=polygon&dkey=AoribOsTqURarSE5LBVCZ3Vag6w-dnIR7495hlDYfw4q', 'https://polygon.llamarpc.com', 'https://rpc-mainnet.matic.quiknode.pro']
        }
      }
    },
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});

// const chains: readonly [Chain, ...Chain[]] = [
//   {
//     ...mainnet,
//     iconBackground: '#000',
//     iconUrl: 'https://example.com/icons/ethereum.png',
//   }
// ]

// const customConfig = createConfig({
//   chains
// });
