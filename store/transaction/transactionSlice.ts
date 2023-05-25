import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { RootState } from "..";
import SQuery from "../../lib/SQueryClient";
type accountSchema = {
  name: string;
  telephone: string;
  profilePicture: string;
} | null;

export type transactionDataShema = {
  sender: accountSchema;
  manager: accountSchema;
  discussionId: string;
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
type TransactionShema = {
  [TransactionId: string]: transactionDataShema;
};
type initialState = {
  start: TransactionShema;
  full: TransactionShema;
  run: TransactionShema;
  end: TransactionShema;
  cancel: TransactionShema;
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
async function createTransaction({ transactionId }: { transactionId: string }) {
  const transaction = await SQuery.newInstance("transaction", {
    id: transactionId,
  });
  console.log(
    "🚀 ~ file: transactionSlice.ts:63 ~ createTransaction ~ transactionId:",
    transactionId
  );
  transaction?.when("refresh", (obj) => {
    console.log(
      "🚀 ~ file: transactionSlice.ts:68 ~ transaction?.when ~ obj:",
      obj
    );
  });

  transaction?.when("refresh:status", (obj) => {
    console.log(
      "🚀 ~ file: transactionSlice.ts:72 ~ transaction?.when ~ obj:",
      obj
    );
  });
  const senderFile = (await transaction?.senderFile)[0];
  const managerFile = (await transaction?.managerFile)[0];
  const country = (await transaction?.country)?.$id;
  const updatedAt = await transaction?.updatedAt;
  const createdAt = await transaction?.createdAt;
  const telephone = await transaction?.telephone;
  const carte = await transaction?.carte;
  const agence = (await transaction?.agence)?.$id;
  const codePromo = await transaction?.codePromo;
  const sum = await transaction?.sum;
  const receiverName = await transaction?.receiverName;
  const sender = (await transaction?.senderAccount)?.$id;
  const manager = (await transaction?.manager)?.$id;
  const discussionId = (await transaction?.discussion)?.$id;
  const status = await transaction?.status;
  console.log({ sender });
  return {
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
      console.log(
        "🚀 ~ file: transactionSlice.ts:118 ~ transactionId:",
        transactionId
      );
      if (transactionId) {
        console.log(
          "🚀 ~ file: transactionSlice.ts:118 ~ transactionId:",
          transactionId
        );
        //@ts-ignore
        let objTransaction: initialState = {};

        let transactionData = await createTransaction({ transactionId });
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
export const fetchTransactions = createAsyncThunk<initialState[] | undefined>(
  "transaction/fetch",
  async (_, thunkAPI) => {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const UserId = (thunkAPI.getState() as RootState).auth.user._id;
          const userInstance = await SQuery.newInstance("user", { id: UserId });
          let transactions = await userInstance?.transactions;

          let promiseTransaction = (await transactions.page()).items.map(
            (transaction: any) => {
              return new Promise(async (res, _) => {
                try {
                  res(
                    await createTransaction({ transactionId: transaction._id })
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
          let objTransaction: initialState = {};
          let Ta = transactionArray.map((transaction: any) => {
            const status = transaction.status as
              | "start"
              | "run"
              | "end"
              | "cancel"
              | "full";
            const transactionId = transaction.transactionId;

            if (!objTransaction[status]) {
              objTransaction[status] = {};
            }
            objTransaction[status][transactionId] = transaction;
            return objTransaction;
          });

          // console.log(Ta);
          resolve(Ta);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error: any) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: { ...initialState },
  reducers: {
    fetchTransactionFulfilled: (state, action) => {
      const dataTransactions = action.payload as any as initialState[];
      console.log(
        "🚀 ~ file: transactionSlice.ts:239 ~ action.payload:",
        action.payload
      );
      dataTransactions.forEach((transaction) => {
        const status = Object.keys(transaction)[0] as
          | "start"
          | "run"
          | "end"
          | "cancel"
          | "full";
        if (transaction[status]) {
          const transactionId = Object.keys(transaction[status])[0];

          if (!state[status]) {
            state[status] = {};
          }
          if (!state[status][transactionId]) {
            state[status][transactionId] = transaction[status][transactionId];
          }
        }
      });
      state.fetchLoading = false;
      state.fetchSuccess = true;
      console.log("fulfilled", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state) => {
      state.fetchLoading = true;
      state.fetchSuccess = false;

      console.log("pending", state);
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      const dataTransactions = action.payload as any as initialState[];
      dataTransactions.forEach((transaction) => {
        const status = Object.keys(transaction)[0] as
          | "start"
          | "run"
          | "end"
          | "cancel"
          | "full";
        if (transaction[status]) {
          const transactionId = Object.keys(transaction[status])[0];

          if (!state[status]) {
            state[status] = {};
          }
          if (!state[status][transactionId]) {
            state[status][transactionId] = transaction[status][transactionId];
          }
        }
      });
      state.fetchLoading = false;
      state.fetchSuccess = true;
      console.log("fulfilled", action.payload);
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
