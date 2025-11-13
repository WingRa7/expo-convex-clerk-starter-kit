import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";

import { useConvexAuth } from "convex/react";

export default function WelcomePage() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isAuthenticated && !isLoading) {
    return <Redirect href="/(home)/(tabs)" />;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.welcome}>
          Welcome to Accountability Buddy 🤝
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          👇 Please sign in or create an account to continue
        </ThemedText>
        <View style={styles.linkContainer}>
          <Link href="/(auth)/sign-in" style={styles.link}>
            <ThemedText type="link" style={styles.linkText}>
              Sign in
            </ThemedText>
          </Link>
          <Link href="/(auth)/sign-up" style={styles.link}>
            <ThemedText type="link" style={styles.linkText}>
              Sign up
            </ThemedText>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    gap: 16,
  },
  welcome: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 8,
  },
  linkContainer: {
    flexDirection: "row",
    gap: 24,
    marginTop: 16,
  },
  link: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  linkText: {
    fontSize: 16,
  },
});
