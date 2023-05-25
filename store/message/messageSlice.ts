import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import SQuery from "../../lib/SQueryClient";
export type MessageSchema = {
  text: string;
  right: boolean;
  date: any;
  files: string[];
  messageId: string;
};

const initialState: {
  [DiscussionId: string]: {
    messages: MessageSchema[];
    loading: boolean;
    success: boolean;
  };
} = { "": { messages: [], loading: false, success: false } };
const createMessage = async (id: string, accountId: any) => {
  return new Promise(async (res) => {
    let messageModel = await SQuery.model("message");
    let messageInstance = await messageModel.newInstance({
      id,
    });
    console.log({ messageInstance: await messageInstance?.account });

    if (messageInstance) {
      let messageText = await messageInstance.text;
      let messageFile = await messageInstance.files;
      let messageId = await messageInstance._id;
      let date = await messageInstance.createdAt;
      let right = accountId === (await messageInstance.account).$id;
      res({ text: messageText, right, date, messageId, files: messageFile });
    }
  });
};
export const fetchMessages = createAsyncThunk(
  "message/fetch",
  async (data: { discussionId: string }, thunkAPI) => {
    // console.log({ data });
    const { discussionId } = data;
    const accountId = (thunkAPI.getState() as RootState).auth.account._id;
    return new Promise(async (resolve: any, reject) => {
      const discussionModel = await SQuery.model("discussion");
      const discussionInstance = await discussionModel.newInstance({
        id: discussionId,
      });

      if (discussionInstance) {
        (await discussionInstance.messages).when(
          "update",
          async (data: any) => {
            if (data.added[0]) {
              thunkAPI.dispatch(
                messageSlice.actions.fetchMessagesFulfilled({
                  messages: [await createMessage(data.added[0], accountId)],
                  discussionId,
                })
              );
            }
          }
        );
        let arrayMessagePromise = (
          await (await discussionInstance.messages).page()
        ).items.map((message: any) => {
          return new Promise(async (res, rej) => {
            res(await createMessage(message._id, accountId));
          });
        });
        let messages = (await Promise.allSettled(arrayMessagePromise))
          .filter((f: any) => !!f?.value)
          .map((p: any) => p.value);
        if (!(messages.length === 0)) {
          // console.log({ messages }, "***656559****");

          return resolve({
            messages,
            discussionId,
          });
        }

        return reject(
          thunkAPI.rejectWithValue({ error: "error.message", discussionId })
        );
      } else {
        return thunkAPI.rejectWithValue({
          error: "error.message",
          discussionId,
        });
      }
    });
  }
);

export const addMessage = createAsyncThunk(
  "message/add",
  async (
    data: {
      messageText?: string;
      discussionId: string;
      messageFile?: any;
    },
    thunkAPI
  ) => {
    const { discussionId, messageFile, messageText } = data;
    const accountId = (thunkAPI.getState() as RootState).auth.account._id;
    const discussionModel = await SQuery.model("discussion");
    const discussionInstance = await discussionModel.newInstance({
      id: discussionId,
    });
    if (discussionInstance && discussionInstance.messages) {
      discussionInstance.messages = {
        addNew: [
          {
            account: accountId,
            text: messageText ? messageText : undefined,
            files: messageFile ? messageFile : undefined,
          },
        ],
      };
    }
  }
);

export const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    fetchMessagesFulfilled: (state, action) => {
      console.log(action.payload as any, "55");
      if (!!!(action.payload as any)) {
        return;
      }
      const { messages, discussionId } = action.payload as any;
      if (messages)
        state[discussionId].messages =
          state[discussionId].messages.concat(messages);
      state[discussionId].loading = false;
      state[discussionId].success = true;

      console.log("fulfilled", state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      // console.log(action.payload as any, "7223");
      if (!(action.payload as any)) {
        return;
      }
      const { messages, discussionId } = action.payload as any;
      console.log("fulfilled1", { messages, discussionId });
      if (messages && discussionId) {
        if (!!!state[discussionId]?.messages) {
          state[discussionId] = {
            messages: [],
            loading: false,
            success: false,
          };
        }
        state[discussionId].messages =
          state[discussionId].messages.concat(messages);
        state[discussionId].loading = false;
        state[discussionId].success = true;
      }

      console.log("fulfilled", state);
    });
    builder.addCase(fetchMessages.pending, (state, action) => {
      console.log(action.payload as any, "pending54");

      if (!!!(action.payload as any)) {
        return;
      }
      const { discussionId } = action.payload as any;
      if (!state[discussionId]?.messages) {
        state[discussionId] = {
          messages: [],
          loading: false,
          success: false,
        };
      }
      console.log("pending5622e", state);
      state[discussionId].loading = true;
      state[discussionId].success = false;
      console.log("pending5555", state);
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      console.log(action.payload as any, "874");
      if (!!!(action.payload as any)) {
        return;
      }
      const { discussionId } = action.payload as any;
      console.log(!!state[discussionId]?.messages, "77");
      if (!state[discussionId]?.messages) {
        state[discussionId] = {
          messages: [],
          loading: false,
          success: false,
        };
        console.log({ state });
      }
      state[discussionId].loading = false;
      state[discussionId].success = false;
      console.log("rejected", state);
    });
  },
});
export const {} = messageSlice.actions;

export default messageSlice.reducer;
