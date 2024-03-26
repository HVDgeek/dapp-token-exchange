import { ethers } from "ethers";
import { globalActions } from "./globalSlices";
import TOKEN_ABI from "../abis/Token.json";
import store from ".";

const { setConnection, setNetwork, setAccount, setToken } = globalActions;

export const loadProvider = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  store.dispatch(setConnection(provider.connection));
  return provider;
};

export const loadNetwork = async (provider) => {
  const { chainId } = await provider.getNetwork();

  store.dispatch(setNetwork(chainId));

  return chainId;
};

export const loadAccount = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const account = ethers.utils.getAddress(accounts[0]);
  store.dispatch(setAccount(account));

  return account;
};

export const loadToken = async (provider, address) => {
  const token = new ethers.Contract(address, TOKEN_ABI, provider);
  const symbol = await token.symbol();

  store.dispatch(
    setToken({
      loaded: true,
      contract: token, //*refactor*/
      symbol,
    })
  );

  return token;
};
