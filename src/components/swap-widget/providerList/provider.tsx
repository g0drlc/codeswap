"use client";
import React from "react";
import { useAtom } from "jotai";
import { CrossChainTrade, OnChainTrade, RubicStep, WrappedCrossChainTradeOrNull, WrappedOnChainTradeOrNull } from "rubic-sdk";
import { Accordion, AccordionItem, Chip, Divider, Image, Tooltip } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import useNotification from "@/hooks/useNotification";
import { tradeAtom, tradeInfoAtom } from "@/store/trade";
import { correctAddressValidator, getProviderInfo } from "@/utils/utils";
import { ProviderInfo } from "@/models/ProviderInfo";

//OnChainTrade | CrossChainTrade 
import { TradeProvider } from "@/constants/provider/trade-provider";

interface IProps {
  trade: WrappedCrossChainTradeOrNull | WrappedOnChainTradeOrNull,
  receiver?: string,
  isBest: boolean,
  onClick: React.Dispatch<React.SetStateAction<boolean>>,
}

export const _renderRoutes = (_trade: CrossChainTrade<unknown> | OnChainTrade) => (
  <div className="flex flex-col gap-2 w-full">
    {
      _trade.getTradeInfo().routePath.map((r: RubicStep, i: number) => {
        const _info = getProviderInfo(r.provider)
        return (
          <div key={_info.name + '_route_' + i} className="flex gap-2 items-center text-xs">
            <Image
              src={_info.image}
              width={30}
              height={30}
              alt="image"
              className=""
            />
            <div className="flex flex-col">
                <span>Swap Via {_info.name}</span>
                <span className="opacity-50">{r.path[0]?.symbol} &gt; {r.path[1]?.symbol}</span>
            </div>
          </div>
        )
      })
    }
  </div>
)

const Provider: React.FC<IProps> = ({ trade, receiver, isBest, onClick }) => {
  const [, setTrade] = useAtom(tradeAtom);
  const [, setTradeInfo] = useAtom(tradeInfoAtom);
  const { showNotification } = useNotification();

  const _info: ProviderInfo = getProviderInfo(trade?.tradeType as TradeProvider)
  const _trade = trade?.trade as CrossChainTrade<unknown> | OnChainTrade;

  const _fee = React.useMemo(() => {
    const _rubicProxyFixedFeeInfo = _trade.feeInfo.rubicProxy?.fixedFee;
    const _rubicProxyPlatformFeeInfo = _trade.feeInfo.rubicProxy?.platformFee;
    const _providerCryptoFeeInfo = _trade.feeInfo.provider?.cryptoFee;
    const _providerPlatformFeeInfo = _trade.feeInfo.provider?.platformFee;

    const _rubicProxyFixedFee = _rubicProxyFixedFeeInfo ? Number(_rubicProxyFixedFeeInfo.amount) * Number(_rubicProxyFixedFeeInfo.token.price) : 0
    const _rubicProxyPlatformFee = _rubicProxyPlatformFeeInfo ? Number(_rubicProxyPlatformFeeInfo.percent) * Number(_rubicProxyPlatformFeeInfo.token.price) * Number(_trade.from.tokenAmount) / 100 : 0;
    const _providerCryptoFee = _providerCryptoFeeInfo ? Number(_providerCryptoFeeInfo.amount) * Number(_providerCryptoFeeInfo.token.price) : 0;
    const _providerPlatformFee = _providerPlatformFeeInfo ? Number(_providerPlatformFeeInfo.percent) * Number(_providerPlatformFeeInfo.token.price) * Number(_trade.from.tokenAmount) / 100 : 0;

    return _rubicProxyFixedFee + _rubicProxyPlatformFee + _providerCryptoFee + _providerPlatformFee;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_trade.feeInfo]);

  
  return (
    <div 
      className="mb-2 rounded-md bg-default-100/50 px-5 py-3" 
      onClick={async () => {
        if (receiver) {
          const validator = await correctAddressValidator(trade?.trade?.from.blockchain!, trade?.trade?.to.blockchain!);
          const validationResult = await validator(receiver);
          if (validationResult) {
            showNotification("Receiver address is not valid", "error");
            return;
          }
        }
        setTrade(_trade);
        setTradeInfo(_info);
        onClick(true);
      }}
    >
      <div className="hover: cursor-pointer">
        <div className="flex justify-between">
          <p className="text-lg">{_trade.to.tokenAmount.toFormat(5)} {_trade.to?.symbol}</p>
          <p className="text-md text-zinc-500">~{_trade.to.tokenAmount.multipliedBy(_trade.to.price).toFixed(2)} $</p>
        </div>
        <Accordion>
          <AccordionItem 
            key="1" 
            aria-label="Accordion 1"
            title={
              <div className="flex justify-between">
                <div className="text-xs flex items-center gap-1 my-1">
                  <Image 
                    src={`/${_info.image}`} 
                    width={20}
                    alt={_info.name}
                  />
                  {_info.name}
                </div>
                {
                  isBest && (
                    <Chip
                      variant="shadow"
                      classNames={{
                        base: "bg-gradient-to-br from-pink-500 to-yellow-500 border-small border-white/50",
                        content: "drop-shadow shadow-black text-white text-xs",
                      }}
                    >
                      BEST
                    </Chip>
                  )
                }
              </div>
            }
            indicator={({ isOpen }) => !isOpen ? <Icon icon="iconamoon:arrow-down-2-thin" /> : <Icon className="!rotate-90" icon="iconamoon:arrow-up-2-thin" />}
            classNames={{
              content: "py-1",
              trigger: "py-1",
              indicator: ""
            }}
          >
            {_renderRoutes(_trade)}
          </AccordionItem>
        </Accordion>
      </div>
      <Divider className="my-1" />
      <div className="flex justify-between mt-2">
        <Tooltip
          color="success"
          placement="top-start"
          content={
            <div className="text-[12px]">
              <p>Swap Fee</p>
            </div>
          }
        >
          <div className="flex items-center gap-1 text-xs">
            <Icon icon="healthicons:money-bag-outline" className="hover:cursor-pointer" />
            <span>~ ${Intl.NumberFormat().format(_fee)}</span>
          </div>
        </Tooltip>
        <Tooltip
          color="success"
          placement="top-start"
          content="Estimated arriving time"
          className="text-xs"
        >
          <div className="flex items-center gap-1 text-xs">
            <Icon icon="svg-spinners:clock" className="text-medium" />
            <span>{_info.averageTime}m</span>
          </div>
        </Tooltip>
      </div>
      
    </div>
  );
};

export default Provider;