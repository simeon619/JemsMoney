import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { Link } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Home from ".";
import { View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import TabTwoScreen from "./two";

function DrawerItemIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const colorScheme = useColorScheme();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={
          () => {}
          // props.navigation.dispatch(props.navigation.closeDrawer())
        }
        icon={({ color }) => (
          <DrawerItemIcon name="camera-retro" color={color} />
        )}
        activeTintColor={Colors[colorScheme ?? "light"].tint}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  return (
    <Drawer.Navigator
      // useLegacyImplementation={true}
      initialRouteName="index"
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
        drawerInactiveTintColor: Colors[colorScheme ?? "light"].text,
        headerTintColor: Colors[colorScheme ?? "light"].tint,
      }}
      drawerContent={(props: any) => {
        return <CustomDrawerContent {...props} />;
      }}
    >
      <Drawer.Screen
        name="index"
        component={Home}
        options={{
          title: "",
          drawerIcon: ({ color }) => (
            <DrawerItemIcon name="home" color={color} />
          ),
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
              <Link href="/messagerie" asChild>
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
          title: "Analytics",
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
    </Drawer.Navigator>
  );
}
