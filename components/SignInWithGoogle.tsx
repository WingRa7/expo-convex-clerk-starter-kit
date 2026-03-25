import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import { Text } from "@/components/ui/Text";
import { useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function SignInWithGoogle() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startSSOFlow({
          strategy: "oauth_google",
        });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        if (signUp) {
          console.log("New user signing up");
        }
        if (signIn) {
          console.log("Returning user signing in");
        }
      }
    } catch (err: unknown) {
      console.error("OAuth error", JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image
        source={require("@/assets/images/google-symbol.png")}
        style={styles.googleSymbol}
      />
      <Text style={styles.buttonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 50,
    borderRadius: 8,
    borderColor: "#000000",
    borderWidth: 1,
  },
  buttonText: {
    fontFamily: "Roboto",
    color: "#000000",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  googleSymbol: {
    width: 20,
    height: 20,
    marginRight: 12,
    marginLeft: -12,
  },
});
