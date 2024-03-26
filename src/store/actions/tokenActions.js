export const tokenActions = {
  setToken: (state, action) => {
    state.tokens = action.payload;
  },
};
