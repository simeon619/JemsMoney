import { Entypo } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { MonoText } from "../../components/StyledText";
import { ScrollView, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { AppDispatch } from "../../store";
import { addCountries } from "../../store/country/countrySlice";

type selectCountrySchema = {
  name: string;
  currency: string;
  icon: string;
};

const AddCountry = () => {
  const params = useLocalSearchParams();
  const { currency, icon, name } = params;
  const [selectCountry, setSelectCountry] = useState<selectCountrySchema>();
  const [indicatif, setIndicatif] = useState<string>("+7");
  const [digit, setDigit] = useState<string>("10");
  const [nameAgence, setNameAgence] = useState<string>("Orange MONEY");
  const [urlIconAgence, setUrlIconAgence] = useState<string>(
    "https://upload.wikimedia.org/wikipedia/fr/thumb/e/e9/Mtn-logo-svg.svg/1280px-Mtn-logo-svg.svg.png"
  );
  const [telephoneAgence, setTelephoneAgence] =
    useState<string>("+71012131517");
  const [nameManagerAgence, setnameManagerAgence] =
    useState<string>("MArio luigi");
  const [fraisAgence, setFraisAgence] = useState<string>();
  // const [fraisAgence, setFraisAgence] = useState<string>();
  const colorScheme = useColorScheme();
  //@ts-ignore
  let route = useRouter();

  const dispatch: AppDispatch = useDispatch();
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
      // return;
    }
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
      digit,
      indicatif,
      allowCarte: true,
      agencies: [
        {
          name: nameAgence,
          number: telephoneAgence,
          charge: parseInt(fraisAgence) / 100,
          managerName: nameManagerAgence,
          icon: urlIconAgence,
        },
      ],
      ...selectCountry,
    };

    console.log(data);
    dispatch(
      //@ts-ignore
      addCountries(data)
    );
    route.back();
    return;
  }

  useEffect(() => {
    let flatUrl = (icon as string)?.replace(/\*/g, "/");
    //@ts-ignore
    setSelectCountry({ currency, icon: flatUrl, name });
  }, [params]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          route.back();
        }}
        style={{
          padding: moderateScale(10),
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        <FontAwesome name="arrow-left" color={"#412"} size={20} />
        <MonoText style={{ fontSize: moderateScale(20) }}>Retour</MonoText>
      </TouchableOpacity>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{
          // left: horizontalScale(5),
          // right: horizontalScale(5),
          // bottom: verticalScale(10),
          padding: moderateScale(10),
          borderRadius: 10,
          // backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
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
                source={{ uri: selectCountry?.icon }}
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
              {name}
              {"-"}
              <MonoText
                style={{
                  fontSize: moderateScale(16),
                  paddingLeft: horizontalScale(10),
                  fontWeight: "900",
                  color: Colors[colorScheme ?? "light"].secondaryColour,
                }}
              >
                {currency}{" "}
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
            next
          </MonoText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCountry;
