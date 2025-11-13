import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Collapsible } from "@/components/ui/Collapsible";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Your boilerplate React Native app
        </ThemedText>

        <ThemedText>The techstack used to create this template</ThemedText>

        <Collapsible title="Convex 🧠">
          <ThemedText>
            Add your Convex actions, queries and mutations in the /convex
            directory and run `npx convex dev` to sync with the Convex backend
          </ThemedText>
        </Collapsible>

        <Collapsible title="Clerk 🔐">
          <ThemedText>
            A full custom implementation of Clerk authentication, featuring
            google sign in, face and finger biometric ID and user actions such
            as changing username and password.
          </ThemedText>
        </Collapsible>

        <Collapsible title="Posthog 🦔">
          <ThemedText>Yet to be implemented analytics</ThemedText>
        </Collapsible>

        {/* <Collapsible title="RevenueCat 🐈">
          <ThemedText>Yet to be implemented subscriptions</ThemedText>
        </Collapsible>

        <Collapsible title="Sentry 🚨">
          <ThemedText>Yet to be implemented error monitoring</ThemedText>
        </Collapsible> */}

        <ThemedText type="subtitle">Custom hooks</ThemedText>

        <Collapsible title="Password Verification">
          <ThemedText>
            User password verification method that handles errors and loading
            states
          </ThemedText>
        </Collapsible>

        {/* <Collapsible title="Color Scheme">
          <ThemedText>TODO color scheme description</ThemedText>
        </Collapsible>

        <Collapsible title="Theme Color">
          <ThemedText>TODO theme scheme description</ThemedText>
        </Collapsible> */}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
