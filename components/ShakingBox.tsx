import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

export default function ShakingBox() {
  const offset = useSharedValue<number>(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const OFFSET = 40;
  const TIME = 250;
  const DELAY = 400;

  const handlePress = () => {
    offset.value = withDelay(
      DELAY,
      withSequence(
        withTiming(-OFFSET, { duration: TIME / 2 }),
        withRepeat(withTiming(OFFSET, { duration: TIME }), 5, true),
        withTiming(0, { duration: TIME / 2 })
      )
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]}>
        <Text style={styles.emoji}>🙂‍↔️</Text>
      </Animated.View>
      <ThemedButton onPress={handlePress}>
        <ThemedText>Wobble</ThemedText>
      </ThemedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  box: {
    width: 100,
    height: 100,
    marginHorizontal: 25,
    marginVertical: 15,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 60,
  },
});
