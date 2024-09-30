/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useWallet } from "./useWallet";
import { useBalance } from "./useBalance";

declare global {
  interface Window {
    ethereum?: any;
    // ethereum?: MetaMaskEthereumProvider;
  }
}

interface MetaMaskEthereumProvider extends EventListener {
  request: (args: { method: string }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
}

export function useConnection() {
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { walletData, setWalletData } = useWallet();

  const { getBalance } = useBalance();

  const { account, chainId } = walletData;

  useEffect(() => {
    async function setup() {
      if (window.ethereum) {
        startApp(window.ethereum);
      } else {
        alert("Please install MetaMask!");
      }
    }

    setup();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      getUserBalance();
    } else {
      setUserBalance(null);
    }
  }, [account, chainId]);

  function startApp(provider: MetaMaskEthereumProvider) {
    if (provider !== window.ethereum) {
      console.error("Do you have multiple wallets installed?");
    }

    provider
      .request({ method: "eth_chainId" })
      .then((currentChainId: string) => {
        setWalletData((prev) => ({ ...prev, chainId: currentChainId }));
      });

    provider.on("chainChanged", handleChainChanged);
    provider.on("accountsChanged", handleAccountsChanged);
  }

  function handleChainChanged(newChainId: string) {
    setWalletData((prev) => ({ ...prev, chainId: newChainId }));

    if (account) getBalance(account);
  }

  function handleDisconnect() {
    setWalletData((prev) => ({ ...prev, account: null }));
    setUserBalance(null);
    alert("disconnected");
  }

  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      setWalletData((prev) => ({ ...prev, account: null }));
    } else {
      setWalletData((prev) => ({ ...prev, account: accounts[0] }));
    }
  }

  async function getUserBalance() {
    setIsLoading(true);
    const balance = await getBalance(account as string);
    setIsLoading(false);
    setUserBalance(balance as string);
  }

  async function getAccount() {
    try {
      const accounts = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setWalletData((prev) => ({ ...prev, account: accounts[0] }));
      } else {
        console.log("No accounts found.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    getAccount,
    handleDisconnect,
    userBalance,
    isLoading,
  };
}
