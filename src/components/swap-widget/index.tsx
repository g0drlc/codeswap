"use client";
import React from "react";
import useAsyncEffect from "use-async-effect";
import { useAtom } from "jotai";
import _ from 'lodash';
import { SDK, BlockchainName, blockchainId, CHAIN_TYPE } from "rubic-sdk";
import { useBalance } from "wagmi";
import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Button,
  Tabs,
  Tab,
  Tooltip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { tradesAtom } from "@/store/trade";
import { tokenAtom } from "@/store/token";
import { walletAtom } from "@/store/wallet";
import { rubicSdkDefaultConfig } from "@/config/sdkConfig";
import CustomSelect from "@/components/select";
import TradeButton from "@/components/button/TradeButton";
import { correctAddressValidator } from "@/utils/utils";
import PreviewSwap from "./preview";
import AssetSelector from "./selector";
import ProviderList from "./providerList";
import { BackendToken } from "@/types/token";
import { WalletStatus } from "@/types/error";

interface IProps {
  tokens: {
      network: BlockchainName;
      tokens: BackendToken[];
  }[]
};

const SwapWidget: React.FC<IProps> = ({ tokens }) => {
  const [, setTokens] = useAtom(tokenAtom);
  const [trades, setTrades] = useAtom(tradesAtom);
  const [{ address }] = useAtom(walletAtom);
  
  const [showProviders, setShowProviders] = React.useState<boolean>(false);
  const [showPreview, setShowPreview] = React.useState<boolean>(false);
  const [showReceiver, setShowReceiver] = React.useState<boolean>(false);
  const [walletStatus, setWalletStatus] = React.useState<WalletStatus | null>(null);
  const [isCalculating, setIsCalculating] = React.useState<boolean>(false);
  const [showSourceSelector, setShowSourceSelector] = React.useState<boolean>(false);
  const [showDestinationSelector, setShowDestinationSelector] = React.useState<boolean>(false);
  
  const [receiverAddress, setReceiverAddress] = React.useState<string>("");
  const [invalidReceiverAddress, setInvalidReceiverAddress] = React.useState<boolean | null>(null);
  const [sdk, setSdk] = React.useState<SDK | null>(null);
  const [amount, setAmount] = React.useState<string>("");
  const [sourceBlockchain, setSourceBlockchain] = React.useState<BlockchainName | undefined>(undefined);
  const [destBlockchain, setDestBlockchain] = React.useState<BlockchainName | undefined>(undefined);
  const [sourceToken, setSourceToken] = React.useState<BackendToken | undefined>(undefined);
  const [destToken, setDestToken] = React.useState<BackendToken | undefined>(undefined);

  const isNativeToken = sourceToken?.address === "0x0000000000000000000000000000000000000000";
  //const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: isNativeToken ? undefined : sourceToken?.address as `0x${string}`,
    chainId: blockchainId[sourceBlockchain as BlockchainName],
  })


  const getQuote = React.useMemo(
    () => 
      _.debounce(async () => {
        if (!sourceBlockchain || !destBlockchain || !sourceToken || !destToken || parseFloat(amount) == 0) {
          return;
        }

        if (sdk) {
          setTrades([]);
          setIsCalculating(true);
          setShowProviders(true);
          try {
            console.log(sourceToken, destToken)
            if (sourceBlockchain === destBlockchain) {
              const wrappedTrades = await sdk.onChainManager.calculateTrade(
                { blockchain: sourceBlockchain, address: sourceToken.address  }, 
                String(amount), 
                destToken.address,
                {
                  slippageTolerance: 0.02
                }
              );
              const _trades = wrappedTrades.filter(t => t !== null && !("error" in t))
              setTrades(_trades);
            } else {
              const wrappedTrades = await sdk.crossChainManager.calculateTrade(
                { blockchain: sourceBlockchain, address: sourceToken.address }, 
                String(amount), 
                { blockchain: destBlockchain, address: destToken.address }, 
                {
                  slippageTolerance: 0.02
                }
              );
              const _trades = wrappedTrades.filter(t => t !== null && !("error" in t))
              setTrades(_trades);
            }
          } catch (error) {
            console.log(error);
            setShowProviders(false);
          }
          finally {
            setIsCalculating(false);
          }
        }
      }, 1000), 
    [sourceBlockchain, destBlockchain, sourceToken, destToken, amount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === "" || /^[0-9]*\.?[0-9]*$/.test(input)) {
      setAmount(e.target.value);
    }
  };

  const validateAddress = async (address: string) => {
    if (sourceBlockchain && destBlockchain) {
      const validator = await correctAddressValidator(sourceBlockchain, destBlockchain);
      const validationResult = await validator(address);
      
      if (validationResult) {
        setInvalidReceiverAddress(false);
        return;
      } else {
        setInvalidReceiverAddress(true);
        return;
      }
    }
    setInvalidReceiverAddress(false);
  };

  const handleReceiverInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiverAddress(e.target.value);
    if (e.target.value !== "") {
      await validateAddress(e.target.value);
    } else {
      setInvalidReceiverAddress(null);
    }
  };

  const handleSourceAssetChange = (_network: BlockchainName, _token: BackendToken) => {
    if (_network === destBlockchain && _token.name === destToken?.name) return
    setSourceBlockchain(_network);
    setSourceToken(_token);
    setShowSourceSelector(false);
  };

  const handleDestinationAssetChange = (_network: BlockchainName, _token: BackendToken) => {
      if (_network === sourceBlockchain && _token.name === sourceToken?.name) return
      setDestBlockchain(_network);
      setDestToken(_token);
      setShowDestinationSelector(false);
  };

  const handleExchange = () => {
    const _sourceBlockchain = sourceBlockchain;
    const _sourceToken = sourceToken;
    setSourceBlockchain(destBlockchain);
    setSourceToken(destToken);
    setDestBlockchain(_sourceBlockchain);
    setDestToken(_sourceToken);
  };

  const handleTrade = () => {
    setShowPreview(true);
  }

  useAsyncEffect(async () => {
    setSdk(await SDK.createSDK(rubicSdkDefaultConfig));
  }, []);

  useAsyncEffect(async () => {
    await sdk?.updateConfiguration({
      ...rubicSdkDefaultConfig,
      walletProvider: address ? {
        [CHAIN_TYPE.EVM]: {
          core: window.ethereum,
          address,
        }
      } : undefined
    });
  }, [address]);

  // React.useEffect(() => {
  //   console.log("address changed", address)
  //   if (address) {
  //     sdk?.updateWalletAddress(CHAIN_TYPE.EVM, address)
  //   }
  // }, [address, sdk]);

  const checkWalletStatuts = () => {
    if (!address) {
      setWalletStatus("network");
      return false;
    }
    if (!sourceBlockchain || !destBlockchain || !sourceToken || !destToken || !amount) {
      setWalletStatus("token");
      return false;
    }
    if (!balance || balance.value < parseFloat(amount) * 10 ** sourceToken?.decimals) {
      setWalletStatus("balance");
      return false;
    }
    setWalletStatus(null);
    return true;
  };

  const refreshTrades = () => {
    if (checkWalletStatuts() && !isCalculating) {
      getQuote();
    }
  };

  React.useEffect(() => {
    if (checkWalletStatuts()) {
      getQuote();
    } else {
      setTrades([]);
      setShowProviders(false);
      setIsCalculating(false);
    }

    return () => {
      getQuote.cancel();
    }
  }, [address, sourceBlockchain, destBlockchain, sourceToken, destToken, amount]);

  return (
    <>
      {
        !showPreview &&
          <div className="flex flex-col justify-center md:flex-row gap-4">
            <div>
              <Card
                isBlurred
                className="h-auto w-[340px] md:w-[550px] border-none bg-background/60 dark:bg-default-100/50"
                shadow="sm"
              >
                <CardBody>
                  <div className="flex justify-between mb-2">
                    <div>
                      <Tabs variant="underlined" aria-label="Tabs variants">
                        <Tab key="swap" title="Swap" />
                      </Tabs>
                    </div>
                    <div>
                      <Button isIconOnly className="bg-transparent" aria-label="Like" onClick={refreshTrades}>
                        <Icon 
                          icon="solar:refresh-bold"
                          className={isCalculating ? "animate-spin" : ""}
                          fontSize={24} 
                        />
                      </Button>
                      <Button isIconOnly className="bg-transparent" aria-label="Like">
                        <Icon icon="icon-park:setting-config" fontSize={24} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <CustomSelect 
                        blockchain={sourceBlockchain}
                        token={sourceToken}
                        handleClick={setShowSourceSelector} 
                      />
                      <Input
                        type="text"
                        placeholder="0.00"
                        labelPlacement="outside"
                        classNames={{
                          input: [
                            "!text-zinc-300",
                            "h-full",
                            "text-xl",
                            "text-right",
                            "placeholder:text-zinc-400",
                            "border-none",
                          ],
                          inputWrapper: [
                            "h-[70px]",
                            "shadow-xl",
                            "rounded-md",
                            "bg-transparent",
                            "hover:!bg-transparent",
                            "group-data-[focus=true]:bg-transparent",
                            "group-data-[focus=true]:ring-none",
                            "!cursor-text",
                          ],
                        }}
                        value={amount}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='bg-gradient-to-r from-default-100/50 via-50% via-zinc-400 to-default-100/50 flex justify-center my-6 h-[1px] items-center'>
                      <Button 
                        isIconOnly
                        className='rounded-full hover:!opacity-100'
                        onClick={handleExchange}
                      >
                        <Icon className='text-lg text-white' icon="iconamoon:swap-light" />
                      </Button >
                    </div>
                    <div className="flex justify-between">
                      <CustomSelect 
                        blockchain={destBlockchain}
                        token={destToken}
                        handleClick={setShowDestinationSelector} 
                      />
                      <Input
                        type="text"
                        placeholder="0.00"
                        labelPlacement="outside"
                        classNames={{
                          input: [
                            "!text-zinc-300",
                            "h-full",
                            "text-xl",
                            "text-right",
                            "placeholder:text-zinc-400",
                          ],
                          inputWrapper: [
                            "h-[70px]",
                            "shadow-xl",
                            "rounded-md",
                            "bg-transparent",
                            "hover:!bg-transparent",
                            "group-data-[focus=true]:bg-transparent",
                            "!cursor-text",
                          ],
                        }}
                        disabled
                      />
                    </div>
                    {
                      showReceiver && 
                        <div className="mt-3">
                          <Input
                            value={receiverAddress}
                            onChange={handleReceiverInputChange}
                            placeholder="Enter the receiver wallet address"
                            endContent={
                              invalidReceiverAddress ? <Icon icon="game-icons:check-mark"  style={{color: '#3bf15a'}} /> : (
                                invalidReceiverAddress === false ? <Icon icon="ep:warning"  style={{color: '#f40b0b'}} /> : <></>
                              )
                              
                            }
                          />
                        </div>
                    }
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="w-full flex gap-2">
                    <TradeButton 
                      status={walletStatus}
                      onTradeClick={handleTrade}
                      loading={isCalculating}
                    />
                    <Tooltip 
                      className="max-w-[250px]"
                      content={`Enter your wallet address that supports ${destBlockchain || "ETH"}. You‘ll receive your tokens in this wallet.`}
                      color="success"
                    >
                      <Button className="min-w-0 p-4" onClick={() => setShowReceiver(!showReceiver)}>
                        <Icon width={24} icon="hugeicons:wallet-done-01" />
                      </Button>
                    </Tooltip>
                  </div>
                </CardFooter>
              </Card>
            </div>
            <AssetSelector
              network={sourceBlockchain}
              handleChangeAsset={handleSourceAssetChange}
              show={showSourceSelector}
              setShow={setShowSourceSelector}
            />
            <AssetSelector
              network={destBlockchain}
              handleChangeAsset={handleDestinationAssetChange}
              show={showDestinationSelector}
              setShow={setShowDestinationSelector}
            />
            <ProviderList 
              show={showProviders} 
              setShow={setShowProviders}
              setShowPreview={setShowPreview}
              receiver={receiverAddress}
              isLoading={isCalculating} 
            />
          </div>
      }
      {
        showPreview && sourceToken && destToken &&
          <PreviewSwap 
            show={showPreview} 
            setShow={setShowPreview}
            setShowProviders={setShowProviders}
            receiver={receiverAddress}
            srcToken={sourceToken}
            destToken={destToken}
          />
      }
    </>
  );
};

export default SwapWidget;
