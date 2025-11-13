import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import * as yup from "yup";

import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/use-theme-color";

import { usePasswordVerification } from "@/hooks/usePasswordVerification";

const initialValues = {
  newUsername: "",
  currentPassword: "",
};

const validationSchema = yup.object().shape({
  currentPassword: yup.string().required("Password is required"),
  newUsername: yup
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),
});

export default function ChangeUsername() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [clerkError, setClerkError] = useState("");
  const {
    verify,
    isVerifying,
    error: verificationError,
    clearError,
  } = usePasswordVerification();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "#E0E0E0", dark: "#333" }, "text");
  const placeholderTextColor = useThemeColor(
    { light: "#999", dark: "#666" },
    "icon"
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleChangeUsername(values);
    },
  });

  const handleChangeUsername = async (values: {
    newUsername: string;
    currentPassword: string;
  }) => {
    if (!isLoaded || !user) {
      return;
    }

    setClerkError("");
    clearError();

    const isPasswordValid = await verify(values.currentPassword);

    if (!isPasswordValid) {
      return;
    }

    try {
      await user?.update({
        username: values.newUsername,
      });
      await user.reload();
      router.back();
      // TODO: Add a success message to the user, toast
    } catch (err: any) {
      console.error("Change username error:", JSON.stringify(err, null, 2));
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Failed to change username";
      setClerkError(errorMessage);
    }
  };

  const displayError = clerkError || verificationError; // TODO modify other error displays to follow this logic
  const isLoading = formik.isSubmitting || isVerifying;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Change Username
        </ThemedText>

        <View style={styles.formContainer}>
          <View style={styles.fieldsContainer}>
            <ThemedText style={styles.label}>New Username</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                formik.touched.newUsername &&
                  formik.errors.newUsername &&
                  styles.inputError,
              ]}
              value={formik.values.newUsername}
              onChangeText={formik.handleChange("newUsername")}
              onBlur={formik.handleBlur("newUsername")}
              placeholder="Enter new username"
              placeholderTextColor={placeholderTextColor}
              editable={!isLoading}
            />
            <ThemedText
              style={[
                styles.validationErrorText,
                !(formik.touched.newUsername && formik.errors.newUsername) &&
                  styles.hiddenError,
              ]}
            >
              {formik.errors.newUsername || ""}
            </ThemedText>

            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                formik.touched.currentPassword &&
                  formik.errors.currentPassword &&
                  styles.inputError,
              ]}
              value={formik.values.currentPassword}
              onChangeText={formik.handleChange("currentPassword")}
              onBlur={formik.handleBlur("currentPassword")}
              placeholder="Enter your password"
              placeholderTextColor={placeholderTextColor}
              secureTextEntry
              autoComplete="off" // TODO add this to stop Password manager pop up on other user admin actions
              editable={!isLoading}
            />
            <ThemedText
              style={[
                styles.validationErrorText,
                !(
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                ) && styles.hiddenError,
              ]}
            >
              {formik.errors.currentPassword || ""}
            </ThemedText>
          </View>

          <View style={styles.clerkErrorContainer}>
            <ThemedText
              style={[
                styles.clerkErrorText,
                !displayError && styles.hiddenError,
              ]}
            >
              {displayError || ""}
            </ThemedText>
          </View>

          <View style={styles.buttonsContainer}>
            <ThemedButton
              onPress={() => formik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? "Changing..." : "Change Username"}
            </ThemedButton>

            <ThemedButton
              onPress={() => router.back()}
              style={styles.cancelButton}
              lightBackgroundColor="#f0f0f0"
              darkBackgroundColor="#333"
            >
              Cancel
            </ThemedButton>
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
    gap: 12,
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
  cancelButton: {
    marginTop: 8,
  },
});
