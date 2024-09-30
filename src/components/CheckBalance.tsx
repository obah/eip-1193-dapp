import { useState } from "react";
import { useBalance } from "../../hooks/useBalance";
import { Button } from "./ui/Button";
import { formatEther } from "../../lib/utils";

export function CheckBalance() {
  const [inputAddress, setInputAddress] = useState<string>("");

  const { balance, getBalance, isLoading, isInvalid } = useBalance();

  return (
    <div className="h-1/2 grid place-items-center mt-10">
      {!!balance && (
        <div className="mb-4">
          {isInvalid ? (
            <p className="text-xl text-red-500">Invalid Address</p>
          ) : (
            <p className="text-xl">Balance: {formatEther(balance)} ETH</p>
          )}
        </div>
      )}

      <div className="flex flex-col space-y-3">
        <input
          name="address"
          placeholder="Enter wallet address"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          className="bg-white p-2 text-black w-[500px]"
        />

        <Button onClick={() => getBalance(inputAddress)}>
          {isLoading ? "Loading..." : "Check Wallet"}
        </Button>
      </div>
    </div>
  );
}
