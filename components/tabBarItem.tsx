import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { verticalScale } from "../fonctionUtilitaire/metrics";

type TabBarItemProps = {
  title: string;
  isSelected: boolean;
  onPress: () => void;
};

const TabBarItem = ({ title, isSelected, onPress }: TabBarItemProps) => (
  <Pressable style={styles.container} onPress={onPress}>
    <Text style={isSelected && styles.selected}>{title}</Text>
  </Pressable>
);

export default TabBarItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: verticalScale(5),
  },
  selected: { fontWeight: "700" },
});
