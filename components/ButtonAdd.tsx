import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../constants/Colors";
import shadow, {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
const ButtonAdd = () => {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      style={[
        {
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          bottom: verticalScale(30),
          right: verticalScale(30),
        },
        shadow(90),
      ]}
    >
      {({ pressed }) => (
        <AntDesign
          name="plus"
          size={moderateScale(30)}
          color={Colors[colorScheme ?? "light"].textOverlay}
          style={{
            marginRight: horizontalScale(0),
            opacity: pressed ? 0.5 : 1,
            backgroundColor: Colors[colorScheme ?? "light"].primaryColour,
            padding: moderateScale(15),
            borderRadius: 99,
          }}
        />
      )}
    </Pressable>
  );
};

export default ButtonAdd;