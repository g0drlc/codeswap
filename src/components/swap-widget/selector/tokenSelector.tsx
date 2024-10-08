"use client";
import React from "react";
import _ from "lodash";
import { useAtom } from "jotai";
import { BlockchainName, BLOCKCHAIN_NAME, TO_BACKEND_BLOCKCHAINS } from "rubic-sdk";
import { Input, Image, Listbox, ListboxItem, Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { tokenAtom } from "@/store/token";

import { BackendToken, TokensBackendResponse } from "@/types/token";

interface IProps {
  blockchain: BlockchainName,
  handleChangeAsset: (_blockchain: BlockchainName, _token: BackendToken) => void;
};

const TokenSelector: React.FC<IProps> = ({ blockchain, handleChangeAsset }) => {
  const loaderRef = React.useRef(null);
  const [page, setPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filteredTokens, setFilteredTokens] = React.useState<BackendToken[]>([]);
  const [query, setQuery] = React.useState<string>("");
  const [tokens] = useAtom(tokenAtom);

  const _fetchTokens = async (_page: number, _blockchain: BlockchainName) => {
    try {
      const _tokens = tokens.find(t => t.blockchain === _blockchain)?.tokens;
      if (_page === 1 && _tokens && _tokens.length > 0) {
        return Promise.resolve(_tokens);
      } else {
        const url = `https://tokens.rubic.exchange/api/v1/tokens?page=${_page}&pageSize=200&network=${TO_BACKEND_BLOCKCHAINS[_blockchain]}`;
        const response = await fetch(url);
        const data: TokensBackendResponse = await response.json();
        if (data.results && data.results.length > 0) {
          return Promise.resolve(data.results);
        } else {
          return Promise.resolve([]);
        }
      }
    } catch (error) {
      return Promise.reject([]);
    }
  };

  const getTokensByQuery = React.useMemo(() => 
    _.debounce(async (_blockchain: BlockchainName, _query: string) => {
      setPage(1);
      try {
        setIsLoading(true);
        const url = `https://tokens.rubic.exchange/api/v1/tokens/?network=${TO_BACKEND_BLOCKCHAINS[_blockchain]}&symbol=${_query.toLowerCase()}`;
        const response = await fetch(url);
        const tokens: TokensBackendResponse = await response.json();
        setFilteredTokens(tokens.results);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }, 450)
  , [blockchain, query]);

  const getTokens = async (_page: number, _blockchain: BlockchainName) => {
    try {
      setIsLoading(true);
      const data = await _fetchTokens(_page, _blockchain);
      if (_page === 1) {
        if (_blockchain === BLOCKCHAIN_NAME.ETHEREUM) {
          data[0] = {
            "address": "0x283344eea472f0fe04d6f722595a2fffefe1901a",
            "name": "Code Token",
            "symbol": "CODE",
            "blockchainNetwork": "ethereum",
            "decimals": 13,
            "image": "https://assets.rubic.exchange/assets/ethereum/0x283344eea472f0fe04d6f722595a2fffefe1901a/logo.png",
            "rank": 0,
            "coingeckoId": "code-token",
            "usdPrice": 5.80343e-7,
            "token_security": null
          }
          setFilteredTokens(data);
        } else {
          setFilteredTokens(data);
        }
      } else {
        setFilteredTokens([...filteredTokens, ...data]);
      }
      setPage(_page);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (blockchain && query) {
      getTokensByQuery(blockchain, query);
    } else {
      getTokens(1, blockchain);
    }

    return () => getTokensByQuery.cancel();
  }, [blockchain, query]);

  const handleScroll = () => {
    if (loaderRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = loaderRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10 && blockchain) {
        getTokens(page + 1, blockchain);
    }
    }
  };

  return (
    <div className="w-[60%]">
      <div className="mb-2">
        <Input
          isClearable
          radius="lg"
          classNames={{
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-transparent",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          placeholder="Search name or paste address"
          startContent={<Icon icon="clarity:search-line" />}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
        />
      </div>
      <div className="relative border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        <Listbox
          ref={loaderRef}
          variant="flat"
          className="tokenListContainer max-h-[400px] overflow-y-scroll"
          aria-label="Listbox menu with icons"
          onScroll={handleScroll}
        >
          {filteredTokens ? (
            filteredTokens.map((token, index) => (
              <ListboxItem
                key={index}
                className="border-none"
                textValue={token.name}
                startContent={
                  <Image
                    src={token.image}
                    className="w-8"
                    alt="img"
                  />
                }
                description={token.name}
                onClick={() => {
                  if (isLoading) return
                  handleChangeAsset(blockchain, token);
                }}
              >
                {token.symbol}
              </ListboxItem>
            ))
          ) : (
            <></>
          )}
        </Listbox>
        {isLoading && (
          <Spinner
            color="default"
            className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
          />
        )}
      </div>
    </div>
  );
};

export default TokenSelector;