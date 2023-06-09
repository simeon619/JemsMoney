import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import SQuery from "../../lib/SQueryClient";

// This is the initial state of the slice
// const initialState: { isAuthenticated: boolean } = {
//   // user: null,
//   isAuthenticated: false,
//   // account: null,
// };
const initialState: {
  user: any;
  isAuthenticated: boolean;
  account: any;
  loading: boolean;
} = {
  user: null,
  isAuthenticated: false,
  account: null,
  loading: false,
};
// const router = useRouter();
export const logManager = createAsyncThunk(
  "auth/fetch",
  async (data: { telephone: string; password: string }, thunkAPI) => {
    try {
      const { telephone, password } = data;
      return new Promise((resolve: any, reject) => {
        SQuery.emit(
          "login:manager",
          { telephone, password },
          async (res: any) => {
            if (res.error) {
              console.log(JSON.stringify(res));
              return reject(thunkAPI.rejectWithValue({ error: res.error }));
            }
            let account = null;
            try {
              let model = await SQuery.model("account");
              account = await model.newInstance({
                id: res.response?.login.id,
              });
            } catch (error) {
              return thunkAPI.rejectWithValue({ error });
            }
            if (account) {
              return resolve({
                account: account.$cache,
                user: (await account.newParentInstance())?.$cache,
              });
            }
            reject(thunkAPI.rejectWithValue({ error: res.error }));
          }
        );
      });
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const handleAsyncAction = (
  builder: ActionReducerMapBuilder<{
    user: any;
    isAuthenticated: boolean;
    account: any;
    loading: boolean;
  }>,
  asyncAction: any
) => {
  builder.addCase(asyncAction.pending, (state) => {
    state.loading = true;
    state.isAuthenticated = false;
    console.log("pending:asyncAction");
  });
  builder.addCase(asyncAction.fulfilled, (state, action) => {
    state.isAuthenticated = true;
    state.loading = false;
    state.account = (action.payload as any)?.account;
    state.user = (action.payload as any)?.user;
    console.log("fulfilled:asyncAction", state);
  });
  builder.addCase(asyncAction.rejected, (state) => {
    state.isAuthenticated = false;
    state.loading = false;
    console.log("rejected:asyncAction");
  });
};

export const authSlice = createSlice({
  name: "auth",
  initialState: { ...initialState },
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncAction(builder, logManager);
    // handleAsyncAction(builder, createManager);
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
