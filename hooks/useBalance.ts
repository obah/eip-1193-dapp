import { useState } from "react";
import { ethers } from "ethers";

export function useBalance() {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  async function getBalance(address: string) {
    if (!ethers.isAddress(address)) {
      setIsInvalid(true);
      return "Invalid Address";
    }

    setIsInvalid(false);

    let formattedBalance: string = "";

    setIsLoading(true);

    try {
      const newBalance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      formattedBalance = parseInt(newBalance, 16).toString();
      setBalance(formattedBalance);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);

    return formattedBalance;
  }

  return {
    balance,
    getBalance,
    isLoading,
    isInvalid,
  };
}
