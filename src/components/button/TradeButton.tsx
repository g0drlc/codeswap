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
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl hover:shadow-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-bold text-base"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    radius="full"
                    className="w-full bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
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
                    className="w-full bg-gradient-to-r from-default-400 to-default-500 text-white shadow-lg font-semibold disabled:opacity-50"
                    isDisabled
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
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl hover:shadow-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-bold text-base disabled:opacity-70"
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