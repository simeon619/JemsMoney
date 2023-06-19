import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { ID_ENTREPRISE } from "../../constants/data";
import SQuery from "../../lib/SQueryClient";

type SchemaStateEntreprise = {
  success: boolean;
  loading: boolean;
  rates: { [str: string]: number };
  serviceCharge: number;
};
//@ts-ignore
let initialState: SchemaStateEntreprise = {};

export const fetchEntrepriseSlice = createAsyncThunk<any, void>(
  "entreprise/fetch",
  async (_, thunkAPI) => {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const entrepriseInstance = await SQuery.newInstance("entreprise", {
            id: ID_ENTREPRISE,
          });
          let serviceCharge = await entrepriseInstance?.serviceCharge;
          console.log(
            "🚀 ~ file: entrepriseSlice.ts:25 ~ returnnewPromise ~ entrepriseInstance?.serviceCharge:",
            entrepriseInstance?.serviceCharge
          );
          let rates = await entrepriseInstance?.rates;

          resolve({ rates, serviceCharge });
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateRate = createAsyncThunk<any, { [str: string]: number }>(
  "entreprise/rates",
  async (data, thunkAPI) => {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const entrepriseInstance = await SQuery.newInstance("entreprise", {
            id: ID_ENTREPRISE,
          });
          if (entrepriseInstance?.rates) {
            entrepriseInstance.rates = data;
          }
          // resolve({ rates });
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateCharges = createAsyncThunk<any, number>(
  "entreprise/rates",
  async (data, thunkAPI) => {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const entrepriseInstance = await SQuery.newInstance("entreprise", {
            id: ID_ENTREPRISE,
          });
          if (entrepriseInstance?.charges) {
            entrepriseInstance.charges = data;
          }
          // resolve({ rates });
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const entrepriseSlice = createSlice({
  name: "entreprise",
  initialState: { ...initialState },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEntrepriseSlice.pending, (state) => {
      state.loading = true;
      state.success = false;

      console.log("pending:fetchEntrepriseSlice");
    });
    builder.addCase(fetchEntrepriseSlice.fulfilled, (state, action) => {
      let dataEntreprise = action.payload;

      state.rates = dataEntreprise.rates;
      state.serviceCharge = dataEntreprise.serviceCharge;
      state.success = true;
      state.loading = false;
      console.log("fulfilled:fetchEntrepriseSlice");
    });
    builder.addCase(fetchEntrepriseSlice.rejected, (state) => {
      console.log("rejected:fetchEntrepriseSlice");
      state.success = false;
      state.loading = false;
    });
    builder.addCase(PURGE, () => initialState);
  },
});

export default entrepriseSlice.reducer;
