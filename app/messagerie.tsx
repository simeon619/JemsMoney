import { useRouter, useSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
//@ts-ignore
import { MagicModalPortal, magicModal } from "react-native-magic-modal";
import { MonoText } from "../components/StyledText";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import {
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
const messagerie = () => {
  const params = useSearchParams();

  //   router.back();
  // }
  let router = useRouter();
  console.log(params);

  useEffect(() => {
    magicModal.show(() => <ResponseModal router={router} />);
  }, []);
  return (
    <View>
      <TouchableOpacity>
        <Text>Start the modal flow!</Text>
      </TouchableOpacity>
      <MagicModalPortal />
    </View>
  );
};

export default messagerie;
const ResponseModal = ({ router }: any) => {
  const colorScheme = useColorScheme();

  let canGoBack = false;
  useEffect(() => {
    if (canGoBack) {
      router.back();
    }
    canGoBack = true;
    return () => {
      if (canGoBack === true) {
        router.back();
      }
    };
  }, []);
  return (
    <View style={{ width: "90%", alignSelf: "center" }}>
      <TouchableOpacity
        onPress={() => {
          magicModal.hide();
          return router.replace("/discussion");
        }}
        style={[shadow(90), { paddingVertical: verticalScale(5) }]}
      >
        <MonoText
          style={{
            textAlign: "center",
            fontSize: moderateScale(16),
            color: Colors[colorScheme ?? "light"].primaryColour,
            borderBottomColor: "#ccc",
            borderBottomWidth: 0.3,
          }}
        >
          Create a new discussion with agent
        </MonoText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          canGoBack = false;
          return magicModal.hide();
        }}
        style={[shadow(90), { paddingVertical: verticalScale(15) }]}
      >
        <MonoText
          style={{
            textAlign: "center",
            fontSize: moderateScale(16),
            color: Colors[colorScheme ?? "light"].primaryColour,
            borderBottomColor: "#ccc",
            borderBottomWidth: 0.3,
            // alignSelf: "center",
          }}
        >
          See old discussion
        </MonoText>
      </TouchableOpacity>
    </View>
  );
};
