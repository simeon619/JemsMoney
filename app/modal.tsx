import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import FilterSearch from "../components/FilterSearch";
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import { horizontalScale, verticalScale } from "../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../store";
import { fetchContacts } from "../store/contact/fetchhContact";

export type ContactShema = {
  id: string;
  name: string;
  phoneNumbers: { number: string }[];
};
export default function ModalScreen() {
  // const [listContact, setListContact] = useState<ContactShema[]>([]);
  const { height, width } = useWindowDimensions();
  const [value, onChangeText] = useState("");
  const colorScheme = useColorScheme();
  let router = useRouter();
  let dispatch: AppDispatch = useDispatch();
  let listContact = useSelector((state: RootState) => state.contact);
  const [showFiltered, setShowFilterd] = useState<boolean>(false);
  useEffect(() => {
    fetchContacts(listContact, dispatch);
  }, []);

  // console.log(contactFind.phoneNumbers[0].number, "dagobert");

  return (
    <SafeAreaView style={styles.container}>
      {showFiltered ? (
        <View
          style={{
            width,
            backgroundColor: Colors[colorScheme ?? "light"].primaryColour,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="arrow-left"
                color={"#ddda"}
                size={28}
                style={{
                  marginLeft: horizontalScale(10),
                  opacity: pressed ? 0.5 : 1,
                }}
              />
            )}
          </Pressable>

          <TextInput
            editable
            autoFocus={true}
            keyboardType={"numbers-and-punctuation"}
            placeholder="Search contact"
            placeholderTextColor={"#ddda"}
            onChangeText={(text) => onChangeText(text)}
            value={value}
            style={{
              paddingLeft: horizontalScale(5),
              paddingVertical: verticalScale(10),
              fontSize: 20,
              color: "#ddda",
              width: width - horizontalScale(80),
            }}
          />
          <Pressable
            onPress={() => {
              setShowFilterd((p) => !p);
            }}
          >
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="filter"
                size={28}
                color={"#ddda"}
                style={{
                  opacity: pressed ? 0.5 : 1,
                }}
              />
            )}
          </Pressable>
        </View>
      ) : null}
      <FilterSearch
        setShowFilterd={setShowFilterd}
        showFiltered={showFiltered}
      />
      {/* <FlatList
        data={contactFind}
        // data={[
        //   { id: "1", name: "olopmip", phoneNumbers: [{ number: "445888888" }] },
        // ]}
        style={{ backgroundColor: "#fff" }}
        ListFooterComponent={
          <View style={{ height: verticalScale(80), width }} />
        }
        // keyboardShouldPersistTaps={true}
        // scrollToOverflowEnabled={true}
        ListHeaderComponent={
          <View style={{ height: verticalScale(5), width }}>
            <Text>Contact </Text>
          </View>
        }
        keyExtractor={(item, index) => item.id}
        renderItem={({ item }) => (
          <ContactItem
            id={item.id}
            name={item.name}
            phoneNumbers={item.phoneNumbers}
          />
        )}
      /> */}
      <StatusBar
        style="light"
        backgroundColor={Colors[colorScheme ?? "light"].primaryColour}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
