import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enablePatches, produceWithPatches } from "immer";
import { PURGE } from "redux-persist";
import { RootState } from "..";
import SQuery from "../../lib/SQueryClient";
enablePatches();
type accountSchema = {
  name: string;
  telephone: string;
  profilePicture: string;
} | null;
type updateTransactionSchema = {
  data: {
    transactionId: string;
    transacData: {
      sum?: string;
      codePromo?: string;
      senderFile?: any;
      receiverName?: string;
      country?: any;
      telephone?: string;
      carte?: string;
      agence?: string;
      typeTransaction?: string;
    };
  };
};
export type transactionDataSchema = {
  sender: accountSchema;
  id?: string;
  manager: accountSchema;
  discussionId: string;
  __updatedAt?: number;
  __createdAt?: number;
  receiverName?: string;
  senderFile?: any;
  managerFile?: any;
  country?: any;
  telephone?: string;
  carte?: string;
  agence?: string;
  codePromo?: string;
  createdAt?: string;
  updatedAt?: string;
  sum?: string;
  status: "start" | "run" | "end" | "cancel" | "full" | "";
};
export type TransactionSchema = {
  [TransactionId: string]: transactionDataSchema;
};
type initialState = {
  start: TransactionSchema;
  full: TransactionSchema;
  run: TransactionSchema;
  end: TransactionSchema;
  cancel: TransactionSchema;
  fetchSuccess: boolean;
  fetchLoading: boolean;
};
let initialState: initialState = {
  start: {
    "": { sender: null, manager: null, discussionId: "", status: "" },
  },
  full: {
    "": { sender: null, manager: null, discussionId: "", status: "" },
  },
  run: {
    "": { sender: null, manager: null, discussionId: "", status: "" },
  },
  end: {
    "": { sender: null, manager: null, discussionId: "", status: "" },
  },
  cancel: {
    "": { sender: null, manager: null, discussionId: "", status: "" },
  },
  fetchLoading: false,
  fetchSuccess: false,
};

async function createTransaction({
  transactionId,
  thunkAPI,
}: {
  transactionId: string;
  thunkAPI: any;
}) {
  const transaction = await SQuery.newInstance("transaction", {
    id: transactionId,
  });

  transaction?.when("refresh", async (transaction) => {
    //  Object.keys(obj)
    const refreshStatus = async () => {
      const transactionRefresh = await SQuery.newInstance("transaction", {
        id: transactionId,
      });
      //@ts-ignore
      let objTransaction: initialState = {};
      let objTransactionData: any = {};
      const status = (await transactionRefresh?.status) as
        | "start"
        | "run"
        | "end"
        | "cancel"
        | "full";
      if (!objTransaction[status]) {
        objTransaction[status] = {};
      }
      (
        ["start", "run", "cancel", "full"] as (
          | "start"
          | "run"
          | "cancel"
          | "full"
        )[]
      ).forEach((st) => {
        const transationForget = (thunkAPI.getState() as RootState).transation[
          st
        ][transactionId];

        if (transationForget) {
          console.log(
            "🚀 ~ file: transactionSlice.ts:127 ~ ).forEach ~ transationForget:",
            transationForget
          );
          objTransactionData = transationForget;
        }
      });
      // if (keyTransaction === "agence") {
      //   let charge = transaction[keyTransaction].$cache.charge;
      //   let id = transaction[keyTransaction].$cache._id;
      //   let managerName = transaction[keyTransaction].$cache.managerName;
      //   let name = transaction[keyTransaction].$cache.name;
      //   let icon = transaction[keyTransaction].$cache.icon;
      //   let number = transaction[keyTransaction].$cache.number;

      //   let collecteDataAgence = {
      //     charge,
      //     id,
      //     icon,
      //     name,
      //     number,
      //     managerName,
      //   };
      // }
      // objTransactionData["agence"] = collecteDataAgence;
      // objTransactionData["country"] = collecteDataCountry;

      // if (keyTransaction === "country") {
      //   let id = transaction[keyTransaction].$cache._id;
      //   let agencies = transaction[keyTransaction].$cache.agencies;
      //   let allowCarte = transaction[keyTransaction].$cache.allowCarte;
      //   let icon = transaction[keyTransaction].$cache.icon;
      //   let name = transaction[keyTransaction].$cache.name;
      //   let indicatif = transaction[keyTransaction].$cache.indicatif;
      //   let digit = transaction[keyTransaction].$cache.digit;
      //   let currency = transaction[keyTransaction].$cache.currency;
      //   console.log(
      //     "🚀 ~ file: transactionSlice.ts:152 ~ Object.keys ~ transaction[keyTransaction]:",
      //     transaction[keyTransaction]
      //   );

      //   let collecteDataCountry = {
      //     id,
      //     agencies,
      //     allowCarte,
      //     icon,
      //     name,
      //     indicatif,
      //     digit,
      //     currency,
      //   };
      // }

      Object.keys(transaction).forEach(async (keyTransaction) => {
        if (keyTransaction === "agence") {
          objTransactionData[keyTransaction] =
            transaction[keyTransaction].$cache._id;
          console.log(
            "🚀 ~ file: transactionSlice.ts:183 ~ Object.keys ~ transaction[keyTransaction]:",
            transaction[keyTransaction]
          );
        } else if (keyTransaction === "country") {
          objTransactionData[keyTransaction] =
            transaction[keyTransaction].$cache._id;
        } else if (
          keyTransaction === "__createdAt" ||
          keyTransaction === "__updatedAt"
        ) {
          objTransactionData[keyTransaction.replaceAll("__", "")] =
            transaction[keyTransaction];
        } else {
          objTransactionData[keyTransaction] = transaction[keyTransaction];
        }
      });
      objTransaction[status][transactionId] = objTransactionData;
      thunkAPI.dispatch(
        transactionSlice.actions.clearTransaction({ status, transactionId })
      );
      // Object.keys
      thunkAPI.dispatch(
        transactionSlice.actions.fetchTransactionFulfilled([objTransaction])
      );
    };

    refreshStatus();
  });

  const id = await transaction?._id;
  const senderFile = (await transaction?.senderFile)[0];
  const managerFile = (await transaction?.managerFile)[0];
  const updatedAt = await transaction?.__updatedAt;
  const createdAt = await transaction?.__createdAt;
  const telephone = await transaction?.telephone;
  const carte = await transaction?.carte;
  const codePromo = await transaction?.codePromo;
  const sum = await transaction?.sum;
  const receiverName = await transaction?.receiverName;
  const agence = (await transaction?.agence)?.$id;
  const country = (await transaction?.country)?.$id;
  const sender = (await transaction?.senderAccount)?.$id;
  const manager = (await transaction?.manager)?.$id;
  const discussionId = (await transaction?.discussion)?.$id;
  const status = await transaction?.status;
  return {
    id,
    transactionId,
    updatedAt,
    createdAt,
    receiverName,
    sender,
    manager,
    discussionId,
    status,
    sum,
    codePromo,
    agence,
    carte,
    telephone,
    country,
    managerFile,
    senderFile,
  };
}

export const startTransaction = createAsyncThunk<any, void>(
  "transaction/start",
  async (_, thunkAPI) => {
    return new Promise(async (res, rej) => {
      let transactionId: string = "";
      try {
        transactionId = (await SQuery.service(
          "transaction",
          "start",
          {}
        )) as string;
      } catch (error) {
        rej(thunkAPI.rejectWithValue({ error: "error.message" }));
      }
      if (transactionId) {
        //@ts-ignore
        let objTransaction: initialState = {};

        let transactionData = await createTransaction({
          transactionId,
          thunkAPI,
        });
        const status = transactionData.status as
          | "start"
          | "run"
          | "end"
          | "cancel"
          | "full";
        const transactionIdUpdate = transactionData.transactionId;

        if (!objTransaction[status]) {
          objTransaction[status] = {};
        }
        objTransaction[status][transactionIdUpdate] = transactionData;

        return res(
          thunkAPI.dispatch(
            transactionSlice.actions.fetchTransactionFulfilled([objTransaction])
          )
        );
      } else {
        return rej(thunkAPI.rejectWithValue({ error: "error.message" }));
      }
    });
  }
);

export const updateTransaction = createAsyncThunk<any, updateTransactionSchema>(
  "transaction/update",
  async ({ data }, thunkAPI) => {
    const { transactionId, transacData } = data;
    console.log(
      "🚀 ~ file: transactionSlice.ts:142 ~ transactionId, transacData:",
      transactionId,
      transacData
    );
    await SQuery.service("transaction", "full", {
      id: transactionId,
      sum: transacData.sum,
      codePromo: transacData.codePromo,
      receiverName: transacData.receiverName,
      senderFile: transacData.senderFile,
      country: transacData.country,
      telephone: transacData.telephone,
      carte: transacData.carte,
      agence: transacData.agence,
      typeTransaction: transacData.typeTransaction,
    });
  }
);
export const fetchTransactions = createAsyncThunk<
  initialState[] | { [status: string]: any } | undefined
>("transaction/fetch", async (_, thunkAPI) => {
  console.log("MAGELANNNN");

  try {
    return new Promise(async (resolve, reject) => {
      try {
        const UserId = (thunkAPI.getState() as RootState).auth.user?._id;
        if (!UserId) {
          reject("USER not defined");
        }
        const userInstance = await SQuery.newInstance("user", { id: UserId });
        let transactions = await userInstance?.transactions;
        console.log(
          "🚀 ~ file: transactionSlice.ts:324 ~ returnnewPromise ~ (await transactions.page()).items:",
          (await transactions.page()).items.length
        );

        let promiseTransaction = (await transactions.page()).items.map(
          (transaction: any) => {
            return new Promise(async (res, _) => {
              try {
                res(
                  await createTransaction({
                    transactionId: transaction?._id,
                    thunkAPI,
                  })
                );
              } catch (error) {
                reject(error);
              }
            });
          }
        );

        let transactionArray = (await Promise.allSettled(promiseTransaction))
          .filter((f: any) => !!f?.value)
          .map((p: any) => p.value);

        // @ts-ignore
        const objTransaction: { [status: string]: any } = {};

        transactionArray.forEach((transaction: any) => {
          const status = transaction.status as
            | "start"
            | "run"
            | "end"
            | "cancel"
            | "full";
          const transactionId = transaction.transactionId;
          console.log("🚀 ~ transaction:", transaction);

          if (!objTransaction[status]) {
            objTransaction[status] = {};
          }

          if (!objTransaction[status][transactionId]) {
            objTransaction[status][transactionId] = {};
          }
          objTransaction[status][transactionId] = transaction;
        });

        const Ta = Object.entries(objTransaction).map(
          ([status, transactions]) => ({
            [status]: transactions,
          })
        );

        resolve(Ta);
      } catch (error) {
        reject(error);
      }
    });
  } catch (error: any) {
    thunkAPI.rejectWithValue(error);
  }
});

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: { ...initialState },
  reducers: {
    fetchTransactionFulfilled: (state, action) => {
      const dataTransactions = action.payload as any as initialState[];
      console.log("🚀 ~ dataTransactions:", dataTransactions);

      const [nextState, patches] = produceWithPatches(state, (draftState) => {
        dataTransactions.forEach((transaction) => {
          const status = Object.keys(transaction)[0] as
            | "start"
            | "run"
            | "end"
            | "cancel"
            | "full";

          if (transaction[status]) {
            if (!draftState[status]) {
              draftState[status] = {};
            }

            Object.keys(transaction[status]).forEach((transactionId) => {
              if (!draftState[status][transactionId]) {
                draftState[status][transactionId] =
                  transaction[status][transactionId];
              }
            });
          }
        });

        draftState.fetchLoading = false;
        draftState.fetchSuccess = true;
      });
      // state = applyPatches(state, patches);
      console.log("🚀 ~ patches:", patches);
      return nextState;
    },
    clearTransaction: (state, action) => {
      const { status, transactionId } = action.payload;
      console.log("🚀 ~ file: transactionSlice.ts:351 ~ clearTransaction");

      (
        ["start", "run", "end", "cancel", "full"] as (
          | "start"
          | "run"
          | "end"
          | "cancel"
          | "full"
        )[]
      )
        .filter((f) => f !== status)
        .forEach((st) => {
          if (state[st] && state[st][transactionId]) {
            const updatedState = { ...state[st] };
            delete updatedState[transactionId];
            state[st] = updatedState;
          }
        });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state) => {
      console.log("PENDING");

      state.fetchLoading = true;
      state.fetchSuccess = false;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      const dataTransactions = action.payload as any as initialState[];

      console.log("🚀 ~ dataTransactions:", dataTransactions);
      const [nextState, patches] = produceWithPatches(state, (draftState) => {
        console.log(dataTransactions.length, "TAILLE");

        dataTransactions.forEach((transaction) => {
          const status = Object.keys(transaction)[0] as
            | "start"
            | "run"
            | "end"
            | "cancel"
            | "full";

          if (transaction[status]) {
            if (!draftState[status]) {
              draftState[status] = {};
            }

            Object.keys(transaction[status]).forEach((transactionId) => {
              if (!draftState[status][transactionId]) {
                draftState[status][transactionId] =
                  transaction[status][transactionId];
              }
            });
          }
        });

        draftState.fetchLoading = false;
        draftState.fetchSuccess = true;
      });
      // state = applyPatches(state, patches);
      console.log("🚀 ~ patches:88888", patches, nextState);
      return nextState;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.fetchLoading = false;
      state.fetchSuccess = false;
      console.log("rejected", action);
    });
    builder.addCase(PURGE, () => initialState);
  },
});

export const {} = transactionSlice.actions;

export default transactionSlice.reducer;
