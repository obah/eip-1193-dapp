import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useEffect,
} from "react";

interface IWallet {
  account: string | null;
  chainId: string | null;
}

interface WalletContextProps {
  walletData: IWallet;
  setWalletData: Dispatch<SetStateAction<IWallet>>;
}

const initialWallet: IWallet = {
  account: null,
  chainId: null,
};

export const WalletContext = createContext<WalletContextProps>({
  walletData: initialWallet,
  setWalletData: () => {},
});

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletData, setWalletData] = useState<IWallet>(initialWallet);

  useEffect(() => {
    if (walletData.account) {
      setWalletData((prev) => ({ ...prev, isConnected: true }));
    } else {
      setWalletData((prev) => ({ ...prev, isConnected: false }));
    }
  }, [walletData.account]);

  return (
    <WalletContext.Provider value={{ walletData, setWalletData }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
