import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Fonts } from "@/constants/theme";
import ShakingBox from "@/components/ShakingBox";
import GestureBall from "@/components/GestureBall";
import AnimatedBlob from "@/components/AnimatedBlob";

export default function Explore() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Explore 🔭
        </ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started, you can try them
        below.
      </ThemedText>

      <ThemedView style={styles.stepContainer}>
        <Link href="/(home)/(modals)/modal" asChild>
          <Link.Trigger>
            <ThemedText type="subtitle">Click here to open a Modal</ThemedText>
          </Link.Trigger>
        </Link>

        <ThemedText>
          You can see the functioning of the modal by clicking the title above
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Try the featured animations</ThemedText>

        <ThemedText>Click the button below, see the emoji wobble</ThemedText>
        <ShakingBox />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Try the featured gestures</ThemedText>

        <ThemedText>Grab the emoji below and give it a shake</ThemedText>
        <GestureBall />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Configure complex animations</ThemedText>

        <ThemedText>This one uses SVG path morphing to change shape</ThemedText>
        <AnimatedBlob />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
