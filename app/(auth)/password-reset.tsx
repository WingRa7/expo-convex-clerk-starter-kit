import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import * as yup from "yup";

const emailInitialValues = {
  email: "",
};

const emailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

const resetInitialValues = {
  password: "",
  code: "",
};

const resetValidationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  code: yup.string().required("Verification code is required"),
});

export default function PasswordResetPage() {
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [clerkError, setClerkError] = useState("");

  const { isLoaded, signIn, setActive } = useSignIn();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "#E0E0E0", dark: "#333" }, "text");
  const placeholderTextColor = useThemeColor(
    { light: "#999", dark: "#666" },
    "icon"
  );

  // Formik instance for email entry form
  const emailFormik = useFormik({
    initialValues: emailInitialValues,
    validationSchema: emailValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await createPasswordResetCode(values.email);
    },
  });

  // Formik instance for password reset form
  const resetFormik = useFormik({
    initialValues: resetInitialValues,
    validationSchema: resetValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await resetPassword(values.password, values.code);
    },
  });

  if (!isLoaded) {
    return null;
  }

  // Send the password reset code to the user's email
  const createPasswordResetCode = async (email: string) => {
    if (!isLoaded || !signIn) {
      return;
    }

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      setClerkError("");
    } catch (err: any) {
      console.error("Reset password error:", JSON.stringify(err, null, 2));
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Failed to send reset code";
      setClerkError(errorMessage);
    }
  };

  const resetPassword = async (password: string, code: string) => {
    if (!isLoaded || !signIn) {
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        setClerkError("");
      } else if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });
        setClerkError("");
      } else {
        console.error("Reset password error:", JSON.stringify(result, null, 2));
        setClerkError("Unexpected status: " + result.status);
      }
    } catch (err: any) {
      console.error("Reset password error:", JSON.stringify(err, null, 2));
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Failed to reset password";
      setClerkError(errorMessage);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Forgot Password?
        </ThemedText>
        <View style={styles.formContainer}>
          {!successfulCreation && (
            <>
              <ThemedText style={styles.label}>
                Provide your email address
              </ThemedText>
              <View style={styles.fieldsContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { color: textColor, borderColor, backgroundColor },
                    emailFormik.touched.email &&
                      emailFormik.errors.email &&
                      styles.inputError,
                  ]}
                  value={emailFormik.values.email}
                  onChangeText={emailFormik.handleChange("email")}
                  onBlur={emailFormik.handleBlur("email")}
                  placeholder="e.g myname@email.com"
                  placeholderTextColor={placeholderTextColor}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
                <ThemedText
                  style={[
                    styles.validationErrorText,
                    !(emailFormik.touched.email && emailFormik.errors.email) &&
                      styles.hiddenError,
                  ]}
                >
                  {emailFormik.errors.email || ""}
                </ThemedText>
              </View>

              <View style={styles.clerkErrorContainer}>
                <ThemedText
                  style={[
                    styles.clerkErrorText,
                    !clerkError && styles.hiddenError,
                  ]}
                >
                  {clerkError || ""}
                </ThemedText>
              </View>

              <ThemedButton onPress={() => emailFormik.handleSubmit()}>
                Send password reset code
              </ThemedButton>
            </>
          )}

          {successfulCreation && (
            <>
              <ThemedText style={styles.label}>
                Enter your new password
              </ThemedText>
              <View style={styles.fieldsContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { color: textColor, borderColor, backgroundColor },
                    resetFormik.touched.password &&
                      resetFormik.errors.password &&
                      styles.inputError,
                  ]}
                  value={resetFormik.values.password}
                  onChangeText={resetFormik.handleChange("password")}
                  onBlur={resetFormik.handleBlur("password")}
                  placeholder="Enter new password"
                  placeholderTextColor={placeholderTextColor}
                  secureTextEntry={true}
                  autoComplete="password-new"
                />
                <ThemedText
                  style={[
                    styles.validationErrorText,
                    !(
                      resetFormik.touched.password &&
                      resetFormik.errors.password
                    ) && styles.hiddenError,
                  ]}
                >
                  {resetFormik.errors.password || ""}
                </ThemedText>

                <ThemedText style={styles.label}>
                  Enter the password reset code that was sent to your email
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { color: textColor, borderColor, backgroundColor },
                    resetFormik.touched.code &&
                      resetFormik.errors.code &&
                      styles.inputError,
                  ]}
                  value={resetFormik.values.code}
                  onChangeText={resetFormik.handleChange("code")}
                  onBlur={resetFormik.handleBlur("code")}
                  placeholder="Enter code"
                  placeholderTextColor={placeholderTextColor}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />
                <ThemedText
                  style={[
                    styles.validationErrorText,
                    !(resetFormik.touched.code && resetFormik.errors.code) &&
                      styles.hiddenError,
                  ]}
                >
                  {resetFormik.errors.code || ""}
                </ThemedText>
              </View>
              <View style={styles.clerkErrorContainer}>
                <ThemedText
                  style={[
                    styles.clerkErrorText,
                    !clerkError && styles.hiddenError,
                  ]}
                >
                  {clerkError || ""}
                </ThemedText>
              </View>
              <ThemedButton onPress={() => resetFormik.handleSubmit()}>
                Reset
              </ThemedButton>
            </>
          )}

          {secondFactor && (
            <ThemedText style={styles.error}>
              2FA is required, but this UI does not handle that
            </ThemedText>
          )}

          <View style={styles.linkContainer}>
            <Link href="/(auth)/sign-in">
              <ThemedText type="link" style={styles.signUpLink}>
                Back to sign in
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
  label: {
    fontSize: 16,
    marginBottom: 8,
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
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
  },
  error: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});
