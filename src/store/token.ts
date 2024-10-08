import { atom } from "jotai";
import { BlockchainName } from "rubic-sdk";
import { BackendToken } from "@/types/token";

export const tokenAtom = atom<{ blockchain: BlockchainName, tokens: BackendToken[]  }[]>([]);