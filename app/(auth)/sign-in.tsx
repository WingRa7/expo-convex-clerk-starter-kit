import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { useSignIn } from "@clerk/clerk-expo";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";

import { useFormik } from "formik";
import * as yup from "yup";

import SignInWithGoogle from "@/components/SignInWithGoogle";

import { IconSymbol } from "@/components/ui/IconSymbol";

import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/use-theme-color";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),

  password: yup.string().required("Password is required"),
});

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const { hasCredentials, setCredentials, authenticate, biometricType } =
    useLocalCredentials();

  const [clerkError, setClerkError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const buttonTextColor = useThemeColor({}, "buttonText");
  const borderColor = useThemeColor({ light: "#E0E0E0", dark: "#333" }, "text");
  const placeholderColor = useThemeColor(
    { light: "#999", dark: "#666" },

    "icon"
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values) => {
      await handleEmailSignIn(values.email, values.password);
    },
  });

  const handleEmailSignIn = async (emailAddress: string, password: string) => {
    if (!isLoaded || isLoading) {
      return;
    }

    setClerkError("");
    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        console.log("✅ Email Sign-in complete. Status:", signInAttempt.status);

        try {
          console.log("Setting credentials...");
          await setCredentials({
            identifier: emailAddress,
            password,
          });
          console.log("✅ Credentials set");
        } catch (credError: any) {
          console.error("Could not save credentials:", credError);
        }
        await setActive({ session: signInAttempt.createdSessionId });
        console.log("✅ Session activated (email)");
      } else {
        setClerkError("Email Sign in could not be completed."); // make user friendly in prod
        console.error(
          "Email Sign in status not complete:",
          JSON.stringify(signInAttempt, null, 2)
        );
      }
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "An error occurred during email sign in.";

      setClerkError(errorMessage);

      console.error("Email Sign-in error:", JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricSignIn = async () => {
    if (!isLoaded || !hasCredentials) {
      if (!hasCredentials)
        console.log("⚠️ Biometric sign-in pressed, but no credentials found.");
      return;
    }

    setClerkError("");
    setIsLoading(true);

    try {
      console.log("🔐 Attempting biometric authentication...");
      const signInAttempt = await authenticate();
      console.log("✅ Biometric auth successful:", signInAttempt.status);

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        console.log("✅ Session activated");
      } else {
        setClerkError("Sign in could not be completed. Please try again");
        console.error(
          "Biometric sign in status not complete:",
          JSON.stringify(signInAttempt, null, 2)
        );
      }
    } catch (authError: any) {
      console.log("Biometric auth failed:", {
        message: authError?.message,
        code: authError?.code,
        fullError: JSON.stringify(authError, null, 2),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Sign in
        </ThemedText>

        <View style={styles.formContainer}>
          <View style={styles.fieldsContainer}>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                formik.touched.email &&
                  formik.errors.email &&
                  styles.inputError,
              ]}
              autoCapitalize="none"
              placeholder="Enter email"
              placeholderTextColor={placeholderColor}
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              keyboardType="email-address"
              autoComplete="email"
              editable={!isLoading}
            />

            <ThemedText
              style={[
                styles.validationErrorText,
                !(formik.touched.email && formik.errors.email) &&
                  styles.hiddenError,
              ]}
            >
              {formik.errors.email || ""}
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                formik.touched.password &&
                  formik.errors.password &&
                  styles.inputError,
              ]}
              placeholder="Enter password"
              placeholderTextColor={placeholderColor}
              secureTextEntry={true}
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              autoComplete="password"
              editable={!isLoading}
            />

            <ThemedText
              style={[
                styles.validationErrorText,
                !(formik.touched.password && formik.errors.password) &&
                  styles.hiddenError,
              ]}
            >
              {formik.errors.password || ""}
            </ThemedText>
          </View>

          <View style={styles.clerkErrorContainer}>
            <ThemedText
              style={[styles.clerkErrorText, !clerkError && styles.hiddenError]}
            >
              {clerkError || ""}
            </ThemedText>
          </View>

          <View style={styles.buttonsContainer}>
            <ThemedButton
              onPress={() => formik.handleSubmit()}
              disabled={isLoading}
            >
              Sign in with email
            </ThemedButton>

            <SignInWithGoogle />

            {hasCredentials && biometricType && (
              <ThemedButton
                onPress={handleBiometricSignIn}
                disabled={isLoading}
              >
                {biometricType === "face-recognition" ? (
                  <View style={styles.biometricButton}>
                    <IconSymbol
                      name="faceid"
                      size={60}
                      weight="regular"
                      color={buttonTextColor}
                    />

                    <ThemedText
                      style={[
                        styles.biometricButtonText,
                        { color: buttonTextColor },
                      ]}
                    >
                      Sign in with Face ID
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.biometricButton}>
                    <IconSymbol
                      name="touchid"
                      size={18}
                      weight="regular"
                      color={buttonTextColor}
                    />

                    <ThemedText
                      style={[
                        styles.biometricButtonText,
                        { color: buttonTextColor },
                      ]}
                    >
                      Sign in with Touch ID
                    </ThemedText>
                  </View>
                )}
              </ThemedButton>
            )}
          </View>
        </View>

        <View style={styles.linksContainer}>
          <View style={styles.linkItem}>
            <ThemedText style={styles.linkText}>
              Don&apos;t have an account?{" "}
            </ThemedText>

            <Link href="/sign-up">
              <ThemedText type="link" style={styles.signUpLink}>
                Sign up
              </ThemedText>
            </Link>
          </View>

          <View style={styles.linkItem}>
            <ThemedText style={styles.linkText}>
              Forgot your password?{" "}
            </ThemedText>

            <Link href="/password-reset">
              <ThemedText type="link" style={styles.signUpLink}>
                Reset password
              </ThemedText>
            </Link>
          </View>
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
  },
  title: {
    marginBottom: 32,
    textAlign: "center",
  },
  formContainer: {
    gap: 16,
  },
  fieldsContainer: {
    gap: 4,
  },
  buttonsContainer: {
    gap: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 50,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  validationErrorText: {
    marginLeft: 10,
    color: "#ef4444",
    fontSize: 12,
    lineHeight: 20,
  },
  hiddenError: {
    opacity: 0,
  },
  clerkErrorContainer: {
    minHeight: 20,
    marginTop: -10,
    marginBottom: -10,
  },
  clerkErrorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  linksContainer: {
    marginTop: 20,
    gap: 8,
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
  },
  biometricButton: {
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
