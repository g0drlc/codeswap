import React from "react";
import { useAtom } from "jotai";
import { CrossChainTrade, OnChainTrade, WrappedCrossChainTradeOrNull, WrappedOnChainTradeOrNull } from "rubic-sdk"
import { Card, CardHeader, CardBody } from "@nextui-org/react";

import { tradesAtom } from "@/store/trade";
import Provider from "./provider";
import "./providerList.css";

interface IProps {
  show: boolean,
  receiver?: string,
  isLoading: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>,
  //setTrade: React.Dispatch<React.SetStateAction<CrossChainTrade<unknown> | OnChainTrade>>,
};

const ProviderList: React.FC<IProps> = ({ receiver, show, setShowPreview, isLoading }) => {
  const [trades] = useAtom(tradesAtom);
  const _trades = React.useMemo(() => trades.sort((prev, next) => Number(next?.trade?.to?.tokenAmount) - Number(prev?.trade?.to?.tokenAmount)), [trades]);

  return (
    show ? 
      <Card className="provider p-3 w-[340px] md:w-[400px] max-h-[500px] overflow-y-auto">
        <CardHeader>Providers List</CardHeader>
        <CardBody className="provider">
          {
            isLoading && (
              <div className="flex items-center justify-center mb-2">
                <svg className="animate-spin border-indigo-300" xmlns="http://www.w3.org/2000/svg" width="53" height="52" viewBox="0 0 53 52" fill="none">
                  <g id="Group 1000003704">
                    <path id="Ellipse 713" d="M49.8481 23.4123L52.2848 6.26401L36.2156 12.7279L49.8481 23.4123ZM20.7674 50.9323C21.5781 51.1023 22.3733 50.5829 22.5433 49.7721C22.7134 48.9613 22.194 48.1662 21.3832 47.9961L20.7674 50.9323ZM46.1759 10.4146C43.304 6.69369 39.4591 3.83942 35.0663 2.16731L33.999 4.97106C37.8748 6.44635 41.2671 8.96467 43.801 12.2476L46.1759 10.4146ZM35.0663 2.16731C30.6734 0.495207 25.9038 0.0704002 21.2846 0.939856L21.8395 3.88808C25.915 3.12097 30.1233 3.49577 33.999 4.97106L35.0663 2.16731ZM21.2846 0.939856C16.6654 1.80931 12.3766 3.93916 8.89232 7.09395L10.9059 9.31781C13.98 6.53436 17.764 4.6552 21.8395 3.88808L21.2846 0.939856ZM8.89232 7.09395C5.40804 10.2487 2.86401 14.3056 1.54146 18.816L4.42026 19.6601C5.58713 15.6806 7.83172 12.1013 10.9059 9.31781L8.89232 7.09395ZM1.54146 18.816C0.218917 23.3264 0.169377 28.1147 1.39832 32.6515L4.29396 31.8671C3.20967 27.8643 3.25338 23.6396 4.42026 19.6601L1.54146 18.816ZM1.39832 32.6515C2.62726 37.1883 5.08681 41.2969 8.50507 44.5231L10.5642 42.3414C7.5483 39.4949 5.37825 35.8699 4.29396 31.8671L1.39832 32.6515ZM8.50507 44.5231C11.9233 47.7493 16.1671 49.9674 20.7674 50.9323L21.3832 47.9961C17.3244 47.1449 13.5801 45.1878 10.5642 42.3414L8.50507 44.5231Z" fill="#4F46E5" />
                    <path id="Ellipse 714" d="M26.0008 50.0043C32.2439 50.0043 38.2411 47.5703 42.7183 43.2192C47.1956 38.8682 49.8 32.943 49.9785 26.7024" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 5" />
                  </g>
                </svg>
              </div>
            )
          }
          {
            _trades.map((t: WrappedCrossChainTradeOrNull | WrappedOnChainTradeOrNull, i: number) => {
              return (
                <Provider 
                  key={i} 
                  trade={t} 
                  isBest={i === 0} 
                  onClick={setShowPreview}
                  receiver={receiver}
                />
              )
            })
          }
        </CardBody>
      </Card> : <></>
  );
};

export default ProviderList;