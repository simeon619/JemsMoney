//@ts-ignore
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { MonoText } from "../../components/StyledText";
import { ScrollView, Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../../store";
import { updateRate } from "../../store/entreprise/entrepriseSlice";

const ListTaux = () => {
  const { loading, serviceCharge, rates, success } = useSelector(
    (state: RootState) => state.entreprise
  );
  const dispatch: AppDispatch = useDispatch();
  const [rateStart, setRateStart] = useState<string>(String());
  const [rateEnd, setRateEnd] = useState<string>(String());
  const [rateValue, setRateValue] = useState<string>(String());
  const [showAddRate, setShowAddRate] = useState<boolean>(false);
  const [editableFields, setEditableFields] = useState({});

  const toggleShowAddRate = () => {
    setShowAddRate((p) => !p);
  };
  const handleToggleEdit = (key) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [key]: !prevFields[key],
    }));
  };
  const { width } = useWindowDimensions();
  const [copyRate, setCopyRate] = useState({ ...rates });
  const route = useRouter();
  const handleChangeRate = (key: string, value: number) => {
    setCopyRate((prevRates) => ({
      ...prevRates,
      [key]: value,
    }));
    // dispatch(updateRate({ key, value }));
  };

  const handleSaveRates = () => {
    setEditableFields({});
    dispatch(updateRate(copyRate));
  };
  const colorScheme = useColorScheme();

  function addRate(): void {
    let rawValue = parseFloat(rateValue);
    if (rateEnd && rateStart && !isNaN(rawValue)) {
      let keyRate = `${rateStart.toLocaleUpperCase()}to${rateEnd.toLocaleUpperCase()}`;
      setCopyRate((prevRate) => ({ ...prevRate, [keyRate]: rawValue }));
      setEditableFields((prevFields) => ({
        ...prevFields,
        ["show"]: true,
      }));
      toggleShowAddRate();
    }
  }
  function removeRate(keyRate: string): void {
    setCopyRate((prevRate) => {
      const updatedRate = { ...prevRate };
      delete updatedRate[keyRate];
      return updatedRate;
    });
    setEditableFields((prevFields) => ({
      ...prevFields,
      ["show"]: true,
    }));
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: moderateScale(10),
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1, padding: moderateScale(10) }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: verticalScale(10),
            }}
          >
            <FontAwesome
              name="arrow-left"
              size={25}
              color={"#125"}
              onPress={() => {
                route.back();
              }}
            />
            <TouchableOpacity
              onPress={() => {
                toggleShowAddRate();
              }}
            >
              {showAddRate ? (
                <Text
                  style={{
                    marginLeft: 10,
                    color: "green",
                    fontSize: moderateScale(18),
                  }}
                >
                  Annuler
                </Text>
              ) : (
                <Text
                  style={{
                    marginLeft: 10,
                    color: "red",
                    fontSize: moderateScale(18),
                  }}
                >
                  Ajouter
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ overflow: "scroll", alignItems: "center" }}>
            {Object.entries(copyRate).map(([key, value]) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: verticalScale(10),
                  borderBottomColor: "#edd",
                  borderBottomWidth: 3,
                  ...shadow(1),
                }}
              >
                <MonoText
                  style={{ fontSize: moderateScale(18), fontWeight: "500" }}
                >
                  1 {key.substring(0, 3)}:
                </MonoText>
                {editableFields[key] ? (
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <TextInput
                      style={{
                        marginHorizontal: horizontalScale(20),
                        fontSize: moderateScale(18),
                      }}
                      value={value.toString()}
                      autoFocus={true}
                      maxLength={9}
                      keyboardType="numeric"
                      onChangeText={(text) => handleChangeRate(key, text)}
                      onBlur={
                        () => handleToggleEdit(key)
                        // setEditableFields((prevFields) => ({
                        //   ...prevFields,
                        //   [key]: false,
                        // }))
                      }
                    />
                    <MonoText style={{ fontSize: moderateScale(18) }}>
                      {key.substring(5)}
                    </MonoText>
                    <TouchableOpacity
                      style={{ flexDirection: "row", alignSelf: "center" }}
                      onPress={() => handleToggleEdit(key)}
                    >
                      <Text
                        style={{
                          marginLeft: 10,
                          color: "red",
                          fontSize: moderateScale(18),
                        }}
                      >
                        Revenir
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{ flexDirection: "row", gap: horizontalScale(2) }}
                    >
                      <TouchableOpacity
                        style={{ flexDirection: "row", alignSelf: "center" }}
                        onPress={() => handleToggleEdit(key)}
                      >
                        <MonoText
                          style={{
                            fontSize: moderateScale(18),
                            marginHorizontal: horizontalScale(20),
                          }}
                        >
                          {value.toString()}
                        </MonoText>
                      </TouchableOpacity>
                      <MonoText style={{ fontSize: moderateScale(18) }}>
                        {key.substring(5)}
                      </MonoText>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: horizontalScale(5),
                        marginLeft: horizontalScale(5),
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: moderateScale(5),
                        }}
                        onPress={() => handleToggleEdit(key)}
                      >
                        <FontAwesome name="edit" size={24} color={"#42a"} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          padding: moderateScale(5),
                        }}
                        onPress={() => removeRate(key)}
                      >
                        <FontAwesome name="trash" size={24} color={"#a13"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
          {Object.keys(editableFields).length > 0 && (
            <TouchableOpacity
              style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: "lightblue",
                alignItems: "center",
                borderRadius: moderateScale(5),
              }}
              onPress={handleSaveRates}
            >
              <Text
                style={{
                  fontSize: moderateScale(18),
                }}
              >
                Enregistrer
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        {showAddRate && (
          <View
            //   lightColor="#520"
            style={{
              alignSelf: "center",
              position: "absolute",
              borderWidth: 1,
              borderColor: "#ccc",
              bottom: 0,
              right: 0,
              left: 0,
              ...shadow(5),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginVertical: verticalScale(15),
                width: width - horizontalScale(40),
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "500" }}>1</Text>
              <TextInput
                style={{
                  marginHorizontal: 10,
                  fontSize: 18,
                  borderWidth: 1,
                  borderColor: "#ccc8",
                  paddingHorizontal: 10,
                  flex: 1,
                  borderRadius: moderateScale(5),
                }}
                value={rateStart.toLocaleUpperCase()}
                placeholder="RUB"
                autoCapitalize="sentences"
                autoFocus={true}
                maxLength={3}
                keyboardType="default"
                onChangeText={setRateStart}
              />
              <TextInput
                style={{
                  fontSize: 18,
                  borderWidth: 1,
                  borderColor: "#ccc8",
                  paddingHorizontal: 10,
                  flex: 1,
                  borderRadius: moderateScale(5),
                }}
                value={rateValue}
                maxLength={9}
                placeholder="8"
                keyboardType="numeric"
                onChangeText={setRateValue}
              />
              <TextInput
                style={{
                  marginHorizontal: 10,
                  fontSize: 18,
                  borderWidth: 1,
                  borderColor: "#ccc8",
                  paddingHorizontal: 10,
                  borderRadius: moderateScale(5),
                  flex: 1,
                }}
                value={rateEnd.toLocaleUpperCase()}
                placeholder="XOF"
                maxLength={3}
                autoCapitalize="words"
                keyboardType="default"
                onChangeText={setRateEnd}
              />
            </View>
            <View
              style={{
                justifyContent: "space-around",
                flexDirection: "row",
                gap: horizontalScale(5),

                padding: moderateScale(10),
              }}
            >
              <TouchableOpacity onPress={addRate}>
                <MonoText
                  style={{
                    color: Colors[colorScheme ?? "light"].text,
                    fontSize: moderateScale(18),
                  }}
                >
                  Valider
                </MonoText>
              </TouchableOpacity>
              {/* 
                <TouchableOpacity>
                  <Text
                    style={{
                      color: Colors[colorScheme ?? "light"].text,
                    }}
                  >
                    Annuler
                  </Text>
                </TouchableOpacity> */}
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ListTaux;
