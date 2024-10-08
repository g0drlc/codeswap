"use client";
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from "wagmi";
import { Button } from '@nextui-org/react';
import { BlockchainName, blockchainId } from 'rubic-sdk';
import { BackendToken } from '@/types/token';
import { WalletStatus } from '@/types/error';

interface IProps {
  status: WalletStatus | null;
  loading: boolean;
  onTradeClick: () => void;
};

const TradeButton: React.FC<IProps> = ({ status, loading, onTradeClick }) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openChainModal,
        openAccountModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div className="w-full">
            {(() => {
              if (!connected) {
                return (
                  <Button
                    radius="full"
                    className="w-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    className="w-full rounded-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                );
              }

              if (status !== null) {
                return (
                  <Button
                    radius="full"
                    className="w-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                  >
                    { status === 'network' && "Connect Wallet" }
                    { status === 'token'&& "Select Token" }
                    { status === 'balance' && "Insufficient Balance" }
                    
                  </Button>
                )
              }

              return (
                <Button
                  radius="full"
                  className="w-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                  onClick={onTradeClick}
                  disabled={loading}
                >
                  {loading ? 'Calculating...':'Preview Swap'}
                </Button>
              );
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  );
};

export default TradeButton;