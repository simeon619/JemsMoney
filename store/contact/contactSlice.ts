import { createSlice } from "@reduxjs/toolkit";
import { ContactShema } from "../../app/modal";

// This is the initial state of the slice
let initialState: ContactShema[] = [];

export const contactSlice = createSlice({
  name: "contact", // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    addContact: (state, action) => {
      // This is the reducer function for the deposit action
      console.log("inPayload", action.payload);

      return (state = state.concat(...action.payload));
    },
  },
});

// Action creators are generated for each case reducer function
export const { addContact } = contactSlice.actions;

// We export the reducer function so that it can be added to the store
export default contactSlice.reducer;
