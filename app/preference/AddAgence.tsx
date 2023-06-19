import { Entypo } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { MonoText } from "../../components/StyledText";
import { ScrollView, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { Agency, addAgencies } from "../../store/country/countrySlice";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";

const AddAgence = () => {
  const params = useSearchParams() as any as Agency;
  console.log("🚀 ~ file: SetAgence.tsx:21 ~ SetAgence ~ params:", params);
  const [nameAgence, setNameAgence] = useState<string>();
  const [urlIconAgence, setUrlIconAgence] = useState<string>();
  const [telephoneAgence, setTelephoneAgence] = useState<string>();
  const [nameManagerAgence, setnameManagerAgence] = useState<string>();
  const [fraisAgence, setFraisAgence] = useState<string>(String());
  const colorScheme = useColorScheme();
  const dispatch: AppDispatch = useDispatch();
  let route = useRouter();
  function verifyAndNext(): void {
    console.log("io");
    // return;
    if (!!!nameAgence) {
      Toast.show({
        text1: "Error nameAgence",
        text2: nameAgence,
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }
    if (!!!nameManagerAgence) {
      Toast.show({
        text1: "Error nameManagerAgence",
        text2: nameManagerAgence,
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }
    if (!!!urlIconAgence) {
      Toast.show({
        text1: "Error urlIconAgence",
        text2: urlIconAgence,
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }
    if (!(!!telephoneAgence && telephoneAgence?.startsWith("+"))) {
      Toast.show({
        text1: "Error telephoneAgence",
        text2: telephoneAgence,
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }
    if (!!!fraisAgence) {
      Toast.show({
        text1: "Error fraisAgence",
        text2: fraisAgence,
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }

    let data = {
      idCountry: params.idCountry,
      name: nameAgence,
      number: telephoneAgence,
      charge: parseInt(fraisAgence) / 100,
      managerName: nameManagerAgence,
      icon: urlIconAgence,
    };

    console.log(data);

    dispatch(addAgencies(data));
    route.back();
  }
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: horizontalScale(10) }}>
      <ScrollView style={{ flex: 1 }}>
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
          AGENCE
        </MonoText>
        <View lightColor="#f6f7fb" style={{ flex: 1 }}>
          <MonoText
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Nom de l'agence
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
                paddingLeft: horizontalScale(5),
              }}
            >
              <FontAwesome
                name="institution"
                size={18}
                color={Colors[colorScheme ?? "light"].text}
              />
            </View>
            <TextInput
              maxLength={20}
              value={nameAgence}
              onChangeText={setNameAgence}
              placeholderTextColor={Colors[colorScheme ?? "light"].textGray}
              keyboardType="default"
              placeholder="MTN Money"
              returnKeyLabel="5"
              returnKeyType="next"
              // pas
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorScheme ?? "light"].text,
                fontSize: moderateScale(17),
                fontWeight: "500",
              }}
            />
          </View>
        </View>
        <View lightColor="#f6f7fb" style={{ flex: 1 }}>
          <MonoText
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Icon de l'agence (url)
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
                paddingLeft: horizontalScale(5),
              }}
            >
              <Entypo
                name="link"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </View>
            <TextInput
              // maxLength={10}
              value={urlIconAgence}
              onChangeText={setUrlIconAgence}
              placeholderTextColor={Colors[colorScheme ?? "light"].textGray}
              numberOfLines={1}
              keyboardType="url"
              placeholder="https://u.ru/Logo_Sberbank.svg"
              // pas
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorScheme ?? "light"].text,
                fontSize: moderateScale(17),
                fontWeight: "500",
              }}
            />
          </View>
        </View>
        <View lightColor="#f6f7fb" style={{ flex: 1 }}>
          <MonoText
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Numero de l'agence
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
                paddingLeft: horizontalScale(5),
              }}
            >
              <FontAwesome
                name="phone"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </View>
            <TextInput
              maxLength={16}
              value={telephoneAgence}
              onChangeText={setTelephoneAgence}
              placeholderTextColor={Colors[colorScheme ?? "light"].textGray}
              keyboardType="phone-pad"
              placeholder="+2250587454120"
              // pas
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorScheme ?? "light"].text,
                fontSize: moderateScale(17),
                fontWeight: "500",
              }}
            />
          </View>
        </View>
        <View lightColor="#f6f7fb" style={{ flex: 1 }}>
          <MonoText
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Nom du Manager
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
                paddingLeft: horizontalScale(5),
              }}
            >
              <Entypo
                name="user"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </View>
            <TextInput
              // maxLength={10}
              value={nameManagerAgence}
              onChangeText={setnameManagerAgence}
              placeholderTextColor={Colors[colorScheme ?? "light"].textGray}
              keyboardType="default"
              placeholder="Oko Jean luc"
              // pas
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorScheme ?? "light"].text,
                fontSize: moderateScale(17),
                fontWeight: "500",
              }}
            />
          </View>
        </View>
        {/* <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex :1}}> </KeyboardAvoidingView> */}
        <View lightColor="#f6f7fb" style={{ flex: 1 }}>
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
              value={fraisAgence}
              // onChangeText={setFraisAgence}
              onChangeText={(text) => {
                setFraisAgence(text);
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
              alignSelf: "flex-start",
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
            Ajouter
          </MonoText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAgence;
