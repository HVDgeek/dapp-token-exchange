import { createSlice } from "@reduxjs/toolkit";
import { globalState as GlobalState } from "./states/globalState";
import { providerActions, tokenActions } from "./actions";

const globalSlices = createSlice({
  name: "global",
  initialState: GlobalState,
  reducers: {
    ...providerActions,
    ...tokenActions,
  },
});

export const globalActions = globalSlices.actions;
export default globalSlices.reducer;
