import { atom } from "jotai";

type WalletInfo = {
  address: `0x${string}` | undefined,
}

export const walletAtom = atom<WalletInfo>({ address: undefined });