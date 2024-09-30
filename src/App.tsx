import { CheckBalance } from "./components/CheckBalance";
import { Button } from "./components/ui/Button";
import { formatEther } from "../lib/utils";
import { useWallet } from "../hooks/useWallet";
import { useConnection } from "../hooks/useConnection";

function App() {
  const { walletData } = useWallet();
  const { getAccount, handleDisconnect, userBalance, isLoading } =
    useConnection();

  const { account, chainId } = walletData;

  return (
    <main className="shadow-md border-[0.5px] border-yellow-600 p-4 shadow-yellow-300 w-2/3 h-80 mx-auto mt-40 rounded-xl">
      <div className="flex items-center justify-between">
        <p>{account === null ? "Not connected!" : `Connected to ${chainId}`}</p>

        <div className="flex items-center gap-3">
          <Button onClick={account === null ? getAccount : handleDisconnect}>
            {account === null ? "Connect Wallet" : account}
          </Button>
          {!!userBalance && (
            <p>{isLoading ? "Loading..." : formatEther(userBalance)} ETH</p>
          )}
        </div>
      </div>

      {!account ? (
        <CheckBalance />
      ) : (
        <div className="h-1/2 grid place-items-center">
          <Button onClick={getAccount}>Get started</Button>
        </div>
      )}
    </main>
  );
}

export default App;
