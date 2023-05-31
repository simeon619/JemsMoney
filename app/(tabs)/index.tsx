import { useDrawerProgress } from "@react-navigation/drawer";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import Bilan from "../../components/Bilan";
import ButtonAdd from "../../components/ButtonAdd";
import { View } from "../../components/Themed";
import Transaction from "../../components/Transaction";
import { AppDispatch, RootState } from "../../store";
import { fetchCountryAndAgencies } from "../../store/country/countrySlice";
import { fetchEntrepriseSlice } from "../../store/entreprise/entrepriseSlice";
import { fetchTransactions } from "../../store/transaction/transactionSlice";
import { PURGE_ALL_DATA } from "../_layout";

export default function Home() {
  const progress: any = useDrawerProgress();

  const router = useRouter();
  const navigationState = useRootNavigationState();
  const dispatch: AppDispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.05], "clamp");
    return {
      flex: 1,
      transform: [{ scale }],
    };
  }, []);

  useEffect(() => {
    console.log("423658785525255559522");

    dispatch(fetchTransactions());
    dispatch(fetchEntrepriseSlice());
    dispatch(fetchCountryAndAgencies());
  }, []);

  useEffect(() => {
    if (!navigationState?.key) return;
    if (!isAuthenticated) {
      router.replace("register/login");
      PURGE_ALL_DATA();
    } else {
      console.log("referesh data");
    }
  }, [isAuthenticated, navigationState?.key]);

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <View style={styles.container} lightColor="#f7f8fc">
        <Bilan />
        <Transaction />
        <ButtonAdd icon="plus" pathname="/formTransaction" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: horizontalScale(5),
  },
});
