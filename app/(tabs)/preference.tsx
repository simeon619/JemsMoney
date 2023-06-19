import { FontAwesome5 } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { MonoText } from "../../components/StyledText";
import { ScrollView, View } from "../../components/Themed";

import { SearchCountry } from "../../components/preference/SearchCountry";
import { SetFee } from "../../components/preference/setFee";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { RootState } from "../../store";
import { setPreferences } from "../../store/preference/preferenceSlice";
const SECTIONS = [
  {
    header: "Profile Admin",
    items: [
      { id: "name", icon: "user", label: "name", type: "select" },
      {
        id: "password",
        icon: "lock",
        label: "mot de passe",
        type: "select",
      },

      // { id: "phone", icon: "phone", label: "phone", type: "select" },
    ],
  },
  {
    header: "Preferences Entreprise",
    items: [
      {
        id: "taux",
        icon: "money-bill-wave",
        label: "Taux de changes",
        type: "modal-input",
      },
      {
        id: "manager",
        icon: "users-cog",
        label: "Gestion manager",
        type: "modal-input",
      },
      {
        id: "fee",
        icon: "percent",
        label: "modifier frais",
        type: "modal-input",
      },
    ],
  },
  {
    header: "Preferences Pays",
    items: [
      {
        id: "Ccountry",
        icon: "flag",
        label: "Add pays",
        type: "modal-input",
      },
      {
        id: "RUDcountry",
        icon: "flag",
        label: "Modifier/Supprimer pays",
        type: "modal-input",
      },
    ],
  },
  {
    header: "Preferences Application",
    items: [
      { id: "language", icon: "globe", label: "Language", type: "select" },
      { id: "darkMode", icon: "moon", label: "Dark Mode", type: "toggle" },
    ],
  },

  {
    header: "Help",
    items: [{ id: "bug", icon: "bug", label: "Report Bug", type: "link" }],
  },
];

const PreferenceScreen = () => {
  const dispatch = useDispatch();
  let preference = useSelector((state: RootState) => state.preference);
  useSelector((state: RootState) => state.entreprise.rates);

  let route = useRouter();
  const [modalVisibleCountry, setModalVisibleCountry] = useState(false);

  const toggleModalCountry = () => {
    setModalVisibleCountry((p) => !p);
  };

  const [modalVisibleFee, setModalVisibleFee] = useState(false);

  const toggleModalFee = () => {
    setModalVisibleFee((p) => !p);
  };
  const { loading, serviceCharge, rates, success } = useSelector(
    (state: RootState) => state.entreprise
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(5),
          // marginLeft: horizontalScale(18),
        }}
      >
        <SearchCountry
          closeModal={toggleModalCountry}
          modalVisible={modalVisibleCountry}
        />
        <SetFee closeModal={toggleModalFee} modalVisible={modalVisibleFee} />
        {/* <CountryModal closeModal={closeModal} modalVisible={modalVisible} /> */}
        <Pressable
          onPress={() => {
            route.back();
          }}
        >
          {({ pressed }) => (
            <FontAwesome5
              name="arrow-left"
              color={"#444b"}
              size={26}
              style={{
                opacity: pressed ? 0.5 : 1,
                paddingHorizontal: moderateScale(10),
              }}
            />
          )}
        </Pressable>
        <MonoText style={{ fontSize: moderateScale(25) }}>Preferences</MonoText>
      </View>
      <ScrollView>
        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <MonoText style={styles.sectionHeaderText}>{header}</MonoText>
            </View>
            <View style={styles.sectionBody}>
              {items.map(
                (
                  {
                    id,
                    label,
                    icon,
                    type,
                  }: { id: string; label: string; icon: string; type: string },
                  index
                ) => {
                  return (
                    <View
                      key={id}
                      style={[
                        styles.rowWrapper,
                        index === 0 && { borderTopWidth: 0 },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (id === "Ccountry") {
                            toggleModalCountry();
                          }
                          if (id === "manager") {
                            route.push("preference/SetManager");
                          }
                          if (id === "RUDcountry") {
                            route.push("preference/ListCountry");
                          }
                          if (id === "taux") {
                            route.push("preference/ListTaux");
                          }
                          if (id === "fee") {
                            toggleModalFee();
                          }
                        }}
                      >
                        <View style={styles.row}>
                          <FontAwesome5
                            color="#616161"
                            name={icon}
                            style={styles.rowIcon}
                            size={18}
                          />

                          <MonoText style={styles.rowLabel}>{label}</MonoText>

                          <View style={styles.rowSpacer} />

                          {type === "select" && (
                            <MonoText
                              ellipsizeMode="tail"
                              numberOfLines={1}
                              style={styles.rowValue}
                            >
                              {id === "Ccountry"
                                ? preference[id]?.name
                                : //@ts-ignore
                                  preference[id]}
                            </MonoText>
                          )}

                          {type === "toggle" && (
                            <Switch
                              thumbColor={"#426"}
                              onChange={(val) => {
                                dispatch(
                                  setPreferences({
                                    ...preference,
                                    [id]: val.nativeEvent.value,
                                  })
                                );
                              }}
                              //@ts-ignore
                              value={preference[id]}
                            />
                          )}
                          {type === "modal-input" && (
                            <FontAwesome5
                              color="#ababab"
                              name="plus-circle"
                              size={20}
                            />
                          )}
                          {(type === "select" || type === "link") && (
                            <FontAwesome5
                              color="#ababab"
                              name="chevron-right"
                              size={20}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        ))}
        <MonoText
          style={{
            marginTop: verticalScale(25),
            textAlign: "center",
            textDecorationLine: "underline",
            fontSize: moderateScale(15),
          }}
        >
          @JemsMoney
        </MonoText>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PreferenceScreen;
const styles = StyleSheet.create({
  section: {
    paddingTop: 12,
  },

  button: {
    fontSize: 18,
    color: "blue",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    fontSize: 16,
    color: "blue",
    alignSelf: "flex-end",
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: moderateScale(15),
    fontWeight: "900",

    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionBody: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",

    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  profile: {
    // padding: 16,
    flexDirection: "column",
    alignItems: "center",
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: "#e3e3e3",
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "400",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 24,
    paddingVertical: verticalScale(10),
  },
  rowWrapper: {
    paddingLeft: 24,

    borderTopWidth: 1,
    borderColor: "#e3e3e3",
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: moderateScale(16),
    fontWeight: "500",
    color: "#000",
  },
  rowValue: {
    fontSize: moderateScale(16),
    color: "#616161",
    width: horizontalScale(120),
    marginRight: 4,
    justifyContent: "flex-end",
    // alignSelf: "flex-end",
  },
  rowSpacer: {
    flexGrow: 1,
    flexBasis: 0,
  },
});
