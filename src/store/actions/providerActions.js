export const providerActions = {
  setConnection: (state, action) => {
    state.provider = {
      ...state.provider,
      connection: action.payload,
    };
  },
  setNetwork: (state, action) => {
    state.provider = {
      ...state.provider,
      chainId: action.payload,
    };
  },
  setAccount: (state, action) => {
    state.provider = {
      ...state.provider,
      account: action.payload,
    };
  },
};
