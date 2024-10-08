import { Button, Image } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { BlockchainName } from "rubic-sdk";

import { blockchainIcon } from "@/constants/blockchain-icon";
import { blockchainColor } from "@/constants/blockchain-color";
import { BackendToken } from "@/types/token";

type SelectProps = {
  blockchain: BlockchainName | undefined;
  token?: BackendToken;
  handleClick: (value: boolean) => void;
}

const CustomSelect = ({ blockchain, token, handleClick }: SelectProps) => {
  const Content = () => (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        <div className="rounded-xl pr-3" style={{ backgroundColor: blockchainColor[blockchain as BlockchainName] }}>
          <Image
            className="w-[35px]"
            src={`/${blockchainIcon[blockchain as BlockchainName]}`}
            alt={blockchain || ""}
          />
        </div>
        <div className="z-10 bg-[#3f3f46] p-1 rounded-full -ml-4">
          <Image
            className="w-[35px] rounded-full"
            src={token?.image}
            alt={token?.name}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl">
        <p className="text-sm text-gray-50/40">{blockchain}</p>
        <p>{token?.symbol}</p>
      </div>
    </div>
  );

  return (
    <Button 
      className="w-[350px] h-[70px] text-lg px-3" 
      onClick={() => handleClick(true)}
    >
      <div className="flex justify-between items-center w-full">
        <div className="mr-1 w-full">
          {token ? <Content /> : "Select Token"}
        </div>
        <div>
          <Icon icon="iconamoon:arrow-down-2-duotone" />
        </div>
      </div>
    </Button>
  );
};

export default CustomSelect;
