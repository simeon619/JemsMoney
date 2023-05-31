import { Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import {
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";
import Colors from "../constants/Colors";
import { formatDate } from "../fonctionUtilitaire/date";
import { formatAmount } from "../fonctionUtilitaire/formatAmount";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import SQuery from "../lib/SQueryClient";
import { RootState } from "../store";
import { transactionDataSchema } from "../store/transaction/transactionSlice";
import { MonoText } from "./StyledText";
import { View } from "./Themed";
let color = "#fff";
const TransactionItem = ({
  dataTransaction,
}: {
  dataTransaction: transactionDataSchema;
}) => {
  const { height, width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  let ColorTransaction = determineStatus(
    dataTransaction.status.toLocaleLowerCase()
  );
  console.log(
    "🚀 ~ file: TransactionItem.tsx:31 ~ dataTransaction:",
    dataTransaction
  );
  const country = useSelector((state: RootState) => state.country);

  let router = useRouter();
  return (
    <View
      lightColor={color}
      style={[shadow(10), { marginBottom: verticalScale(20) }]}
    >
      <TouchableOpacity
        onPress={() => {
          if (dataTransaction.status === "end") {
            router.push({
              pathname: "/DetailTransaction",
              params: dataTransaction,
            });
          } else {
            router.push({
              pathname: "/formTransaction",
              params: { id: dataTransaction?.id, type: "transaction" },
            });
          }
        }}
      >
        <View
          lightColor={color}
          style={[
            {
              flexDirection: "row",
              alignItems: "flex-start",
              paddingHorizontal: horizontalScale(10),
              marginTop: verticalScale(12),
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
          <View style={{ gap: 10 }} lightColor={color}>
            <View
              lightColor={color}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                //   backgroundColor: "red",
                width: width - horizontalScale(80),
              }}
            >
              <MonoText
                lightColor="#444"
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{ fontSize: moderateScale(18), fontWeight: "400" }}
              >
                {dataTransaction?.receiverName}
              </MonoText>
              <MonoText
                style={[
                  {
                    backgroundColor:
                      Colors[colorScheme ?? "light"].primaryColour,
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
              lightColor={color}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <View
                lightColor={color}
                style={{
                  flexDirection: "row",
                  columnGap: horizontalScale(1),
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <View
                  lightColor={color}
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
                  {formatAmount(
                    dataTransaction.sum,
                    country[dataTransaction?.country]?.currency
                  ).replace(",00", "")}
                </MonoText>
                {/* <MonoText style={{ fontSize: moderateScale(10) }}>CFA</MonoText> */}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          if (dataTransaction.discussionId) {
            router.push({
              pathname: "/discussion",
              params: { id: dataTransaction.discussionId },
            });
          } else {
            let discussionId = await SQuery.service(
              "transaction",
              "addDiscussion",
              {
                id: dataTransaction.id,
              }
            );

            router.push({
              pathname: "/discussion",
              params: { id: discussionId },
            });
          }
        }}
        style={[
          {
            alignSelf: "flex-start",
            backgroundColor: Colors[colorScheme ?? "dark"].primaryColour,

            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(10),
            paddingVertical: verticalScale(5),
            paddingHorizontal: horizontalScale(15),

            borderTopRightRadius: 10,
          },
          shadow(3),
        ]}
      >
        <MonoText
          style={{
            fontSize: moderateScale(16),
            color: "#fff",
            textAlign: "center",
          }}
        >
          Go discust with a agent!
        </MonoText>
        <Entypo name="message" size={26} color={"#fff"} />
      </TouchableOpacity>
      <MonoText
        style={{
          color: Colors[colorScheme ?? "light"].textGray,
          fontSize: moderateScale(16),
        }}
      >
        {formatDate(dataTransaction.updatedAt)}
      </MonoText>
    </View>
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
