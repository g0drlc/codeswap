"use client";
import React from "react";
import { BlockchainName, BLOCKCHAIN_NAME } from "rubic-sdk";
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Listbox,
  ListboxItem,
  Image,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { twMerge } from "tailwind-merge";

import TokenSelector from "@/components/swap-widget/selector/tokenSelector";
import { blockchainsList, RankedBlockchain } from "@/constants/blockchains-list";
import { blockchainIcon } from "@/constants/blockchain-icon";
import { BackendToken } from "@/types/token";

import "./style.css";

interface IProps {
  show: boolean;
  network?: BlockchainName;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleChangeAsset: (_blockchain: BlockchainName, _token: BackendToken) => void;
};

const AssetSelector: React.FC<IProps> = ({
  show,
  network,
  setShow,
  handleChangeAsset,
}) => {
  const [blockchainList, setBlokchainList] = React.useState<RankedBlockchain[]>(blockchainsList);
  const [queryChain, setQueryChain] = React.useState<string>("");

  const filteredBlokchainList = React.useMemo(() => {
    if (queryChain) {
      return blockchainsList.filter((chain) =>
        chain.name.toLowerCase().includes(queryChain.toLowerCase())
      );
    }
    return blockchainsList;
  }, [queryChain, blockchainsList]);

  React.useEffect(() => {
    setBlokchainList(filteredBlokchainList);
  }, [filteredBlokchainList]);

  const [innerNetwork, setInnterNetwork] = React.useState<BlockchainName>(BLOCKCHAIN_NAME.ETHEREUM);

  const handleNetworkChange = (_network: BlockchainName) => {
    if (innerNetwork !== _network) {
        setInnterNetwork(_network)
    }
  }

  return (
    <Modal
      backdrop="opaque"
      isOpen={show}
      onOpenChange={(isOpen: boolean) => {
        setShow(isOpen);
      }}
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent className="max-w-[610px] w-full">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              Select Chain and Token
            </ModalHeader>
            <ModalBody>
              <div className="flex gap-2">
                <div className="w-[40%]">
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
                      placeholder="Search blockchain"
                      startContent={<Icon icon="clarity:search-line" />}
                      onChange={(e) => setQueryChain(e.target.value)}
                      onClear={() => setQueryChain("")}
                    />
                  </div>
                  <div className="w-full relative border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                    <Listbox
                      variant="faded"
                      className="w-full tokenListContainer max-h-[400px] overflow-y-scroll"
                      aria-label="Blochain List"
                    >
                      {blockchainList.map((blockchain, index) => (
                        <ListboxItem
                          key={index}
                          className={twMerge(
                            "w-full border-none",
                            innerNetwork === blockchain.name && "bg-gray-50/10"
                          )}
                          startContent={
                            <Image
                              src={`/${blockchainIcon[blockchain.name]}`}
                              className="w-6"
                              alt="img"
                            />
                          }
                          onClick={() => handleNetworkChange(blockchain.name)}
                        >
                          {blockchain.name}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                </div>
                <TokenSelector
                  blockchain={innerNetwork}
                  handleChangeAsset={handleChangeAsset}
                />
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AssetSelector;
