import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";

import { Entypo } from "@expo/vector-icons";
import phone from "phone";
import { MagicModalPortal, magicModal } from "react-native-magic-modal";
import Colors from "../constants/Colors";
import { AGENCE, normeFormat } from "../fonctionUtilitaire/data";
import { MonoText } from "./StyledText";
import { ScrollView, Text, View } from "./Themed";

const Contact = ({
  user,
  changeTOProofPayment,
}: {
  user: {
    isValid: boolean;
    code: string;
    name: string;
    id: string;
    number: string;
  };
  changeTOProofPayment: (infoPay: any) => void;
}) => {
  const colorSheme = useColorScheme();
  const [pays, setPays] = useState<"RU" | "CI" | "CM" | "TG" | "BE" | "">(
    //@ts-ignore
    () => {
      let code = user?.code ? user?.code : "";
      return code;
    }
    // user?.code
  );

  const [name, setName] = useState<string>(user?.name);
  const [valid, setValid] = useState<boolean>(user?.isValid);
  const [cardSb, setCardSb] = useState<string>("");
  const [service, setService] = useState<string[]>([]);
  const [agence, setAgence] = useState("");
  const [number, setNumber] = useState<string>(() => {
    let number = user?.number?.replaceAll(" ", " ");
    let code = user?.code ? user?.code : "";

    if (
      //@ts-ignore
      number?.startsWith("+" + normeFormat[code]?.indicatif) ||
      //@ts-ignore
      number?.startsWith(normeFormat[code]?.indicatif)
    ) {
      //@ts-ignore
      number = number?.slice(normeFormat[code]?.indicatif?.length + 1);
    } else {
      //@ts-ignore
      number = user?.number?.replaceAll(" ", "");
    }
    return number;
  });

  useEffect(() => {
    let validnumber = "+" + normeFormat[pays]?.indicatif + number;
    let resultPhone = phone(validnumber, { country: undefined });
    setValid(resultPhone.isValid);

    switch (normeFormat[pays]?.name) {
      case "Togo":
      case "Benin":
        setService(AGENCE["S1"]);
        break;
      case "Ivory Coast":
      case "Mali":
      case "Senegal":
        setService(AGENCE["S2"]);
        break;
      default:
        break;
    }
  }, [pays, number]);

  const ServiceModal = () => {
    const renderItem = ({ item }: { item: any }) => {
      //@ts-ignore
      // const { name, digit, indicatif, flag } = service[item];
      return (
        <TouchableOpacity
          onPress={() => {
            magicModal.hide(<ServiceModal />);
            setAgence(item);
          }}
        >
          <MonoText
            style={{
              fontSize: moderateScale(20),
              textAlign: "center",
              paddingVertical: verticalScale(10),
            }}
          >
            {item}
          </MonoText>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          data={service}
          //@ts-ignore
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      </View>
    );
  };

  const ResponseModal = () => {
    const renderItem = ({
      item,
    }: {
      item: "RU" | "CI" | "CM" | "TG" | "BE" | "RDC" | "";
    }) => {
      const { name, digit, indicatif, flag } = normeFormat[item];
      return (
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            setPays(item);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: verticalScale(15),
          }}
        >
          <Image
            source={flag}
            style={{
              width: horizontalScale(30),
              height: verticalScale(20),
              marginRight: 5,
              paddingVertical: moderateScale(15),
            }}
          />
          <MonoText style={{ fontSize: moderateScale(18) }}>{name}</MonoText>
          <Text style={{ marginLeft: 10 }}>+{indicatif}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          //@ts-ignore
          data={Object.keys(normeFormat)}
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      </View>
    );
  };
  function verifyAndNext(): void {
    let realNumber = "+" + normeFormat[pays]?.indicatif + number;
    const nameRegex = /^[A-Za-z]+$/;
    let testAgence =
      agence === "ORANGE MONEY" || agence === "MTN MONEY" || agence === "WAVE";
    // let testName = /^[a-zA-ZÀ-ÖØ-öø-ſÇ-üŸ-ÿ\s-]+$/.test(name) || /^[а-яА-ЯёЁ]+$/.test(name);

    if (testAgence && name?.length >= 3) {
      changeTOProofPayment({
        pays,
        valid,
        agence,
        currency: normeFormat[pays].currency,
      });
      console.log({ pays, valid, agence, realNumber });
    }
  }

  return (
    <>
      {normeFormat[pays]?.digit ? (
        <ScrollView
          keyboardShouldPersistTaps="always"
          lightColor="#f6f7fb"
          style={{
            flex: 1,
            paddingHorizontal: horizontalScale(15),
            marginTop: verticalScale(10),
            gap: 20,
          }}
        >
          <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(16), fontWeight: "500" }}
            >
              Recipient name
            </Text>
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
                name?.length < 3 && { borderWidth: 0.4, borderColor: "#e42" },
              ]}
            >
              <TouchableOpacity
                style={{
                  flex: 2.5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Entypo
                  name="user"
                  size={25}
                  color={Colors[colorSheme ?? "light"].text}
                />
              </TouchableOpacity>
              <TextInput
                // maxLength={10}
                value={name}
                onChangeText={(txt) => setName(txt)}
                keyboardType="name-phone-pad"
                style={{
                  flex: 10,
                  paddingHorizontal: horizontalScale(0),
                  paddingVertical: verticalScale(8),
                  color: Colors[colorSheme ?? "light"].text,
                  fontSize: moderateScale(18),
                }}
              />
            </View>
            {name?.length < 3 ? (
              <Text style={{ color: "#e42", textAlign: "center" }}>
                name invalid
              </Text>
            ) : (
              <Text />
            )}
          </View>

          <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(16), fontWeight: "500" }}
            >
              Recipient number
            </Text>

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
                !valid && { borderWidth: 0.4, borderColor: "#e42" },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  magicModal.show(() => <ResponseModal />);
                }}
                style={{
                  // flex: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: horizontalScale(5),
                }}
              >
                <Text
                  lightColor="#b2c5ca"
                  style={{
                    fontSize: moderateScale(18),
                    borderRightColor: "#b2c5ca",
                    borderRightWidth: 1,
                    paddingHorizontal: horizontalScale(10),
                  }}
                >
                  +{normeFormat[pays]?.indicatif}
                </Text>
              </TouchableOpacity>
              <TextInput
                maxLength={parseInt(normeFormat[pays]?.digit) || 0}
                value={number}
                onChangeText={(txt) => {
                  setNumber(txt);
                }}
                keyboardType="phone-pad"
                style={{
                  flex: 10,
                  paddingHorizontal: horizontalScale(15),
                  paddingVertical: verticalScale(8),
                  color: Colors[colorSheme ?? "light"].text,
                  fontSize: moderateScale(18),
                }}
              />

              <TouchableOpacity
                style={{
                  flex: 3,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={[normeFormat[pays]?.flag]}
                  style={{ width: moderateScale(30), aspectRatio: 1 }}
                />
              </TouchableOpacity>
            </View>

            {!valid ? (
              <Text style={{ color: "#e42", textAlign: "center" }}>
                format invalid
              </Text>
            ) : (
              <Text />
            )}
          </View>

          {pays === "RU" ? ( // une animation  avec pageViewer un slide
            <View
              lightColor="#f6f7fb"
              style={{ marginTop: horizontalScale(20) }}
            >
              <Text
                lightColor="#b2c5ca"
                style={{ fontSize: moderateScale(16), fontWeight: "500" }}
              >
                Card
              </Text>
              <View
                style={[
                  {
                    flexDirection: "row",
                    margin: verticalScale(8),
                    borderRadius: 10,
                  },
                  shadow(1),
                ]}
              >
                <TouchableOpacity
                  style={{
                    //   flex: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: horizontalScale(10),
                  }}
                >
                  <Text
                    lightColor="#b2c5ca"
                    style={{
                      fontSize: moderateScale(16),
                      borderRightColor: "#b2c5ca",
                      borderRightWidth: 1,
                      paddingRight: horizontalScale(5),
                    }}
                  >
                    SIBER BANK
                  </Text>
                </TouchableOpacity>
                <TextInput
                  // maxLength={10}
                  value={cardSb}
                  onChangeText={(txt) => {
                    setCardSb;
                  }}
                  keyboardType="number-pad"
                  style={{
                    flex: 10,
                    paddingHorizontal: horizontalScale(0),
                    paddingVertical: verticalScale(8),
                    color: Colors[colorSheme ?? "light"].text,
                    fontSize: moderateScale(18),
                  }}
                />
              </View>
            </View>
          ) : valid ? (
            <View
              lightColor="#f6f7fb"
              style={{ marginTop: horizontalScale(10) }}
            >
              <Text
                lightColor="#b2c5ca"
                style={{ fontSize: moderateScale(16), fontWeight: "500" }}
              >
                Withdrawal mode
              </Text>

              <TouchableOpacity
                onPress={() => {
                  magicModal.show(() => <ServiceModal />);
                }}
                style={[
                  {
                    //   flex: 3,
                    // justifyContent: "center",
                    // alignItems: "center",
                    // paddingHorizontal: horizontalScale(0),
                    borderRadius: 10,
                    margin: verticalScale(8),
                    flexDirection: "row",
                    justifyContent: "center",
                    paddingVertical: verticalScale(10),
                    // paddingHorizontal: horizontalScale(5),
                    backgroundColor: "white",
                  },
                  shadow(1),
                ]}
              >
                <Entypo
                  name="chevron-down"
                  size={30}
                  color={"#b2c5ca"}
                  style={{
                    position: "absolute",
                    left: horizontalScale(10),
                    bottom: verticalScale(5),
                  }}
                />
                <Text
                  lightColor="#b2c5ca"
                  style={{
                    fontSize: moderateScale(18),
                    // paddingHorizontal: horizontalScale(10),
                    textAlign: "center",
                    // backgroundColor: "red",
                  }}
                >
                  {agence}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={verifyAndNext}
            style={[
              {
                width: "50%",
                alignSelf: "center",
                backgroundColor: Colors[colorSheme ?? "light"].text,
                marginTop: verticalScale(30),
                paddingVertical: verticalScale(15),
                borderRadius: moderateScale(10),
              },
              shadow(10),
            ]}
          >
            <Text
              style={{
                textAlign: "center",
                color: Colors[colorSheme ?? "dark"].textOverlay,
                fontSize: moderateScale(17),
              }}
            >
              Pass at next
            </Text>
          </TouchableOpacity>
          <MagicModalPortal />
        </ScrollView>
      ) : (
        <Text>COUNTRY NOT AVAILABLE</Text>
      )}
    </>
  );
};

export default Contact;
