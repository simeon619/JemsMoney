import React from "react";
import { useWindowDimensions } from "react-native";
import { dataTransactions } from "../fonctionUtilitaire/data";
import {
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { MonoText } from "./StyledText";
import { ScrollView, View } from "./Themed";
import TransactionItem from "./TransactionItem";
const Transaction = () => {
  const { height, width } = useWindowDimensions();
  return (
    <View style={[{ flex: 1, borderRadius: moderateScale(30) }, shadow(5)]}>
      <MonoText
        style={{
          padding: moderateScale(15),
          fontSize: moderateScale(25),
          fontWeight: "600",
          marginBottom: verticalScale(10),
        }}
      >
        Transaction
      </MonoText>
      <ScrollView
        // style={{ flex: 1 }}
        // lightColor="#eee"
        contentContainerStyle={{ alignItems: "center" }}
        pagingEnabled={true}
      >
        {dataTransactions.map((item, index) => (
          <TransactionItem key={index} dataTransaction={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Transaction;
