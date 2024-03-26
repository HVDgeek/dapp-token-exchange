import { configureStore } from "@reduxjs/toolkit";
import globalSlices from "./globalSlices";

const store = configureStore({
  reducer: {
    globalState: globalSlices,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: true,
        ignoreState: true,
      },
    }),
});

export default store;
