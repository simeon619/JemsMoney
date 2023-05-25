import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import {
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import Colors from "../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { transactionDataShema } from "../store/transaction/transactionSlice";
import { MonoText } from "./StyledText";
import { View } from "./Themed";

const TransactionItem = ({
  dataTransaction,
}: {
  dataTransaction: transactionDataShema;
}) => {
  const { height, width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  let ColorTransaction = determineStatus(
    dataTransaction.status.toLocaleLowerCase()
  );
  let router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/DetailTransaction",
          params: dataTransaction,
        });
      }}
    >
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "flex-start",
            paddingHorizontal: horizontalScale(10),
            marginVertical: verticalScale(12),
            paddingVertical: verticalScale(5),
            borderRadius: 5,
            columnGap: horizontalScale(7),
          },
          // shadow(1),
        ]}
      >
        <Image
          style={{ width: moderateScale(45), aspectRatio: 1 }}
          source={require("../assets/images/user.png")}
        />
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              //   backgroundColor: "red",
              width: width - horizontalScale(80),
            }}
          >
            <MonoText
              style={{ fontSize: moderateScale(18), fontWeight: "400" }}
            >
              {dataTransaction?.receiverName}
            </MonoText>
            <MonoText
              style={[
                {
                  backgroundColor: "#fff",
                  paddingHorizontal: horizontalScale(5),
                  borderRadius: 5,
                  marginVertical: verticalScale(2),
                  color: ColorTransaction,
                  borderWidth: 0.4,
                  borderColor: "#aaa",
                  fontWeight: "400",
                },
                // shadow(1),
              ]}
            >
              {dataTransaction.status}
            </MonoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                columnGap: horizontalScale(1),
                alignItems: "baseline",
                gap: 5,
              }}
            >
              <View
                style={{
                  width: moderateScale(15),
                  aspectRatio: 1,
                  borderRadius: 99,
                  gap: 5,
                  backgroundColor: ColorTransaction,
                }}
              />
              <MonoText
                style={{ fontSize: moderateScale(16), fontWeight: "600" }}
              >
                {dataTransaction.sum}
              </MonoText>
              <MonoText style={{}}>CFA</MonoText>
            </View>

            <MonoText
              style={{
                color: Colors[colorScheme ?? "light"].textGray,
                fontSize: moderateScale(12),
              }}
            >
              {dataTransaction.createdAt}
            </MonoText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  function determineStatus(status: string) {
    let ColorTransaction = Colors[colorScheme ?? "light"].text;
    switch (status.replaceAll(" ", "")) {
      case "start":
        ColorTransaction = "#a55";
        break;
      case "run":
        ColorTransaction = "#a48";
        break;
      case "full":
        ColorTransaction = "#7a4";
        break;
      case "end":
        ColorTransaction = "#0f0";
        break;
      case "cancel":
        ColorTransaction = "#e14";
        break;
    }
    return ColorTransaction;
  }
};

export default memo(TransactionItem);
