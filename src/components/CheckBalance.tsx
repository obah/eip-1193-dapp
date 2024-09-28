import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";

export function CheckBalance() {
  const [inputAddress, setInputAddress] = useState<string>("");

  const { chainId, balance, getBalance } = useWallet();

  return (
    <div className="h-1/2 grid place-items-center mt-10">
      {!!balance && (
        <>
          <p>Balance: {balance} wei</p>
          <p>ChainID: {chainId}</p>
        </>
      )}

      <div className="flex flex-col space-y-3">
        <input
          name="address"
          placeholder="Enter wallet address"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          className="bg-white p-2 text-black w-[500px]"
        />
        <button className="" onClick={() => getBalance(inputAddress)}>
          Check Wallet
        </button>
      </div>
    </div>
  );
}
