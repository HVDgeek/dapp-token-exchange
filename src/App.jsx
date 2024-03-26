import { useEffect } from "react";
import { ethers } from "ethers";
import config from "./config.json";
import "./App.css";
import TOKEN_ABI from "./abis/Token.json";

function App() {
  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();

    const token = new ethers.Contract(
      config[chainId].DApp.address,
      TOKEN_ABI,
      provider
    );

    console.log({ SYMBOL: await token.symbol() });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      {/* Navbar */}

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}

          {/* Balance */}

          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}
        </section>
      </main>

      {/* Alert */}
    </div>
  );
}

export default App;