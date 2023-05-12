import { Image } from "expo-image";
import React from "react";
import { Pressable, useColorScheme, useWindowDimensions } from "react-native";

import Colors from "../constants/Colors";
import { transactionShema } from "../fonctionUtilitaire/data";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { MonoText } from "./StyledText";
import { View } from "./Themed";

const TransactionItem = ({
  dataTransaction,
}: {
  dataTransaction: transactionShema;
}) => {
  const { height, width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  let ColorTransaction = determineStatus(
    dataTransaction.status.toLocaleLowerCase()
  );

  return (
    <Pressable>
      <View
        style={[
          {
            //   width: 350,
            // height: 100,
            flexDirection: "row",
            alignItems: "flex-start",
            paddingHorizontal: horizontalScale(10),
            marginVertical: verticalScale(10),
            paddingVertical: verticalScale(5),
            borderRadius: 5,
            columnGap: horizontalScale(7),
          },
          shadow(1),
        ]}
      >
        <Image
          style={{ width: moderateScale(45), aspectRatio: 1 }}
          source={
            dataTransaction.picUser
              ? { uri: dataTransaction.picUser }
              : require("../assets/images/user.png")
          }
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
              {dataTransaction.name}
            </MonoText>
            <MonoText
              style={[
                {
                  backgroundColor: ColorTransaction,
                  padding: moderateScale(4),
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#eee",
                  fontWeight: "400",
                },
                shadow(5),
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
                {dataTransaction.montant}
              </MonoText>
              <MonoText style={{}}>CFA</MonoText>
            </View>

            <MonoText
              style={{
                color: Colors[colorScheme ?? "light"].textGray,
                fontSize: moderateScale(12),
              }}
            >
              {dataTransaction.date}
            </MonoText>
          </View>
        </View>
      </View>
    </Pressable>
  );

  function determineStatus(status: string) {
    let ColorTransaction = Colors[colorScheme ?? "light"].text;
    switch (status.replaceAll(" ", "")) {
      case "inwait":
        ColorTransaction = "#777";
        break;
      case "inprogress":
        ColorTransaction = "#ee4";
        break;
      case "success":
        ColorTransaction = "#0f0";
        break;
      case "fail":
        ColorTransaction = "#e14";
        break;
    }
    return ColorTransaction;
  }
};

export default TransactionItem;
