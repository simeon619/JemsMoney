import { Entypo } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { MagicModalPortal } from "react-native-magic-modal";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import { HOST } from "../constants/data";
import { formatAmount } from "../fonctionUtilitaire/formatAmount";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { TransactionServer } from "../fonctionUtilitaire/type";
import { AppDispatch } from "../store";
import { Agency } from "../store/country/countrySlice";
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
  sum,
  agence,
  currentCurrency,
  transactionId,
  senderFile,
}: {
  sum: string | undefined;
  agence: Agency | undefined;
  currentCurrency: string | undefined;
  transactionId: string;
  senderFile?: string;
  dataSavedTransaction: TransactionServer | undefined;
}) => {
  const [image, setImage] = useState<string>();
  const [sender, setSenderFile] = useState<string>();

  useEffect(() => {
    setSenderFile(senderFile);
  }, [senderFile]);
  const [prepareImage, setPrepareImage] =
    useState<imagePrepareShema>(undefined);
  const { height, width } = useWindowDimensions();

  const colorSheme = useColorScheme();

  const dispatch: AppDispatch = useDispatch();

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

      let ext = fileName?.split(".").pop();
      let type =
        result.assets[0].type === "image" ? `image/${ext}` : "video/" + ext;

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

  const copyToClipboard = async () => {
    if (agence?.number) {
      await Clipboard.setStringAsync(agence?.number);
    } else {
      Toast.show({
        text1: "Error",
        position: "bottom",
        type: "error",
        visibilityTime: 5000,
      });
    }

    Toast.show({
      text1: "You could use this number now",
      text2: agence?.number + " has been copied🦾",
      position: "bottom",
      type: "info",
      visibilityTime: 5000,
    });
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
    });

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
            onPress={pickImage}
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
    if (!!prepareImage?.buffer) {
      dispatch(
        updateTransaction({
          data: {
            transacData: {
              senderFile: [prepareImage],
              // typeTransaction: "agence",
            },
            transactionId,
          },
        })
      );
    } else {
      Toast.show({
        text1: "please attach screenshot of receipt",
        text2: "try again",
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      lightColor="#f6f7fb"
      style={{
        flex: 1,
        paddingHorizontal: horizontalScale(15),
        marginTop: verticalScale(10),
      }}
    >
      <View lightColor="#f6f7fb" style={{}}>
        <Text
          lightColor="#b2c5ca"
          style={{ fontSize: moderateScale(16), fontWeight: "900" }}
        >
          Follow intruction below for finish you transaction
        </Text>
        <View
          style={[
            {
              // flexDirection: "row",
              margin: verticalScale(8),
              borderRadius: 10,
              paddingHorizontal: horizontalScale(5),
              borderWidth: 0.4,
              borderColor: "#0001",
            },
            shadow(1),
            // +amount < 1 && { borderWidth: 0.4, borderColor: "#e42" },
          ]}
        >
          <View style={styles.paragraphContainer}>
            <Text
              style={[
                styles.paragraph,
                { color: Colors[colorSheme ?? "light"].text },
              ]}
            >
              Please transfer the sum of{" "}
              <Text style={styles.span2}>
                {formatAmount(sum).replace(",00", "")} {currentCurrency}{" "}
              </Text>{" "}
              via <Text style={styles.span2}>{agence?.name}</Text> to{" "}
              <Text style={styles.span}>{agence?.number}</Text> (You bear the
              fee).
            </Text>
          </View>
          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraph}>
              Account name:{" "}
              <Text style={styles.span2}>{agence?.managerName}</Text>.
            </Text>
          </View>
          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraph}>
              Once the transfer is complete, please attach a screenshot of the
              payment receipt and click "Next" to confirm.
            </Text>
          </View>
          <TouchableOpacity
            onPress={copyToClipboard}
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
                fontSize: moderateScale(20),
                borderColor: "#b2c5ca",
                borderWidth: 1,
                paddingLeft: horizontalScale(10),
              }}
            >
              Copy the number
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View lightColor="#f6f7fb55" style={{ marginTop: horizontalScale(25) }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
          }}
          onPress={pickGallery}
        >
          <Text
            lightColor="#b2c5ca"
            style={{
              fontSize: moderateScale(16),
              fontWeight: "700",
            }}
          >
            click here attach the screenshot
          </Text>

          <Entypo
            name="attachment"
            size={25}
            color={Colors[colorSheme ?? "light"].text}
          />
        </TouchableOpacity>
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
          {(senderFile || image) && (
            <ImageRatio
              uri={senderFile ? HOST + senderFile : image}
              ratio={2}
            />
          )}
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
          Next
        </Text>
      </TouchableOpacity>

      <MagicModalPortal />
    </ScrollView>
  );
};

export default ProofPayment;

const styles = StyleSheet.create({
  paragraphContainer: {
    marginBottom: verticalScale(10),
  },
  paragraph: {
    fontSize: moderateScale(18),
  },
  span: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#13a",
  },
  span2: {
    fontStyle: "italic",
    color: "#a49",
  },
});
