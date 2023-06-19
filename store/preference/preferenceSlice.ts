import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

let initialState: {
  language: string;
  darkMode: boolean;
  currency: string;
  password: string;
  name: string;
  Ccountry: { name: string; id: string };
} = {
  language: "francais",
  darkMode: false,
  currency: "RUB",
  name: "jean",
  password: "password",
  Ccountry: { id: "", name: "" },
};
const preferenceSlice = createSlice({
  name: "preference",
  initialState: { ...initialState },
  reducers: {
    setPreferences: (state, action) => {
      let value = action.payload;
      console.log("🚀 ~ file: preferenceSlice.ts:16 ~ value:", value);

      state.darkMode = value.darkMode;
      state.currency = value.currency;
      state.language = value.language;
      state.name = value.name;
      state.Ccountry = value.country;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});
export const { setPreferences } = preferenceSlice.actions;

export default preferenceSlice.reducer;
