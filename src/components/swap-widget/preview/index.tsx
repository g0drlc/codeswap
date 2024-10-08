"use client";
import React from "react";
import Link from "next/link";
import { useAtom } from "jotai";
import { useAccount } from "wagmi";
import { TO_BACKEND_BLOCKCHAINS } from "rubic-sdk";
import { Button, Card, CardHeader, CardBody, CardFooter, Image, Tooltip } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { tradeAtom, tradeInfoAtom } from "@/store/trade";
import { getGasData, getSlippage, getPriceImpact, getPriceMinAmount, getScannerLink, shortenAddress } from "@/utils/utils";
import { _renderRoutes } from "../providerList/provider";
import SwapBlock from "../swap";
import { ADDRESS_TYPE } from "@/constants/blockchain-scanner";
import { blockchainIcon } from "@/constants/blockchain-icon";
import { blockchainColor } from "@/constants/blockchain-color";
import { BackendToken } from "@/types/token";

type CopyLinkProps = {
  url: string;
}
const CopyLink: React.FC<CopyLinkProps> = ({url}) => {
  const [copied, setCopied] = React.useState(false);

  const onClickHandler = React.useCallback(() => {
    window.navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [url]);

  return (
    <div className="cursor-pointer" onClick={onClickHandler}>
      <div className="flex flex-row items-center gap-2">
        {/* TODO: replace with medium-gray from globals.css*/}
        {
          copied ?
            <Icon icon="solar:copy-outline" color="green" />
            :
            <Icon icon="solar:copy-outline" />
        }
      </div>
    </div>
  );
};

interface IProps {
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  setShowProviders: React.Dispatch<React.SetStateAction<boolean>>,
  receiver?: string,
  srcToken: BackendToken,
  destToken: BackendToken,
  //trade: CrossChainTrade<unknown> | OnChainTrade
};

const PreviewSwap: React.FC<IProps> = ({ show, setShow, setShowProviders, receiver, srcToken, destToken }) => {
  const { address } = useAccount();
  const [trade] = useAtom(tradeAtom);
  const [tradeInfo] = useAtom(tradeInfoAtom);

  const [successShow, setSuccessShow] = React.useState<boolean>(false);
  const [txHash, setTxHash] = React.useState<string>("");

  const _fee = React.useMemo(() => {
    if (trade ===  null) return {
      total: 0,
      provider_fee: 0,
      rubic_fee: 0,
    };
    const _rubicProxyFixedFeeInfo = trade.feeInfo.rubicProxy?.fixedFee;
    const _rubicProxyPlatformFeeInfo = trade.feeInfo.rubicProxy?.platformFee;
    const _providerCryptoFeeInfo = trade.feeInfo.provider?.cryptoFee;
    const _providerPlatformFeeInfo = trade.feeInfo.provider?.platformFee;

    const _rubicProxyFixedFee = _rubicProxyFixedFeeInfo ? Number(_rubicProxyFixedFeeInfo.amount) * Number(_rubicProxyFixedFeeInfo.token.price) : 0
    const _rubicProxyPlatformFee = _rubicProxyPlatformFeeInfo ? Number(_rubicProxyPlatformFeeInfo.percent) * Number(_rubicProxyPlatformFeeInfo.token.price) * Number(trade.from.tokenAmount) / 100: 0;
    const _providerCryptoFee = _providerCryptoFeeInfo ? Number(_providerCryptoFeeInfo.amount) * Number(_providerCryptoFeeInfo.token.price) : 0;
    const _providerPlatformFee = _providerPlatformFeeInfo ? Number(_providerPlatformFeeInfo.percent) * Number(_providerPlatformFeeInfo.token.price) * Number(trade.from.tokenAmount) / 100: 0;

    return {
      total: _rubicProxyFixedFee + _rubicProxyPlatformFee + _providerCryptoFee + _providerPlatformFee,
      provider_fee: _providerCryptoFee + _providerPlatformFee,
      rubic_fee: _rubicProxyFixedFee + _rubicProxyPlatformFee,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade?.feeInfo]);

  React.useEffect(() => {
    if (trade) {
      console.log(trade)
    }
  }, [trade])

  return (
    <>
      {
        show && trade && !successShow &&
          <Card className="w-[340px] md:w-[450px]">
            <CardHeader className="px-6">
              <div className="w-full flex items-center">
                <button className="w-6" onClick={() => setShow(false)}>
                  <Icon icon="weui:back-filled" />
                </button>
                <p className="w-full text-center">Preview Swap</p>
              </div>
            </CardHeader>
            <CardBody className="px-4">
              <div className="flex flex-col gap-3 mb-3 p-3 bg-default-100/50 rounded-md">
                <div className="flex items-center gap-2">
                  <Image
                    width={40}
                    src={blockchainIcon[trade.from.blockchain]}
                    alt={trade.from.blockchain}
                  />
                  <div>
                    <span>{trade?.from.tokenAmount.toFixed(5) || ""}</span>&nbsp;
                    <span>{trade?.from.symbol}</span>
                    <p className="text-sm text-default-500">~ ${(Number(trade.from.tokenAmount)*Number(trade.from.price)).toFixed(2)}</p>
                  </div>
                </div>
                <div className="ml-4">
                  {
                    trade && _renderRoutes(trade)
                  }
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    width={40}
                    src={blockchainIcon[trade.to.blockchain]}
                    alt={trade.from.blockchain}
                  />
                  <div>
                    <span>{trade?.to.tokenAmount.toFixed(3)}</span>&nbsp;
                    <span>{trade?.to.symbol}</span>
                    <p className="text-sm text-default-500">~ ${(Number(trade.to.tokenAmount)*Number(trade.to.price)).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="mb-3 p-3 flex gap-4 bg-default-100/50  rounded-md">
                {
                  (("gasData" in trade && trade.gasData !== null) || ("gasFeeInfo" in trade) && trade.gasFeeInfo !== null) &&
                    <Tooltip
                      content="Estimated Gas Fee"
                      color="success"
                    >
                      <div className="flex items-center gap-1 hover:cursor-pointer">
                        <Icon icon="ph:gas-pump-duotone" />
                        <span>$ {(Number(getGasData(trade)?.amount)*Number(trade.from.price)).toFixed(2)}</span>
                      </div>
                    </Tooltip>
                }
                <Tooltip
                  content={
                    <div>
                      <p>Platform Fee: <span>~ ${_fee.rubic_fee.toFixed(2)}</span></p>
                      {
                        _fee.provider_fee > 0 && <p>Provider Fee: <span>~ ${_fee.provider_fee.toFixed(2)}</span></p>
                      }
                    </div>
                  }
                  color="success"
                >
                  <div className="flex items-center gap-1 hover:cursor-pointer">
                    <Icon icon="healthicons:money-bag-outline" width={20} />
                    <span>~ ${_fee.total.toFixed(2)}</span>
                  </div>
                </Tooltip>
                <div className="grow flex justify-end">
                  <Tooltip
                    content="Estimated Arriving Time"
                    color="success"
                  >
                    <div className="flex items-center gap-1">
                      <Icon icon="svg-spinners:clock" className="text-medium" />
                      <span>{tradeInfo?.averageTime}m</span>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="p-3 bg-default-100/50 rounded-md">
                <p className="mb-3 text-center">Transaction details</p>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Tooltip
                        content="Correlation between an incoming order and the change in the price of the asset involved caused by the trade"
                        color="success"
                        classNames={{
                          base: "max-w-[300px]"
                        }}
                      >
                        <Icon icon="carbon:information" />
                      </Tooltip>
                      <span>Price Impact</span>
                    </div>
                    <p className="text-end">{getPriceImpact(trade)}%</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Tooltip 
                        content="Correlation between an incoming order and the change in the price of the asset involved caused by the trade"
                        color="success"
                        classNames={{
                          base: "max-w-[300px]"
                        }}
                      >
                        <Icon icon="carbon:information" />
                      </Tooltip>
                      <span>Slippage</span>
                    </div>
                    <p className="text-end">{getSlippage(trade)}%</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Tooltip 
                        content="Minimum amount of tokens you will receive in target blockchain. Depends on slippage"
                        color="success"
                        classNames={{
                          base: "max-w-[300px]"
                        }}
                      >
                        <Icon icon="carbon:information" />
                      </Tooltip>
                      <span>Minimum Received</span>
                    </div>
                    <p>{getPriceMinAmount(trade)} {trade.to.symbol}</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Tooltip content="Address to send assets" color="success">
                        <Icon icon="carbon:information" />
                      </Tooltip>
                      <span>Receiver address</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {shortenAddress(receiver ? receiver : (address || ""))}
                      <Link href={getScannerLink(address!, trade.to.blockchain, ADDRESS_TYPE.WALLET)} target="_blank">
                        <Image
                          width={15}
                          src="/assets/images/icons/scanner.svg"
                          alt="scan"
                        />
                      </Link>
                      <CopyLink url={address!} />
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <SwapBlock 
                trade={trade}
                receiver={receiver ? receiver : address!}
                setTxHash={setTxHash}
                setSuccessShow={setSuccessShow}
              />
            </CardFooter>
          </Card> 
      }
      {
        show && trade && successShow && txHash &&
          <Card className="w-[340px]">
            <CardHeader className="px-6">
              <p className="w-full text-center">Success Swap</p>
            </CardHeader>
            <CardBody className="px-4">
              <div className="rounded-lg bg-[#22242A] p-4 flex flex-col gap-3 items-center">
                <Image
                  src="/assets/images/png/check.png"
                  className="max-h-[100px]"
                  alt="logo"
                />
                <div className="flex gap-2 items-center mt-3">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center">
                      <div className="rounded-xl pr-3" style={{ backgroundColor: blockchainColor[trade.from.blockchain] }}>
                        <Image
                          src={`/${blockchainIcon[trade.from.blockchain]}`}
                          width={30}
                          height={30}
                          alt="from"
                        />
                      </div>
                    </div>
                    <div className="p-[2px] rounded-full bg-[#22242A] -ml-4 z-10">
                      <Image
                        src={srcToken.image}
                        width={35}
                        height={35}
                        alt="from"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col text-xs">
                    <span>{Intl.NumberFormat().format(trade.from.tokenAmount.toNumber())} {srcToken.symbol}</span>
                    <span className="opacity-60">~ $ {Intl.NumberFormat().format(trade.from.tokenAmount.toNumber() * trade.from.price.toNumber())} - on {TO_BACKEND_BLOCKCHAINS[trade.from.blockchain]}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center">
                      <div className="rounded-xl pr-3" style={{ backgroundColor: blockchainColor[trade.to.blockchain] }}>
                        <Image
                          src={`/${blockchainIcon[trade.to.blockchain]}`}
                          width={30}
                          height={30}
                          alt="from"
                        />
                      </div>
                    </div>
                    <div className="p-[2px] rounded-full bg-[#22242A] -ml-4 z-10">
                      <Image
                        src={destToken.image}
                        width={35}
                        height={35}
                        alt="from"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col text-xs">
                    <span>{Intl.NumberFormat().format(trade.to.tokenAmount.toNumber())} {destToken.symbol}</span>
                    <span className="opacity-60">~ $ {Intl.NumberFormat().format(trade.to.tokenAmount.toNumber() * trade.to.price.toNumber())} - on {TO_BACKEND_BLOCKCHAINS[trade.from.blockchain]}</span>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <Link className="underline" href={getScannerLink(txHash, trade.from.blockchain, ADDRESS_TYPE.TRANSACTION)} target="_blank">See on Explorer</Link>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                onClick={() => {
                  setSuccessShow(false);
                  setShow(false);
                  setShowProviders(false);
                }}
              >
                Done
              </Button>
            </CardFooter>
          </Card>
      }
    </>
  );
};

export default PreviewSwap;