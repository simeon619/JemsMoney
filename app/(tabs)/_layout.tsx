import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { Image } from "expo-image";
import { Link, useNavigation } from "expo-router";
import { Pressable, useColorScheme, useWindowDimensions } from "react-native";
import Home from ".";
import { MonoText } from "../../components/StyledText";
import { View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import EventScreen from "./event";
import PreferenceScreen from "./preference";
import TabTwoScreen from "./two";

export function DrawerItemIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const colorScheme = useColorScheme();
  const { height, width } = useWindowDimensions();
  return (
    <View lightColor="#0a1845" darkColor="#0a1845" style={{ flex: 1 }}>
      <DrawerContentScrollView
        style={{ margin: horizontalScale(20), height }}
        {...props}
      >
        <Image
          style={{
            width: horizontalScale(65),
            marginBottom: horizontalScale(15),
            aspectRatio: 1,
            alignSelf: "flex-start",
            marginLeft: horizontalScale(10),
          }}
          source={require("../../assets/images/user.png")}
        />
        <MonoText
          numberOfLines={3}
          ellipsizeMode="tail"
          lightColor="#eee"
          darkColor="#eee"
          style={{
            fontSize: moderateScale(35),
            textAlign: "left",
            marginLeft: horizontalScale(10),
          }}
        >
          Joyca Mitchel
        </MonoText>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <MonoText
        lightColor="#eee"
        style={{
          position: "absolute",
          bottom: 40,
          left: horizontalScale(20),
          fontSize: moderateScale(20),
        }}
      >
        1RUB = 7.8XOF
      </MonoText>
    </View>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  /*   navigation.
  const handleShowModal = (show : boolean) => {
    navigation.navigate('index', { showModal: show });
  }; */
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => {
        return <CustomDrawerContent {...props} />;
      }}
      initialRouteName="index"
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme ?? "light"].textDrawer,
        drawerInactiveTintColor: Colors[colorScheme ?? "light"].textGray,
        // headerTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Drawer.Screen
        name="index"
        component={Home}
        options={{
          title: "Home",
          drawerIcon: ({ color }) => (
            <DrawerItemIcon name="home" color={color} />
          ),
          drawerItemStyle: { marginTop: verticalScale(35) },
          headerRight: () => (
            <View darkColor="#0001" style={{ flexDirection: "row", gap: 15 }}>
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="search"
                      size={22}
                      color={Colors[colorScheme ?? "light"].iconGrey}
                      style={{ marginRight: 5, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
              <Link
                href={{ pathname: "/messagerie", params: { showModal: true } }}
                asChild
              >
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="comments"
                      size={26}
                      color={Colors[colorScheme ?? "light"].iconGrey}
                      style={{ marginRight: 20, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="two"
        component={TabTwoScreen}
        options={{
          title: "Statistics",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <DrawerItemIcon name="exchange" color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="arrow-left"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="event"
        component={EventScreen}
        options={{
          title: "Events",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <DrawerItemIcon name="gamepad" color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="arrow-left"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="preference"
        component={PreferenceScreen}
        options={{
          title: "Preferences",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <DrawerItemIcon name="stethoscope" color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="arrow-left"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
