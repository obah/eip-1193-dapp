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
}

import { useEffect, useState } from "react";

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [otherAccountBalance, setOtherAccountBalance] = useState<string | null>(
    null
  );
  const [otherAccountAddress, setotherAccountAddress] = useState<string | null>(
    null
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setIsConnected(true);
      getUserBalance();
    } else {
      setIsConnected(false);
      setUserBalance(null);
      setOtherAccountBalance(null);
      setotherAccountAddress(null);
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

    if (account) getBalance(account);

    if (otherAccountAddress) getBalance(otherAccountAddress);
  }

  function handleDisconnect() {
    setAccount(null);
    setUserBalance(null);
    setOtherAccountBalance(null);
    alert("disconnected");
  }

  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  }

  async function getBalance(address: string) {
    let balance: string | null = null;

    setIsLoading(true);

    try {
      const newBalance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      balance = parseInt(newBalance, 16).toString();
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);

    return balance;
  }

  async function getUserBalance() {
    const balance = await getBalance(account as string);
    setUserBalance(balance as string);
  }

  async function getOtherAccountBalance(address: string) {
    setotherAccountAddress(address);

    const balance = await getBalance(address);
    setOtherAccountBalance(balance as string);
  }

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
    userBalance,
    otherAccountBalance,
    getOtherAccountBalance,
    isLoading,
  };
}
