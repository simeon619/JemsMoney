import React from "react";
import { Dimensions, StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

const { width } = Dimensions.get("window");

type TabBarIndicatorProps = {
  tabCount: number;
  animatedStyle: StyleProp<ViewStyle>;
  height?: number;
  color?: string;
};

const TabBarIndicator = ({
  tabCount,
  height = 5,
  color = "red",
  animatedStyle,
}: TabBarIndicatorProps) => {
  console.log("🚀 ~ file: TabBarIndicator.tsx:13 ~ animatedStyle:", tabCount);

  return (
    <Animated.View
      style={[
        {
          height,
          width: width / tabCount,
          backgroundColor: color,
          borderRadius: height / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

export default TabBarIndicator;
