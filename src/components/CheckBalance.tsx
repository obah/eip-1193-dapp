import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { Button } from "./ui/Button";
import { formatEther } from "../../lib/utils";

export function CheckBalance() {
  const [inputAddress, setInputAddress] = useState<string>("");

  const { otherAccountBalance, getOtherAccountBalance, isLoading } =
    useWallet();

  return (
    <div className="h-1/2 grid place-items-center mt-10">
      {!!otherAccountBalance && (
        <div className="mb-4">
          <p className="text-xl">
            Balance: {formatEther(otherAccountBalance)} ETH
          </p>
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
        <Button onClick={() => getOtherAccountBalance(inputAddress)}>
          {isLoading ? "Loading..." : "Check Wallet"}
        </Button>
      </div>
    </div>
  );
}
