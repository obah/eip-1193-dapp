import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";

export function CheckBalance() {
  const [inputAddress, setInputAddress] = useState<string>("");

  const { chainId, balance } = useWallet();

  const handleWalletSubmit = () => {
    console.log(inputAddress);
  };

  return (
    <div className="h-1/2 grid place-items-center">
      {!!balance && (
        <>
          <p>Balance: {balance}</p>
          <p>ChainID: {chainId}</p>
        </>
      )}

      <div className="flex flex-col space-y-3">
        <input
          name="address"
          placeholder="Enter wallet address"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
        />
        <button onClick={handleWalletSubmit}>Check Wallet</button>
      </div>
    </div>
  );
}
