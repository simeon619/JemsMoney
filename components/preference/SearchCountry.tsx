import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";
import { ScrollView, View } from "../Themed";

import { RootState } from "../../store";
// import countryAPI from "../../store/country.json";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { MonoText } from "../StyledText";

export const SearchCountry = ({
  modalVisible,
  closeModal,
}: {
  modalVisible: boolean;
  closeModal: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  let {
    data: countryAPI,
    error,
    loading,
  } = useSelector((state: RootState) => state.countriesAPISlice);

  // const [searchPerformed, setSearchPerformed] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) {
      return []; // Retourne une liste vide si aucune recherche n'a été effectuée
    }

    const filtered = countryAPI?.filter((country) => {
      const searchTermLower = searchTerm.toLowerCase();
      const countryNameLower = country.name.common.toLowerCase();
      const translationFraLower = country.translations.fra.common.toLowerCase();

      return (
        countryNameLower.includes(searchTermLower) ||
        translationFraLower.includes(searchTermLower)
      );
    });

    return filtered?.slice(0, 6);
  }, [countryAPI, searchTerm]);

  const router = useRouter();

  const handleClearSearch = () => {
    setSearchTerm("");
    if (!!!searchTerm) {
      closeModal();
    }
  };

  const handleBackdropPress = () => {
    // closeModal();
  };
  const handleModalPress = () => {
    // Do Nothing
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="none"
      transparent={true}
      onRequestClose={closeModal}
    >
      <Toast />
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(01, 0, 40, 0.3)",
          }}
        >
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{
                position: "absolute",
                left: horizontalScale(5),
                right: horizontalScale(5),
                top: verticalScale(10),
                padding: moderateScale(10),
                borderRadius: 10,
                // backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <TextInput
                  placeholder="Rechercher pays par nom (fr/eng)"
                  value={searchTerm}
                  // focusable={true}
                  maxLength={8}
                  autoFocus={true}
                  onChangeText={(text) => setSearchTerm(text)}
                  style={{
                    fontSize: moderateScale(16),
                  }}
                />
                <FontAwesome
                  name="remove"
                  size={22}
                  style={{ padding: moderateScale(10) }}
                  color={"#d24"}
                  onPress={handleClearSearch}
                />
              </View>
              {filteredCountries?.map((country, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: moderateScale(10),
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                  }}
                  onPress={() => {
                    let r = {
                      name: country.translations.fra.common,
                      icon: country.flags.svg.replace(/\//g, "*"),
                      currency: Object.keys(country.currencies)[0],
                    };

                    closeModal();
                    router.push({
                      pathname: "preference/AddCountry",
                      params: {
                        name: country.translations.fra.common,
                        icon: country.flags.svg.replace(/\//g, "*"),
                        currency: Object.keys(country.currencies)[0],
                      },
                    });
                  }}
                >
                  <Image
                    source={{ uri: country.flags.svg }}
                    style={{
                      width: horizontalScale(35),
                      aspectRatio: 2,
                      marginRight: 5,
                    }}
                  />
                  <View>
                    <MonoText style={{ fontSize: 16, fontWeight: "bold" }}>
                      {country.translations.fra.common || country.name.common}
                    </MonoText>

                    <MonoText
                      style={{ fontSize: 14, marginTop: 2 }}
                      numberOfLines={2}
                    >
                      Devise: {Object.keys(country?.currencies)[0]} -{" "}
                      {
                        country?.currencies[Object.keys(country.currencies)[0]]
                          ?.name
                      }
                    </MonoText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
