import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { Svg, Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  interpolateColor,
  withSpring,
} from "react-native-reanimated";
import { interpolatePath, parse } from "react-native-redash";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const paths = [
  parse(
    "M351.5,320.5Q331,391,258,377Q185,363,95.5,306.5Q6,250,99,200Q192,150,243,161.5Q294,173,333,211.5Q372,250,351.5,320.5Z"
  ),
  parse(
    "M382.28838,307.97591Q317.43224,365.95182,242.34489,379.08735Q167.25754,392.22287,129.94124,321.11144Q92.62494,250,121.96083,164.51508Q151.29671,79.03017,263.87348,55.04525Q376.45025,31.06033,411.79739,140.53017Q447.14453,250,382.28838,307.97591Z"
  ),
  parse(
    "M400.5,296Q303,342,228,380Q153,418,134.5,334Q116,250,143.5,181.5Q171,113,247,118Q323,123,410.5,186.5Q498,250,400.5,296Z"
  ),
];
const colors = ["#38BDF8", "#2DD4BF", "#818CF8"]; // More vibrant colors for better visibility
const numPaths = paths.length;

export default function AnimatedBlob({ size = 300, autoPlay = true }: { size?: number, autoPlay?: boolean }) {
  const animation = useSharedValue(0);

  useEffect(() => {
    if (autoPlay) {
      animation.value = withRepeat(
        withTiming(numPaths - 0.01, { duration: 10000 }),
        -1,
        true
      );
    }
  }, [autoPlay]);

  const animatedProps = useAnimatedProps(() => {
    const currentPathIndex = Math.floor(animation.value) % numPaths;
    const nextPathIndex = (currentPathIndex + 1) % numPaths;
    const progress = animation.value % 1;

    const d = interpolatePath(
      progress,
      [0, 1],
      [paths[currentPathIndex], paths[nextPathIndex]]
    );

    const fill = interpolateColor(
      progress,
      [0, 1],
      [colors[currentPathIndex], colors[nextPathIndex]]
    );

    return {
      d,
      fill,
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 500 500">
        <AnimatedPath animatedProps={animatedProps} />
      </Svg>
    </View>
  );
}
