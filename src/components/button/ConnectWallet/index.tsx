"use client"; 
import React from 'react';
import { useAtom } from 'jotai';
import { Image, Button } from '@nextui-org/react';
import { Icon } from "@iconify/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { walletAtom } from '@/store/wallet';

export const WalletConnectButton = () => {
  const [, setWallet] = useAtom(walletAtom);
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        
        //setWallet(connected ? { address: account.address as `0x${string}` } : {address: null});
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
          if (connected) {
            setWallet({ address: account.address as `0x${string}` });
          } else {
            setWallet({ address: undefined });
          }
        }, [connected]);

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div className='flex gap-1.5 sm:gap-3'>
                  <Button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    className='px-2 gap-1 bg-default-300/20 font-bold text-[16px]'
                    endContent={
                      <Icon icon="ri:arrow-drop-down-line" width={30} />
                    }
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 24, height: 24 }}
                          />
                        )}
                      </div>
                    )}
                    <span className='hidden sm:block'>{chain.name}</span>
                  </Button>
                  <Button 
                    onClick={openAccountModal} 
                    className='px-1 py-1 pl-2 bg-default-300/20 font-bold text-[16px]' 
                  >
                    <span className='hidden sm:block'>
                      {account.displayBalance
                        ? `${account.displayBalance}`
                        : ''}
                    </span>
                    <div className='flex gap-1 items-center sm:bg-default-300/70 sm:pl-2 rounded-[10px]'>
                      <Icon icon="entypo:wallet" className='w-[24px] h-[24px] sm:w-[20px] sm:h-[20px] ' style={{color:' #d7da44'}} />
                      <span className='hidden sm:block -mr-1'>{account.displayName}</span>
                      <Icon icon="ri:arrow-drop-down-line" width={30} />
                    </div>
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};