import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { MonoText } from "../../components/StyledText";
import { View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { AppDispatch } from "../../store";
import { createManager } from "../../store/manager/managerSlice";

const AddManager = () => {
  const colorScheme = useColorScheme();
  const [nameManager, SetNameManager] = useState<string>("mopiu");
  const [password, setPassword] = useState<string>("2569");
  const [numberManager, SetNumberManager] = useState<string>("+2250595654");
  const route = useRouter();
  const dispatch: AppDispatch = useDispatch();
  function verifyAndSend(): void {
    if (!!!nameManager) {
      Toast.show({
        text1: "Error nameManager",
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }
    if (!!!password) {
      Toast.show({
        text1: "Error password",
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }
    if (!!!numberManager || !numberManager?.startsWith("+")) {
      Toast.show({
        text1: "Error numberManager",
        position: "top",
        type: "error",
        visibilityTime: 5000,
      });
      return;
    }

    dispatch(
      createManager({ name: nameManager, password, telephone: numberManager })
    );
    route.back();
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(20),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              // backgroundColor: "#007AFF",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => route.back()}
          >
            <FontAwesome
              name="arrow-left"
              size={25}
              color={"#125"}
              onPress={() => {
                route.back();
              }}
            />
          </TouchableOpacity>
        </View>
        <MonoText
          style={{
            textAlign: "center",
            fontSize: moderateScale(18),
            paddingVertical: verticalScale(25),
          }}
        >
          Ajout de manager
        </MonoText>
        <View style={{}}>
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
                ...shadow(1),
              },
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
              value={nameManager}
              onChangeText={SetNameManager}
              placeholderTextColor={Colors[colorScheme ?? "light"].textGray}
              numberOfLines={1}
              keyboardType="default"
              placeholder="manager name"
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
        <View style={{}}>
          <MonoText
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Numero du Manager
          </MonoText>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
                ...shadow(1),
              },
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
              value={numberManager}
              onChangeText={SetNumberManager}
              placeholderTextColor={Colors[colorScheme ?? "light"].textGray}
              numberOfLines={1}
              keyboardType="phone-pad"
              placeholder="+22504101215"
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
        <View style={{}}>
          <MonoText
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Mot de passe du manager
          </MonoText>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#0001",
              },
              shadow(1),
              password?.length > 3 && {
                borderWidth: 1,
                borderColor: "#4a58",
              },
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
                name="lock"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
            <TextInput
              maxLength={4}
              placeholder="****"
              value={password}
              onChangeText={(txt) => setPassword(txt)}
              keyboardType="number-pad"
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(0),
                paddingVertical: verticalScale(8),
                color: Colors[colorScheme ?? "light"].text,
                fontSize: moderateScale(18),
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].text,
            padding: 10,
            borderRadius: 5,
            marginTop: horizontalScale(10),
          }}
          onPress={verifyAndSend}
        >
          <MonoText
            lightColor="#eef"
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: moderateScale(18),
            }}
          >
            Ajouter
          </MonoText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddManager;
