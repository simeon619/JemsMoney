import { useDrawerProgress } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Bilan from "../../components/Bilan";
import ButtonAdd from "../../components/ButtonAdd";
import { View } from "../../components/Themed";
import Transaction from "../../components/Transaction";
export default function Home() {
  const progress: any = useDrawerProgress();
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.05]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, 12]);

    return {
      borderRadius,
      flex: 1,
      overflow: "hidden",
      transform: [{ scale }],
    };
  }, []);
  return (
    <Animated.View style={[animatedStyle]}>
      <View style={styles.container} lightColor="#f7f8fc">
        <Bilan />
        <Transaction />
        <ButtonAdd />
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
