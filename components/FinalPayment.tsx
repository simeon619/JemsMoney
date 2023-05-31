import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { TransactionServer } from "../fonctionUtilitaire/type";
import { MonoText } from "./StyledText";
import { View } from "./Themed";
const FinalPayment = ({
  scrollHandler,
  dataSavedTransaction,
}: {
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  dataSavedTransaction: TransactionServer | undefined;
}) => {
  const { width } = useWindowDimensions();
  const recipientNumber = "+1234567890";
  const amountReceived = "1000 EUR";

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome
          name="clock-o"
          size={100}
          color="#F9A825"
          style={styles.icon}
        />
        <MonoText style={styles.title}>Transaction Tracking</MonoText>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ marginBottom: verticalScale(50) }}
      >
        <MonoText style={styles.description}>
          Your transaction is currently being verified. Please wait while we
          verify the details of your transaction.
        </MonoText>
        <MonoText style={styles.description}>
          Once the verification is complete, we will inform you of the status of
          your transaction.
        </MonoText>
        <View style={styles.recipientInfo}>
          <MonoText style={styles.recipientText}>
            The recipient will receive {dataSavedTransaction?.sum} on the
            following number:{" "}
            <MonoText style={styles.recipientNumber}>
              {dataSavedTransaction?.telephone}
            </MonoText>
          </MonoText>
        </View>
        <MonoText style={styles.description}>
          Please click on the icon below to chat with an agent if you have any
          additional questions.
        </MonoText>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(10),
  },
  iconContainer: {
    backgroundColor: "transparent",
    // marginBottom: 5,
  },
  icon: {
    alignSelf: "center",
  },
  recipientInfo: {
    marginVertical: verticalScale(20),
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  recipientText: {
    fontSize: moderateScale(20),
    color: "#444",
    textAlign: "center",
  },
  recipientNumber: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#F9A825",
  },
  title: {
    fontSize: moderateScale(22),
    // fontWeight: "bold",
    color: "#F9A825",
    textAlign: "center",
    marginBottom: verticalScale(10),
  },
  description: {
    fontSize: moderateScale(20),
    marginBottom: 10,
    color: "#444",
    textAlign: "center",
  },
});

export default FinalPayment;
