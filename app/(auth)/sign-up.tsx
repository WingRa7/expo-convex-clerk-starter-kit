import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import * as yup from "yup";

const signUpInitialValues = {
  email: "",
  password: "",
  username: "",
  firstName: "",
  lastName: "",
};

const signUpValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  username: yup
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),
  firstName: yup
    .string()
    // .optional()
    .required("First name is required"),
  lastName: yup
    .string()
    // .optional()
    .required("Last name is required"),
});

const verificationInitialValues = {
  code: "",
};

const verificationValidationSchema = yup.object().shape({
  code: yup.string().required("Please input a verification code"),
});

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [clerkError, setClerkError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "#E0E0E0", dark: "#333" }, "text");
  const placeholderColor = useThemeColor(
    { light: "#999", dark: "#666" },
    "icon"
  );

  // Formik instance for sign-up form
  const signUpFormik = useFormik({
    initialValues: signUpInitialValues,
    validationSchema: signUpValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await onSignUpPress(values);
    },
  });

  // Formik instance for verification form
  const verificationFormik = useFormik({
    initialValues: verificationInitialValues,
    validationSchema: verificationValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await onVerifyPress(values.code);
    },
  });
  // TODO repeat password field and logic
  const onSignUpPress = async (values: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
  }) => {
    if (!isLoaded || isLoading) return;

    setClerkError("");
    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
        username: values.username,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
      setClerkError("");
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "An error occurred during sign up. Please try again.";
      setClerkError(errorMessage);
      console.error("Sign up error:", JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async (code: string) => {
    if (!isLoaded || isLoading) return;

    setClerkError("");
    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        setClerkError("Verification could not be completed. Please try again.");
        console.error("Sign up error:", JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "An error occurred during verification. Please try again.";
      setClerkError(errorMessage);
      console.error("Verification error:", JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Verify your email
          </ThemedText>
          <ThemedText style={styles.verificationText}>
            We&apos;ve sent a verification code to your email address.
          </ThemedText>
          <View style={styles.formContainer}>
            <View style={styles.fieldsContainer}>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor, backgroundColor },
                  verificationFormik.touched.code &&
                    verificationFormik.errors.code &&
                    styles.inputError,
                ]}
                value={verificationFormik.values.code}
                placeholder="Enter your verification code"
                placeholderTextColor={placeholderColor}
                onChangeText={verificationFormik.handleChange("code")}
                onBlur={verificationFormik.handleBlur("code")}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                editable={!isLoading}
              />
              <ThemedText
                style={[
                  styles.validationErrorText,
                  verificationFormik.touched.code &&
                    verificationFormik.errors.code &&
                    styles.hiddenError,
                ]}
              >
                {verificationFormik.errors.code}
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

            <ThemedButton
              onPress={() => verificationFormik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </ThemedButton>
          </View>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Sign up
        </ThemedText>

        <View style={styles.formContainer}>
          <View style={styles.fieldsContainer}>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                signUpFormik.touched.email &&
                  signUpFormik.errors.email &&
                  styles.inputError,
              ]}
              autoCapitalize="none"
              placeholder="Enter email"
              placeholderTextColor={placeholderColor}
              value={signUpFormik.values.email}
              onChangeText={signUpFormik.handleChange("email")}
              onBlur={signUpFormik.handleBlur("email")}
              keyboardType="email-address"
              autoComplete="email"
              editable={!isLoading}
            />
            <ThemedText
              style={[
                styles.validationErrorText,
                !(signUpFormik.touched.email && signUpFormik.errors.email) &&
                  styles.hiddenError,
              ]}
            >
              {signUpFormik.errors.email}
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                signUpFormik.touched.password &&
                  signUpFormik.errors.password &&
                  styles.inputError,
              ]}
              placeholder="Enter password"
              placeholderTextColor={placeholderColor}
              secureTextEntry={true}
              value={signUpFormik.values.password}
              onChangeText={signUpFormik.handleChange("password")}
              onBlur={signUpFormik.handleBlur("password")}
              autoComplete="password"
              editable={!isLoading}
            />
            <ThemedText
              style={[
                styles.validationErrorText,
                !(
                  signUpFormik.touched.password && signUpFormik.errors.password
                ) && styles.hiddenError,
              ]}
            >
              {signUpFormik.errors.password}
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                signUpFormik.touched.username &&
                  signUpFormik.errors.username &&
                  styles.inputError,
              ]}
              autoCapitalize="none"
              placeholder="Enter username"
              placeholderTextColor={placeholderColor}
              value={signUpFormik.values.username}
              onChangeText={signUpFormik.handleChange("username")}
              onBlur={signUpFormik.handleBlur("username")}
              autoComplete="username"
              editable={!isLoading}
            />
            <ThemedText
              style={[
                styles.validationErrorText,
                !(
                  signUpFormik.touched.username && signUpFormik.errors.username
                ) && styles.hiddenError,
              ]}
            >
              {signUpFormik.errors.username}
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                signUpFormik.touched.firstName &&
                  signUpFormik.errors.firstName &&
                  styles.inputError,
              ]}
              autoCapitalize="words"
              placeholder="Enter first name (optional)"
              placeholderTextColor={placeholderColor}
              value={signUpFormik.values.firstName}
              onChangeText={signUpFormik.handleChange("firstName")}
              onBlur={signUpFormik.handleBlur("firstName")}
              autoComplete="given-name"
              editable={!isLoading}
            />
            <ThemedText
              style={[
                styles.validationErrorText,
                !(
                  signUpFormik.touched.firstName &&
                  signUpFormik.errors.firstName
                ) && styles.hiddenError,
              ]}
            >
              {signUpFormik.errors.firstName}
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                signUpFormik.touched.lastName &&
                  signUpFormik.errors.lastName &&
                  styles.inputError,
              ]}
              autoCapitalize="words"
              placeholder="Enter last name (optional)"
              placeholderTextColor={placeholderColor}
              value={signUpFormik.values.lastName}
              onChangeText={signUpFormik.handleChange("lastName")}
              onBlur={signUpFormik.handleBlur("lastName")}
              autoComplete="family-name"
              editable={!isLoading}
            />
            <ThemedText
              style={[
                styles.validationErrorText,
                !(
                  signUpFormik.touched.lastName && signUpFormik.errors.lastName
                ) && styles.hiddenError,
              ]}
            >
              {signUpFormik.errors.lastName || ""}
            </ThemedText>
          </View>
        </View>

        <ThemedText
          style={[styles.clerkErrorText, !clerkError && styles.hiddenError]}
        >
          {clerkError || ""}
        </ThemedText>

        <ThemedButton
          onPress={() => signUpFormik.handleSubmit()}
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Continue"}
        </ThemedButton>
        <View style={styles.linkContainer}>
          <ThemedText style={styles.linkText}>
            Already have an account?{" "}
          </ThemedText>
          <Link href="/sign-in">
            <ThemedText type="link" style={styles.signInLink}>
              Sign in
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
  },
  title: {
    marginBottom: 32,
    textAlign: "center",
  },
  verificationText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  formContainer: {
    gap: 16,
  },
  fieldsContainer: {
    gap: 4,
  },
  buttonsContainer: {
    gap: 12,
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
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
  },
});
