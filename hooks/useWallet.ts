/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    ethereum?: any;
    // ethereum?: MetaMaskEthereumProvider;
  }
}

interface MetaMaskEthereumProvider extends EventListener {
  request: (args: { method: string }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  // removeListener: (event: string, ) => {}
}

// interface ProviderRpcError extends Error {
//   code: number;
//   data?: unknown;
// }

import { useEffect, useState } from "react";

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

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
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
      setBalance(null);
    }
  }, [account]);

  function startApp(provider: MetaMaskEthereumProvider) {
    if (provider !== window.ethereum) {
      console.error("Do you have multiple wallets installed?");
    }

    provider
      .request({ method: "eth_chainId" })
      .then((currentChainId: string) => {
        setChainId(currentChainId);
      });

    provider.on("chainChanged", handleChainChanged);
    provider.on("accountsChanged", handleAccountsChanged);
  }

  function handleChainChanged(newChainId: string) {
    setChainId(newChainId);
  }

  function handleDisconnect() {
    setAccount(null);
    alert("disconnected");
  }

  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  }

  // async function getBalance() {}

  async function getAccount() {
    try {
      const accounts = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        console.log("No accounts found.");
      }
    } catch (error) {
      // if (error.code === 4001 as number) {
      //   console.log("Please connect to MetaMask.");
      // } else {
      //   console.error(error);
      // }
      console.error(error);
    }
  }

  return {
    account,
    chainId,
    getAccount,
    handleDisconnect,
    isConnected,
    balance,
  };
}
