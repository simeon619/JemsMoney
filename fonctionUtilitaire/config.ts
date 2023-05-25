import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import SQuery from "../lib/SQueryClient";

export const firebaseConfig = {
  apiKey: "AIzaSyAR3dx8gAub0iBixj3IM7s3sfJTBNAvPB0",
  authDomain: "skypark-71cb9.firebaseapp.com",
  projectId: "skypark-71cb9",
  storageBucket: "skypark-71cb9.appspot.com",
  messagingSenderId: "725250095088",
  appId: "1:725250095088:web:f54be47cc425b89ac8cf35",
  measurementId: "G-TSCNKKQH8K",
};

if (!firebase.app.length) {
  firebase.initializeApp(firebaseConfig);
}

export const persistanceSquery = () => {
  SQuery.dataStore = {
    useStore: false,
    updateTimeOut: 500,
    setData: async (key, data) => {
      try {
        AsyncStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    },
    getData: async (key) => {
      try {
        return JSON.parse((await AsyncStorage.getItem(key)) || "");
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  };
};
