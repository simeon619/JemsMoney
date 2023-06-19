import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CountryAPISchema } from "../fonctionUtilitaire/type";

let state: {
  data: CountryAPISchema[];
  loading: boolean;
  error: string | null;
} = {
  data: [],
  loading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk("countries/fetch", async () => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const jsonData: CountryAPISchema[] = await response.json();
  return jsonData.filter((country) => country.unMember === true);
});

const countriesAPISlice = createSlice({
  name: "countries",
  initialState: state,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "ERROR 404";
      });
  },
});

export default countriesAPISlice.reducer;
