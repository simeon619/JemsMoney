import React from "react";

import { shadow } from "../fonctionUtilitaire/metrics";
import {
  TransactionSchema,
  transactionDataSchema,
} from "../store/transaction/transactionSlice";
import { ScrollView, View } from "./Themed";
import TransactionItem from "./TransactionItem";
const Transaction = ({
  transactions,
  filt,
}: {
  transactions: TransactionSchema[];
  filt: (value: transactionDataSchema) => boolean;
}) => {
  const renderTransactions = (status: TransactionSchema) => {
    return Object.values(status)
      .filter(filt)
      .map((item, index) => (
        <TransactionItem key={index} dataTransaction={item} />
      ));
  };

  return (
    <View style={[{ flex: 1 }, shadow(5)]}>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        pagingEnabled={true}
        scrollEventThrottle={16}
      >
        {transactions.map((status) => renderTransactions(status))}
      </ScrollView>
    </View>
  );
};

export default Transaction;
