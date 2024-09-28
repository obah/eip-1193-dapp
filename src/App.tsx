import { useWallet } from "../hooks/useWallet";
import { CheckBalance } from "./components/CheckBalance";

function App() {
  const { account, getAccount, chainId, handleDisconnect, isConnected } =
    useWallet();

  return (
    <main className="shadow-md border-[0.5px] border-yellow-600 p-4 shadow-yellow-300 w-1/2 h-80 mx-auto mt-40 rounded-xl">
      <div className="flex items-center justify-between">
        <p>{account === null ? "Not connected!" : `Connected to ${chainId}`}</p>
        <button
          onClick={account === null ? getAccount : handleDisconnect}
          className="h-[30px] flex items-center"
        >
          {account === null ? "Connect Wallet" : account}
        </button>
      </div>

      {isConnected ? (
        <CheckBalance />
      ) : (
        <div className="h-1/2 grid place-items-center">
          <button className="border border-red-400" onClick={getAccount}>
            Connect Wallet
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
