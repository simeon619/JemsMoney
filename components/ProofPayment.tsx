import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { MagicModalPortal, magicModal } from "react-native-magic-modal";
import { useDispatch } from "react-redux";
import { valuePassSchema } from "../app/formTransaction";
import Colors from "../constants/Colors";
import { CURRENCY_CHANGE } from "../fonctionUtilitaire/data";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { AppDispatch } from "../store";
import { updateTransaction } from "../store/transaction/transactionSlice";
import ImageRatio from "./ImageRatio";
import { MonoText } from "./StyledText";
import { ScrollView, Text, View } from "./Themed";

type imagePrepareShema =
  | {
      buffer: string;
      fileName: string;
      encoding: "base64";
      type: string;
      size: number;
    }
  | undefined;

const ProofPayment = ({
  valuePass,
  transactionId,
}: {
  valuePass: valuePassSchema;
  transactionId: string;
}) => {
  const [amount, setAmount] = useState<string>("0");
  const [image, setImage] = useState<string>();
  const [currencyReceiver, setCurrencyReceiver] = useState<string>(
    valuePass.currency
  );
  const [currentCurrency, setCurrentCurrency] = useState<string>("XOF");
  const [change, setChange] = useState<number>(0);
  const [prepareImage, setPrepareImage] =
    useState<imagePrepareShema>(undefined);
  const { height, width } = useWindowDimensions();
  const TAUX = 1.5;
  const colorSheme = useColorScheme();
  let montant = parseFloat(amount) * change;
  const dispatch: AppDispatch = useDispatch();
  let taxes = (TAUX * montant) / 100;

  // console.log(Object.keys(CURRENCY_CHANGE));
  //  let amountFee (parseFloat(amount)  * change).toFixed(2) - 2
  useEffect(() => {
    console.log(valuePass, valuePass.currency, "8888");

    if (valuePass.currency === "XOF") {
      setCurrentCurrency("RUB");
      setCurrencyReceiver(valuePass.currency);
    } else {
      setCurrentCurrency(valuePass.currency);
      setCurrencyReceiver("RUB");
    }
  }, [valuePass]);

  useEffect(() => {
    if (currencyReceiver === currentCurrency) {
      setChange(CURRENCY_CHANGE["x"]);
    } else if (currencyReceiver === "XOF") {
      setChange(CURRENCY_CHANGE["RUBtoXOF"]);
    } else if (currencyReceiver === "RUB") {
      setChange(CURRENCY_CHANGE["XOFtoRUB"]);
    }
  }, [currencyReceiver, currentCurrency]);
  const pickGallery = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      let base64 = result.assets[0].base64;

      let fileName = result.assets[0].uri?.split("/").pop();
      console.log(
        "🚀 ~ file: ProofPayment.tsx:97 ~ pickGallery ~ fileName:",
        fileName
      );
      let ext = fileName?.split(".").pop();
      let type =
        result.assets[0].type === "image" ? `image/${ext}` : "video/" + ext;
      console.log(
        "🚀 ~ file: ProofPayment.tsx:105 ~ pickGallery ~ type:",
        type
      );
      if (base64 && fileName)
        setPrepareImage({
          buffer: base64,
          encoding: "base64",
          fileName,
          size: 1500,
          type,
        });
      else {
        console.log(
          "🚀 ~ file: ProofPayment.tsx:100 ~ pickGallery ~ else:",
          prepareImage
        );
      }
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
    });

    console.log({ result });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  console.log({ image });

  const ResponseModal = () => {
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
        <View>
          <TouchableOpacity
            onPress={pickGallery}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <Entypo
              name="camera"
              size={25}
              color={Colors[colorSheme ?? "light"].text}
            />
            <MonoText
              style={{
                paddingVertical: verticalScale(15),
                fontSize: moderateScale(19),
              }}
            >
              take photo
            </MonoText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickGallery}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <Entypo
              name="image"
              size={25}
              color={Colors[colorSheme ?? "light"].text}
            />
            <MonoText
              style={{
                paddingVertical: verticalScale(15),
                fontSize: moderateScale(19),
              }}
            >
              choose a image
            </MonoText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  function sendServer(): void {
    if (+amount > 1 && !!prepareImage?.buffer) {
      dispatch(
        updateTransaction({
          data: {
            transacData: {
              sum: amount,
              agence: "6464356fbfadd56f766e6f37",
              country: "6464356fbfadd56f766e6f36",
              receiverName: "Okou",
              carte: "2544456985634589",
              codePromo: "78de",
              senderFile: [prepareImage],
              typeTransaction: "carte",

              // typeTransaction: "agence",
            },
            transactionId,
          },
        })
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        lightColor="#f6f7fb"
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(15),
          marginTop: verticalScale(10),
        }}
      >
        <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Amount to send
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
              // +amount < 1 && { borderWidth: 0.4, borderColor: "#e42" },
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
                name="wallet"
                size={25}
                color={Colors[colorSheme ?? "light"].text}
              />
            </TouchableOpacity>
            <TextInput
              // maxLength={10}
              value={amount}
              onChangeText={(txt) =>
                setAmount((prev) => txt.replace(/[^0-9.]/g, ""))
              }
              keyboardType="numeric"
              // pas
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(20),
                fontWeight: "500",
              }}
            />
            <TouchableOpacity
              style={{
                // flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <Text
                lightColor="#b2c5ca"
                style={{
                  fontSize: moderateScale(18),
                  // borderLeftColor: "#b2c5ca",
                  // borderLeftWidth: 1,
                  paddingLeft: horizontalScale(10),
                }}
              >
                {currentCurrency}
              </Text>
            </TouchableOpacity>
          </View>
          {+amount < 1 ? (
            <Text style={{ color: "#e42", textAlign: "center" }}>
              Amount invalid
            </Text>
          ) : (
            <Text />
          )}
        </View>
        <View lightColor="#f6f7fb" style={{}}>
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(15), fontWeight: "500" }}
          >
            Real amount Received (after fee)
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
              // +amount < 1 && { borderWidth: 0.4, borderColor: "#e42" },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                magicModal.show(() => <ResponseModal />);
              }}
              style={{
                flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="wallet"
                size={25}
                color={Colors[colorSheme ?? "light"].text}
              />
            </TouchableOpacity>
            <Text
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(20),
                fontWeight: "500",
              }}
            >
              {(montant - taxes).toFixed(2)}
            </Text>
            <TouchableOpacity
              style={{
                // flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <Text
                lightColor="#b2c5ca"
                style={{
                  fontSize: moderateScale(18),
                  // borderLeftColor: "#b2c5ca",
                  // borderLeftWidth: 1,
                  paddingLeft: horizontalScale(10),
                }}
              >
                {currencyReceiver}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View lightColor="#f6f7fb55" style={{ marginTop: horizontalScale(25) }}>
          <Text
            lightColor="#b2c5ca"
            style={{
              fontSize: moderateScale(15),
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Proof payment take screenshot or a photo (optional)
          </Text>
          <View
            lightColor="#f6f7fb55"
            style={[
              {
                // flexDirection: "row",
                alignItems: "center",
                margin: moderateScale(8),
                borderRadius: 10,
                // borderWidth: 0.4,
                borderColor: "#0001",
              },
              // shadow(1),
              // +amount < 1 && { borderWidth: 0.4, borderColor: "#e42" },
            ]}
          >
            <TouchableOpacity
              onPress={pickGallery}
              style={{
                flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: verticalScale(9),
              }}
            >
              <Entypo
                name="folder-images"
                size={25}
                color={Colors[colorSheme ?? "light"].text}
              />
            </TouchableOpacity>
            {image && <ImageRatio uri={image} />}
          </View>
        </View>
        <TouchableOpacity
          onPress={sendServer}
          style={[
            {
              width: "50%",
              alignSelf: "center",
              backgroundColor: Colors[colorSheme ?? "light"].text,
              marginTop: verticalScale(15),
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
              fontSize: moderateScale(20),
            }}
          >
            Send
          </Text>
        </TouchableOpacity>

        <MagicModalPortal />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProofPayment;
