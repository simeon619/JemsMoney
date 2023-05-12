import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  purgeStoredState,
} from "redux-persist";
import contactSlice from "./contact/contactSlice";
// https://www.notjust.dev/blog/2022-12-24-react-native-redux-toolkit
// https://github.com/rt2zz/redux-persist
// const persistConfigA = {
//   key: 'reducerA',
//   storage: AsyncStorage,
// };

const persistConfigContact = {
  key: "contact",
  storage: AsyncStorage,
  timeout: 10000, // 10 seconds
};
export function purgeContact() {
  purgeStoredState(persistConfigContact);
}
const rootReducer = combineReducers({
  contact: contactSlice,
});

const persistedReducer = persistReducer(persistConfigContact, rootReducer);
export const store = configureStore({
  reducer: {
    contact: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 550,
      },
      immutableCheck: { warnAfter: 550 },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
