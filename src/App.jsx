import { useEffect } from "react";
import config from "./config.json";
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadToken,
} from "./store/interactions";

function App() {
  const loadBlockchainData = async () => {
    await loadAccount();

    const provider = loadProvider();
    const chainId = await loadNetwork(provider);

    await loadToken(provider, config[chainId].DApp.address);
  };

  useEffect(() => {
    loadBlockchainData();
  });

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
