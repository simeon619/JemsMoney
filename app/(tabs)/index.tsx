import { useDrawerProgress } from "@react-navigation/drawer";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { MonoText } from "../../components/StyledText";
import TabBarIndicator from "../../components/TabBarIndicator";
import TabBarItem from "../../components/tabBarItem";
import { View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { moderateScale } from "../../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../../store";
import { fetchCountryAndAgencies } from "../../store/country/countrySlice";
import { fetchCountries } from "../../store/countryAPIslice";
import { fetchEntrepriseSlice } from "../../store/entreprise/entrepriseSlice";
import { fetchManager } from "../../store/manager/managerSlice";
import { setPreferences } from "../../store/preference/preferenceSlice";
import { PURGE_ALL_DATA } from "../_layout";
import Current from "../pageTransaction/Current";
import Finish from "../pageTransaction/Finish";
import New from "../pageTransaction/New";

const Tab = createMaterialTopTabNavigator();
export default function Home() {
  const progress: any = useDrawerProgress();

  const router = useRouter();
  const navigationState = useRootNavigationState();
  const dispatch: AppDispatch = useDispatch();
  const { user, isAuthenticated, account } = useSelector(
    (state: RootState) => state.auth
  );
  let preference = useSelector((state: RootState) => state.preference);

  let country = useSelector((state: RootState) => state.country);

  useEffect(() => {
    Object.keys(country).forEach((key) => {
      if (account?.telephone?.startsWith(country[key].indicatif)) {
        dispatch(
          setPreferences({
            ...preference,
            country: { name: country[key].name, id: country[key].id },
            currency: country[key].currency,
          })
        );
      }
    });
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.05], "clamp");
    return {
      flex: 1,
      transform: [{ scale }],
    };
  }, []);

  useEffect(() => {
    // dispatch(fetchTransactions());
    dispatch(fetchEntrepriseSlice());
    dispatch(fetchCountryAndAgencies());
    dispatch(fetchManager());
    // dispatch(fetchMessages());
    dispatch(fetchCountries());
  }, []);

  useEffect(() => {
    if (!navigationState?.key) return;
    if (!isAuthenticated) {
      router.replace("register/login");
      PURGE_ALL_DATA();
    } else {
      console.log("referesh data");
    }
  }, [isAuthenticated, navigationState?.key]);
  let translateX: any;
  const colorSheme = useColorScheme();
  const { width } = Dimensions.get("window");
  function MyTabBar({
    state,
    descriptors,
    navigation,
    position,
  }: MaterialTopTabBarProps) {
    const { width } = useWindowDimensions();
    const { routes, index } = state;
    const routeNames = routes.map((route) => route);

    const tabWidth = width / routeNames.length;
    // let translateXOut = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
      translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [-tabWidth, 0, tabWidth],
        extrapolate: "clamp",
      });

      return {
        // transform: [{ translateX: translateXOut.value }],
      };
    });
    console.log("🚀 ~ file: index.tsx:105 ~ animatedStyle ~ index:", index);
    translateX?.addListener(({ value }: { value: any }) => {
      console.log("interpolated", value);
      // translateXOut.value = value;
    });
    return (
      <>
        <View style={{ flexDirection: "row" }}>
          {routeNames.map((routeName, idx) => (
            <TabBarItem
              key={routeName.key}
              title={routeName.name}
              isSelected={index === idx}
              onPress={() => navigation.navigate(routeName)}
            />
          ))}
        </View>
        <TabBarIndicator
          tabCount={routeNames.length}
          animatedStyle={animatedStyle}
        />
      </>
    );
  }

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <Tab.Navigator
        // tabBar={(props) => <MyTabBar {...props} />}
        initialRouteName="Nouveau"
        // tabBarPosition="bottom"
        initialLayout={{
          width: Dimensions.get("window").width,
        }}
        backBehavior="order"
        pageMargin={150}
        screenOptions={{
          tabBarActiveTintColor: Colors[colorSheme ?? "light"].text,
          tabBarInactiveTintColor: Colors[colorSheme ?? "light"].text,
          tabBarLabelStyle: { backgroundColor: "#41a" },
          // tabBarStyle: [{}, shadow(10)],
          animationEnabled: true,
          // tabBarGap: 10,
          tabBarIndicatorStyle: {
            backgroundColor: Colors[colorSheme ?? "light"].text,
            borderRadius: 10,
            height: moderateScale(5),
          },
        }}
      >
        <Tab.Screen
          name="Nouveau"
          component={New}
          options={{
            tabBarLabel({ focused, children }) {
              return (
                <View
                  lightColor="#0000"
                  darkColor="#0000"
                  style={[
                    {
                      // flexDirection: "row",
                      // alignSelf: "flex-start",
                      // justifyContent: "flex-start",
                    },
                    // focused && { width: 100 },
                  ]}
                >
                  <MonoText
                    style={{
                      fontSize: moderateScale(15),
                      textTransform: "uppercase",
                      opacity: focused ? 1 : 0.5,
                    }}
                  >
                    {children}
                  </MonoText>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="En cours"
          component={Current}
          options={{
            tabBarLabel({ focused, children }) {
              return (
                <View
                  lightColor="#0000"
                  darkColor="#0000"
                  style={[
                    {
                      // flexDirection: "row",
                      // alignSelf: "flex-start",
                      // justifyContent: "flex-start",
                    },
                    // focused && { width: 100 },
                  ]}
                >
                  <MonoText
                    style={{
                      fontSize: moderateScale(15),
                      textTransform: "uppercase",
                      opacity: focused ? 1 : 0.5,
                    }}
                  >
                    {children}
                  </MonoText>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="Terminer"
          component={Finish}
          options={{
            tabBarLabel({ focused, children }) {
              return (
                <View
                  lightColor="#0000"
                  darkColor="#0000"
                  style={[
                    {
                      // flexDirection: "row",
                      alignSelf: "flex-start",
                      // justifyContent: "flex-start",
                    },
                    // focused && { width: 100 },
                  ]}
                >
                  <MonoText
                    style={{
                      fontSize: moderateScale(15),
                      textTransform: "uppercase",
                      textAlign: "left",
                      opacity: focused ? 1 : 0.5,
                    }}
                  >
                    {children}
                  </MonoText>
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: horizontalScale(5),
  },

  // tabBarText :{fontSize: moderateScale(15),
  //   textTransform: "uppercase",
  //   opacity: focused ? 1 : 0.5,},
  // tabarContain :{}
});
