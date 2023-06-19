import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { MonoText } from "../../components/StyledText";
import { View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../../store";
import { Agency, updateCountry } from "../../store/country/countrySlice";
type schemaCountry = {
  agency: Agency[];
  id: string;
  name: string;
  icon: string;
  charge: number;
  currency: string;
  indicatif: string;
  digit: string;
};

const SetCountry = () => {
  const dispatch: AppDispatch = useDispatch();
  let country = useSelector((state: RootState) => state.country);
  const colorScheme = useColorScheme();
  const params = useSearchParams() as any as schemaCountry;
  let route = useRouter();
  const [indicatif, setIndicatif] = useState<string>(params.indicatif);
  const [digit, setDigit] = useState<string>(params.digit);
  const [charge, setCharge] = useState<string>(String(params.charge));

  function verifyAndNext(): void {
    console.log("io");

    if (!(indicatif?.startsWith("+") && indicatif.length <= 4)) {
      Toast.show({
        text1: "Error indicatif",
        text2: indicatif,
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }

    if (!(!!digit && digit?.length <= 3)) {
      Toast.show({
        text1: "Error digit",
        text2: digit,
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }
    if (!!!charge) {
      Toast.show({
        text1: "charge digit",
        text2: digit,
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }

    let data = {
      id: params.id,
      digit,
      indicatif,
      charge,
    };

    console.log(data);
    dispatch(
      updateCountry({ id: params.id, charge: +charge, digit, indicatif })
    );
    route.back();
    return;
    //@ts-ignore
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: moderateScale(10) }}>
      <MonoText
        style={[
          {
            fontSize: moderateScale(18),
            padding: moderateScale(5),
            backgroundColor: Colors[colorScheme ?? "light"].primaryColour,
            borderRadius: moderateScale(5),
            color: Colors[colorScheme ?? "light"].textOverlay,
            alignSelf: "flex-start",
          },
          shadow(3),
        ]}
      >
        PAYS
      </MonoText>
      <View lightColor="#f6f7fb">
        <MonoText
          lightColor="#b2c5ca"
          style={{ fontSize: moderateScale(17), fontWeight: "500" }}
        >
          Pays Selectionner
        </MonoText>
        <View
          lightColor="#f6f7fb"
          style={[
            {
              flexDirection: "row",
              margin: verticalScale(8),
              borderRadius: 10,
              borderWidth: 0.4,
              borderColor: "#0001",
            },
            // shadow(1),
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              // magicModal.show(() => <ResponseModal />);
            }}
            style={{
              flex: 2.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: params?.icon.replace(/\*/g, "/") }}
              style={{
                width: horizontalScale(32),
                aspectRatio: 2,
                // marginRight: 5,
              }}
            />
          </TouchableOpacity>
          <MonoText
            style={{
              flex: 10,
              paddingHorizontal: horizontalScale(5),
              paddingVertical: verticalScale(8),
              fontSize: moderateScale(16),
              fontWeight: "500",
            }}
          >
            {params.name}
            {"-"}
            <MonoText
              style={{
                fontSize: moderateScale(16),
                paddingLeft: horizontalScale(10),
                fontWeight: "900",
                color: Colors[colorScheme ?? "light"].secondaryColour,
              }}
            >
              {params.currency}{" "}
            </MonoText>
          </MonoText>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: horizontalScale(10),
        }}
      >
        <View lightColor="#f6f7fb" style={{ flex: 1 }}>
          <MonoText
            lightColor="#b2c5ca"
            style={{
              fontSize: moderateScale(16),
              fontWeight: "500",
            }}
          >
            Indicatif
          </MonoText>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
            ]}
          >
            <View
              style={{
                // flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="old-mobile"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </View>
            <TextInput
              // maxLength={10}
              value={indicatif}
              onChangeText={setIndicatif}
              placeholderTextColor={Colors[colorScheme ?? "light"].textGray}
              keyboardType="phone-pad"
              placeholder="+201"
              // pas
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorScheme ?? "light"].text,
                fontSize: moderateScale(20),
                fontWeight: "500",
              }}
            />
          </View>
        </View>
        <View lightColor="#f6f7fb" style={{ flex: 1 }}>
          <MonoText
            lightColor="#b2c5ca"
            style={{
              fontSize: moderateScale(16),
              fontWeight: "500",
            }}
          >
            Digits
          </MonoText>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
            ]}
          >
            <View
              style={{
                // flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="app-store"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </View>
            <TextInput
              maxLength={4}
              value={digit}
              onChangeText={setDigit}
              placeholderTextColor={Colors[colorScheme ?? "light"].textGray}
              keyboardType="phone-pad"
              placeholder="10"
              // pas
              style={{
                flex: 1,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorScheme ?? "light"].text,
                fontSize: moderateScale(20),
                fontWeight: "500",
              }}
            />
          </View>
        </View>
      </View>
      <View lightColor="#f6f7fb">
        <MonoText
          lightColor="#b2c5ca"
          style={{ fontSize: moderateScale(16), fontWeight: "500" }}
        >
          Frais de l'agence
        </MonoText>
        <View
          style={[
            {
              flexDirection: "row",
              margin: verticalScale(8),
              borderRadius: 10,
              borderWidth: 0.4,
              borderColor: "#0001",
              alignSelf: "flex-start",
              paddingHorizontal: horizontalScale(10),
            },
            shadow(1),
          ]}
        >
          <TextInput
            maxLength={3}
            value={charge}
            // onChangeText={setFraisAgence}
            onChangeText={(text) => {
              setCharge(text);
            }}
            placeholderTextColor={Colors[colorScheme ?? "light"].textGray}
            keyboardType="number-pad"
            placeholder="100"
            // pas
            style={{
              // flex: 10,
              // paddingHorizontal: horizontalScale(5),
              paddingVertical: verticalScale(8),
              color: Colors[colorScheme ?? "light"].text,
              fontSize: moderateScale(17),
              fontWeight: "500",
              textAlign: "right",
              marginRight: horizontalScale(2),
            }}
          />
          <View
            style={{
              // flex: 2.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome
              name="percent"
              size={15}
              color={Colors[colorScheme ?? "light"].text}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={verifyAndNext}
        style={[
          {
            width: "40%",
            // alignSelf: "flex-start",
            backgroundColor: Colors[colorScheme ?? "light"].text,
            marginVertical: verticalScale(30),
            paddingVertical: verticalScale(15),
            borderRadius: moderateScale(10),
          },
          shadow(10),
        ]}
      >
        <MonoText
          style={{
            textAlign: "center",
            color: Colors[colorScheme ?? "dark"].textOverlay,
            fontSize: moderateScale(20),
            textTransform: "uppercase",
          }}
        >
          next
        </MonoText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SetCountry;
