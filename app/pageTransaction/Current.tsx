import React from "react";
import { useSelector } from "react-redux";
import Transaction from "../../components/Transaction";
import { RootState } from "../../store";
import { transactionDataSchema } from "../../store/transaction/transactionSlice";

const Current = () => {
  const { full, run, start } = useSelector(
    (state: RootState) => state.transation
  );
  const filter = (item: transactionDataSchema): boolean => {
    return !!item?.status && !!item?.manager;
  };
  // start.
  return <Transaction filt={filter} transactions={[full, run]} />;
};

export default Current;
