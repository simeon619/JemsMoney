import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
//@ts-ignore
import { MagicModalPortal } from "react-native-magic-modal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Text } from "../components/Themed";
import { store } from "../store/store";
export { ErrorBoundary } from "expo-router";

export const unstable_settingss = {
  initialRouteName: "(tabs)",
};
let persistor = persistStore(store);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    const purge = async () => {
      await persistor.purge();
    };
    // purge();
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav({ style }: any) {
  const colorScheme = useColorScheme();
  console.log(colorScheme);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <PersistGate
          loading={
            <Text style={[{ fontSize: 60, alignItems: "center" }]}>
              Loading...
            </Text>
            // <SplashScreen />
          }
          persistor={persistor}
        >
          <SafeAreaProvider>
            <MagicModalPortal />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  headerShown: false,
                  animation: "simple_push",
                }}
              />
              <Stack.Screen
                name="messagerie"
                options={{
                  presentation: "modal",
                  // headerShown: true,
                  animation: "simple_push",
                }}
              />
              <Stack.Screen
                name="discussion"
                options={{
                  presentation: "modal",
                  headerShown: false,
                  animation: "simple_push",
                }}
              />
              <Stack.Screen
                name="formTransaction"
                options={{
                  presentation: "modal",
                  headerShown: false,
                  animation: "simple_push",
                }}
              />
            </Stack>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
