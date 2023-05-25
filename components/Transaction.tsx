import React from "react";
import { useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import { moderateScale, shadow } from "../fonctionUtilitaire/metrics";
import { RootState } from "../store";
import { MonoText } from "./StyledText";
import { ScrollView, View } from "./Themed";
import TransactionItem from "./TransactionItem";
const Transaction = () => {
  const { cancel, end, full, run, start, fetchLoading, fetchSuccess } =
    useSelector((state: RootState) => state.transation);

  console.log(Object.values(cancel), "FRTR");

  const { height, width } = useWindowDimensions();
  return (
    <View style={[{ flex: 1, borderRadius: moderateScale(30) }, shadow(5)]}>
      <MonoText
        style={{
          padding: moderateScale(15),
          fontSize: moderateScale(25),
          fontWeight: "600",
          // marginBottom: verticalScale(5),
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
        {Object.values(start).map((item, index) => {
          if (item.status)
            return <TransactionItem key={index} dataTransaction={item} />;
        })}
        {Object.values(full).map((item, index) => {
          if (item.status)
            return <TransactionItem key={index} dataTransaction={item} />;
        })}
        {Object.values(run).map((item, index) => {
          if (item.status)
            return <TransactionItem key={index} dataTransaction={item} />;
        })}
        {Object.values(end).map((item, index) => {
          if (item.status)
            return <TransactionItem key={index} dataTransaction={item} />;
        })}
        {Object.values(cancel).map((item, index) => {
          if (item.status)
            return <TransactionItem key={index} dataTransaction={item} />;
        })}
      </ScrollView>
    </View>
  );
};

export default Transaction;
