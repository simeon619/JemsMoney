import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { ID_ENTREPRISE } from "../../constants/data";
import { CountryDataServerSchema } from "../../fonctionUtilitaire/type";
import SQuery from "../../lib/SQueryClient";
export type Agency = {
  id: string;
  name: string;
  icon: string;
  idCountry: string;
  number: string;
  managerName: string;
  charge: number;
};

export type AgencyServer = {
  id: string;
  name?: string;
  icon?: string;
  idCountry: string;
  number?: string;
  managerName?: string;
  charge?: number;
};
export type countryUpdate = {
  id: string;
  charge?: number;
  indicatif?: string;
  digit?: string;
};

type SchemaStateCountry = {
  [countryId: string]: {
    agency: Agency[];
    id: string;
    name: string;
    icon: string;
    charge: number;
    currency: string;
    indicatif: string;
    digit: string;
  };
} & {
  success: boolean;
  loading: boolean;
};
//@ts-ignore
let initialState: SchemaStateCountry = {};

const createAgency = async ({
  agencyId,
  thunkAPI,
  idCountry,
}: {
  agencyId: string;
  thunkAPI: any;
  idCountry: any;
}) => {
  const agencyInstance = await SQuery.newInstance("agence", {
    id: agencyId,
  });
  agencyInstance?.when("refresh", async (dataCountry) => {
    let objCountryData: any = { id: agencyId, idCountry };
    //@ts-ignore

    Object.keys(dataCountry).forEach((key) => {
      if (key === "__createdAt" || key === "__updatedAt") {
        objCountryData[key.replaceAll("__", "")] = dataCountry[key];
      } else {
        objCountryData[key] = dataCountry[key];
      }
    });
    thunkAPI.dispatch(countrySlice.actions.updateAgencies(objCountryData));
  });

  let id = await agencyInstance?._id;
  let name = await agencyInstance?.name;
  let icon = await agencyInstance?.icon;
  let charge = await agencyInstance?.charge;
  let managerName = await agencyInstance?.managerName;
  let number = await agencyInstance?.number;

  return {
    id,
    name,
    idCountry,
    icon,
    charge,
    managerName,
    number,
  };
};

const createCountry = async ({
  idCountry,
  thunkAPI,
}: {
  idCountry: string;
  thunkAPI: any;
}) => {
  const countryInstance = await SQuery.newInstance("country", {
    id: idCountry,
  });
  countryInstance?.when("refresh", async (dataCountry) => {
    let objCountryData: any = { id: idCountry };
    //@ts-ignore

    Object.keys(dataCountry).forEach((key) => {
      if (key === "__createdAt" || key === "__updatedAt") {
        objCountryData[key.replaceAll("__", "")] = dataCountry[key];
      } else {
        objCountryData[key] = dataCountry[key];
      }
    });
    thunkAPI.dispatch(countrySlice.actions.updateCountry(objCountryData));
  });
  let id = await countryInstance?._id;
  let name = await countryInstance?.name;
  let currency = await countryInstance?.currency;
  let digit = await countryInstance?.digit;
  let indicatif = await countryInstance?.indicatif;
  let icon = await countryInstance?.icon;
  let charge = await countryInstance?.charge;
  let agenciesArray = await countryInstance?.agencies;
  await agenciesArray.when("update", async (data: any) => {
    console.log(
      "🚀 ~ file: countrySlice.ts:131 ~ awaitagenciesArray.when ~ data:",
      data
    );

    if (data.added[0]) {
      const Id = data.added[0];
      try {
        let agence = await createAgency({
          agencyId: Id,
          thunkAPI: thunkAPI,
          idCountry: id,
        });
        thunkAPI.dispatch(countrySlice.actions.addAgency(agence));
      } catch (error) {
        // rej(error);
      }
    }

    if (data.removed[0]) {
      try {
        thunkAPI.dispatch(
          countrySlice.actions.removeAgency({ id: data.removed[0], idCountry })
        );
      } catch (error) {
        // rej(error);
      }
    }
  });
  let promiseAgencies = (await agenciesArray.page()).items.map(
    (agency: any) => {
      return new Promise(async (res, rej) => {
        try {
          res(
            await createAgency({
              agencyId: agency._id,
              thunkAPI: thunkAPI,
              idCountry: idCountry,
            })
          );
        } catch (error) {
          rej(error);
        }
      });
    }
  );
  let agencyArray = (await Promise.allSettled(promiseAgencies))
    .filter((f: any) => !!f?.value)
    .map((p: any) => p.value);

  return {
    id,
    currency,
    digit,
    indicatif,
    name,
    icon,
    charge,
    agency: agencyArray,
  };
};
export const addCountries = createAsyncThunk<any, CountryDataServerSchema>(
  "country/add",
  async (data, thunkAPI) => {
    console.log("🚀 ~ file: countrySlice.ts:104 ~ data:", data);
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const entrepriseInstance = await SQuery.newInstance("entreprise", {
            id: ID_ENTREPRISE,
          });
          if (entrepriseInstance && entrepriseInstance?.countries) {
            await (
              await entrepriseInstance.countries
            ).update({ addNew: [data] });
          }
          console.log("🚀 ~ file: countrySlice.ts:156 ~ > ~ data:", data); // resolve("");
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const addAgencies = createAsyncThunk<any, Omit<AgencyServer, "id">>(
  "country/addAgencies",
  async (data, thunkAPI) => {
    console.log("🚀 ~ file: countrySlice.ts:104 ~ data:", data);
    const { idCountry } = data;

    try {
      return new Promise(async (resolve, reject) => {
        try {
          const CountryInstance = await SQuery.newInstance("country", {
            id: idCountry,
          });
          if (CountryInstance && CountryInstance?.agencies) {
            await (await CountryInstance.countries).update({ addNew: [data] });
          }
          console.log("🚀 ~ file: countrySlice.ts:156 ~ > ~ data:", data); // resolve("");
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateCountry = createAsyncThunk<any, countryUpdate>(
  "country/updateCountries",
  async (data, thunkAPI) => {
    console.log("🚀 ~ file: countrySlice.ts:133 ~ > ~ data:", data);
    try {
      return new Promise(async (resolve, reject) => {
        let countryInstance: any;
        try {
          countryInstance = await SQuery.newInstance("country", {
            id: data.id,
          });
          Object.keys(data).forEach((key) => {
            if (key !== "id") {
              //@ts-ignore
              countryInstance[key] = data[key];
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteCountry = createAsyncThunk<any, { idCountry: string }>(
  "country/removeCountries",
  async (data, thunkAPI) => {
    const { idCountry } = data;

    try {
      return new Promise(async (resolve, reject) => {
        let entrepriseInstance;
        try {
          entrepriseInstance = await SQuery.newInstance("entreprise", {
            id: ID_ENTREPRISE,
          });
          console.log(
            "🚀 ~ file: countrySlice.ts:252 ~ returnnewPromise ~ entrepriseInstance:",
            entrepriseInstance
          );
          await (
            await entrepriseInstance?.countries?.update
          )({
            remove: [idCountry],
          });
          // resolve("");
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAgence = createAsyncThunk<any, AgencyServer>(
  "country/updateAgencies",
  async (data, thunkAPI) => {
    let agenceInstance: any;
    try {
      return new Promise(async (resolve, reject) => {
        try {
          agenceInstance = await SQuery.newInstance("agence", {
            id: data.id,
          });
          Object.keys(data).forEach((key) => {
            if (key !== "idCountry" && key !== "id") {
              //@ts-ignore
              agenceInstance[key] = data[key];
            }
          });
          // agenceInstance = newData;
          // resolve("");
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const removeAgence = createAsyncThunk<
  any,
  { idAgence: string; idCountry: string }
>("country/removeAgencies", async (data, thunkAPI) => {
  const { idAgence, idCountry } = data;
  console.log("🚀 ~ file: countrySlice.ts:156 ~ > ~ data:", data);
  let countryInstance;
  try {
    return new Promise(async (resolve, reject) => {
      try {
        countryInstance = await SQuery.newInstance("country", {
          id: idCountry,
        });
        console.log(await countryInstance?.agencies, "454548784545484d");
        console.log(countryInstance, "454548784545484d");

        (await countryInstance?.agencies)?.update({
          remove: [idAgence],
        });
      } catch (error) {
        reject(error);
      }
    });
  } catch (error: any) {
    thunkAPI.rejectWithValue(error);
  }
});

export const fetchCountryAndAgencies = createAsyncThunk<any, void>(
  "country/fetch",
  async (_, thunkAPI) => {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const entrepriseInstance = await SQuery.newInstance("entreprise", {
            id: ID_ENTREPRISE,
          });
          let countries = await entrepriseInstance?.countries;
          await countries.when("update", async (data: any) => {
            console.log(
              "🚀 ~ file: countrySlice.ts:337 ~ awaitcountries.when ~ data:",
              data
            );
            if (data.added[0]) {
              try {
                const Id = data.added[0];
                let promiseC = await createCountry({
                  idCountry: Id,
                  thunkAPI: thunkAPI,
                });
                thunkAPI.dispatch(countrySlice.actions.addCountry(promiseC));
              } catch (error) {
                console.log(error);
              }
            }

            if (data.removed[0]) {
              thunkAPI.dispatch(
                countrySlice.actions.removeCountry({
                  idCountry: data.removed[0],
                })
              );
            }
          });
          let promiseCountries = (await countries.page()).items.map(
            (country: any) => {
              return new Promise(async (res, rej) => {
                try {
                  res(
                    await createCountry({
                      idCountry: country._id,
                      thunkAPI: thunkAPI,
                    })
                  );
                } catch (error) {
                  rej(error);
                }
              });
            }
          );
          let countryArray = (await Promise.allSettled(promiseCountries))
            .filter((f: any) => !!f?.value)
            .map((p: any) => p.value);

          resolve(countryArray);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const countrySlice = createSlice({
  name: "country",
  initialState: { ...initialState },
  reducers: {
    fetchCountryAndAgencies: (state, action) => {
      let dataCountries = action.payload;

      state[dataCountries.id] = dataCountries;

      state.success = true;
      state.loading = false;
      console.log("fulfilled:fetchCountryAndAgencies");
    },
    addAgency: (state, action) => {
      let dataAgencies = action.payload;
      state[dataAgencies.idCountry].agency.push(dataAgencies);
    },
    addCountry: (state, action) => {
      let dataCountries = action.payload;
      state[dataCountries.id] = dataCountries;
    },
    removeAgency: (state, action) => {
      let dataAgencies = action.payload;
      const objectIndex = state[dataAgencies.idCountry].agency.findIndex(
        (obj) => obj.id === dataAgencies.id
      );
      state[dataAgencies.idCountry].agency.splice(objectIndex, 1);
    },
    updateAgencies: (state, action) => {
      let dataAgencies = action.payload;
      const objectIndex = state[dataAgencies.idCountry].agency.findIndex(
        (obj) => obj.id === dataAgencies.id
      );

      Object.keys(dataAgencies).forEach((key) => {
        //@ts-ignore
        state[dataAgencies.idCountry].agency[objectIndex][key] =
          dataAgencies[key];
      });
      state[dataAgencies.idCountry] = dataAgencies;

      state.success = true;
      state.loading = false;
      console.log("fulfilled:fetchCountryAndAgencies");
    },
    removeCountry: (state, action) => {
      let { idCountry } = action.payload;
      if (state.hasOwnProperty(idCountry)) {
        const newState = { ...state };
        delete newState[idCountry];
        return newState;
      }

      return state;
    },
    updateCountry: (state, action) => {
      let dataCountry = action.payload;
      // const objectIndex = state[dataCountry.idCountry].agency.findIndex(
      //   (obj) => obj.id === dataAgencies.id
      // );

      Object.keys(dataCountry).forEach((key) => {
        //@ts-ignore
        state[dataCountry.idCountry][key] = dataCountry[key];
      });

      state.success = true;
      state.loading = false;
      console.log("fulfilled:fetchCountryAndAgencies");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCountryAndAgencies.pending, (state) => {
      state.loading = true;
      state.success = false;

      console.log("pending:fetchCountryAndAgencies");
    });
    builder.addCase(fetchCountryAndAgencies.fulfilled, (state, action) => {
      let dataCountries = action.payload;
      dataCountries.forEach((dataCountry: any) => {
        state[dataCountry.id] = dataCountry;
      });
      state.success = true;
      state.loading = false;
      console.log("fulfilled:fetchCountryAndAgencies");
    });
    builder.addCase(fetchCountryAndAgencies.rejected, (state) => {
      console.log("rejected:fetchCountryAndAgencies");
      state.success = false;
      state.loading = false;
    });
    builder.addCase(PURGE, () => initialState);
  },
});

export default countrySlice.reducer;
