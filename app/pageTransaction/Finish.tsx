import React from "react";
import { useSelector } from "react-redux";
import Transaction from "../../components/Transaction";
import { RootState } from "../../store";
import { transactionDataSchema } from "../../store/transaction/transactionSlice";

const Finish = () => {
  const { end } = useSelector((state: RootState) => state.transation);
  const filter = (item: transactionDataSchema): boolean => {
    return !!item?.status && !!item?.senderFile;
  };
  // start.
  return <Transaction filt={filter} transactions={[end]} />;
};

export default Finish;
