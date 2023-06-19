import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ID_ENTREPRISE } from "../../constants/data";
import SQuery from "../../lib/SQueryClient";

type managerSchema = {
  [managerId: string]: {
    name: string;
    accountId: string;
    managerId: string;
    telephone: string;
  };
} & {
  success: boolean;
  loading: boolean;
};
//@ts-ignore
let initialState: managerSchema = {};

const createUser = async ({
  managerId,
  thunkAPI,
}: {
  managerId: string;
  thunkAPI: any;
}) => {
  console.log("🚀 ~ file: managerSlice.tsx:29 ~ dde:", {
    managerId,
    thunkAPI,
  });
  const mangerInstance = await SQuery.newInstance("manager", {
    id: managerId,
  });
  console.log(
    "🚀 ~ file: managerSlice.tsx:30 ~ accountInstance:",
    mangerInstance
  );
  const accountInstance = await mangerInstance?.account;
  const accountId = accountInstance?.$id;
  // const userId = mangerInstance?.$parentId;

  accountInstance?.when("refresh", async (dataManager: any) => {
    let objUserData: any = { id: managerId };
    //@ts-ignore

    Object.keys(dataManager).forEach((key) => {
      if (key === "__createdAt" || key === "__updatedAt") {
        objUserData[key.replaceAll("__", "")] = dataManager[key];
      } else {
        objUserData[key] = dataManager[key];
      }
    });
    thunkAPI.dispatch(managerSlice.actions.updateAccount(objUserData));
  });

  let name = accountInstance?.$cache.name;
  console.log(
    "🚀 ~ file: managerSlice.tsx:56 ~ accountInstance?.$cache:",
    accountInstance?.$cache
  );
  let telephone = accountInstance?.$cache.telephone;
  let imageProfile = accountInstance?.$cache.imgProfile[0];
  return {
    accountId,
    managerId,
    imageProfile,
    name,
    telephone,
  };
};
export const createManager = createAsyncThunk<
  any,
  { name: string; telephone: string; password: string }
>("manager/create", async (data, thunkAPI) => {
  const { name, telephone, password } = data;
  const entrepriseInstance = await SQuery.newInstance("entreprise", {
    id: ID_ENTREPRISE,
  });
  await (
    await entrepriseInstance?.managers
  ).update({
    addNew: [
      {
        account: {
          name,
          password,
          telephone,
          carte: null,
          imgProfile: [],
        },
        contacts: [],
        transactions: [],
        messenger: {
          opened: [],
          closed: [],
        },
        preference: {
          nigthMode: false,
          currentDevise: "rub",
          watcthDifference: "rub/xof",
        },
      },
    ],
  });
});
export const deleteManager = createAsyncThunk<any, { managerId: string }>(
  "manager/delete",
  async (data, thunkAPI) => {
    const { managerId } = data;
    const entrepriseInstance = await SQuery.newInstance("entreprise", {
      id: ID_ENTREPRISE,
    });
    await (
      await entrepriseInstance?.managers
    ).update({
      remove: [managerId],
    });
  }
);

export const updateAccountManager = createAsyncThunk<
  any,
  { name: string; password: string; telephone: string; accountId: string }
>("manager/updateCountries", async (data, thunkAPI) => {
  console.log("🚀 ~ filemanagerSlice.ts:133 ~ > ~ data:", data);
  try {
    return new Promise(async (resolve, reject) => {
      let managerInstance: any;
      try {
        managerInstance = await SQuery.newInstance("account", {
          id: data.accountId,
        });
        Object.keys(data).forEach((key) => {
          if (key !== "accountId") {
            //@ts-ignore
            managerInstance[key] = data[key];
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  } catch (error: any) {
    thunkAPI.rejectWithValue(error);
  }
});
export const fetchManager = createAsyncThunk<any, void>(
  "manager/fetch",
  async (_, thunkAPI) => {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const entrepriseInstance = await SQuery.newInstance("entreprise", {
            id: ID_ENTREPRISE,
          });

          let userManager = await entrepriseInstance?.managers;

          // let userIdManager = await userManager?.$id;
          await userManager.when("update", async (data: any) => {
            if (data.added[0]) {
              try {
                const Id = data.added[0];
                let promiseC = await createUser({
                  managerId: Id,
                  thunkAPI: thunkAPI,
                });
                thunkAPI.dispatch(managerSlice.actions.addUser(promiseC));
              } catch (error) {
                console.log(error);
              }
            }

            if (data.removed[0]) {
              thunkAPI.dispatch(
                managerSlice.actions.removeUser({
                  managerId: data.removed[0],
                })
              );
            }
          });

          let promiseUsers = (await userManager.page()).items.map(
            (manager: any) => {
              return new Promise(async (res, rej) => {
                try {
                  res(
                    await createUser({
                      managerId: manager._id,
                      thunkAPI: thunkAPI,
                    })
                  );
                } catch (error) {
                  rej(error);
                }
              });
            }
          );
          let userArray = (await Promise.allSettled(promiseUsers))
            .filter((f: any) => !!f?.value)
            .map((p: any) => p.value);

          resolve(userArray);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const managerSlice = createSlice({
  name: "manager",
  initialState: initialState,
  reducers: {
    updateAccount: (state, action) => {
      let dataManager = action.payload;
      Object.keys(dataManager).forEach((key) => {
        //@ts-ignore
        state[dataManager.managerId][key] = dataManager[key];
      });

      state.success = true;
      state.loading = false;
      console.log("fulfilled:fetchMangaerAndAgencies");
    },
    addUser: (state, action) => {
      let dataUser = action.payload;
      state[dataUser.managerId] = dataUser;
    },
    removeUser: (state, action) => {
      let { managerId } = action.payload;
      if (state.hasOwnProperty(managerId)) {
        const newState = { ...state };
        delete newState[managerId];
        return newState;
      }
      return state;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchManager.fulfilled, (state, action) => {
      let dataUser = action.payload;
      console.log(
        "🚀 ~ file: managerSlice.tsx:241 ~ builder.addCase ~ dataUser:",
        dataUser
      );

      dataUser.forEach((data: any) => {
        console.log(
          "🚀 ~ file: managerSlice.tsx:249 ~ dataUser.forEach ~ data:",
          data
        );
        state[data.managerId] = data;
      });

      state.loading = false;
      state.success = true;
    });
    builder.addCase(fetchManager.pending, (state, action) => {
      state.loading = true;
      state.success = false;
    });
    builder.addCase(fetchManager.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
    });
  },
});
export default managerSlice.reducer;
