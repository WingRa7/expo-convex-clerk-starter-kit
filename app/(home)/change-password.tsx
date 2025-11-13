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

const initialValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const validationSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "New passwords do not match")
    .required("Please confirm your new password"),
});

export default function ChangePassword() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [clerkError, setClerkError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      await handleChangePassword(values);
    },
  });

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!isLoaded || !user) {
      setClerkError("User not loaded. Please try again.");
      return;
    }

    setClerkError("");
    setIsLoading(true);

    try {
      await user?.updatePassword({
        // TODO update password logic, update credentials?
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      // Success - go back
      // TODO: Add a success message to the user
      router.back();
    } catch (err: any) {
      console.error("Change password error:", JSON.stringify(err, null, 2));
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Failed to change password";
      setClerkError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Change Password
        </ThemedText>

        <View style={styles.formContainer}>
          <View style={styles.fieldsContainer}>
            <ThemedText style={styles.label}>Current Password</ThemedText>
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
              placeholder="Enter current password"
              placeholderTextColor={placeholderTextColor}
              secureTextEntry
              autoComplete="password"
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

            <ThemedText style={styles.label}>New Password</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                formik.touched.newPassword &&
                  formik.errors.newPassword &&
                  styles.inputError,
              ]}
              value={formik.values.newPassword}
              onChangeText={formik.handleChange("newPassword")}
              onBlur={formik.handleBlur("newPassword")}
              placeholder="Enter new password"
              placeholderTextColor={placeholderTextColor}
              secureTextEntry
              autoComplete="password-new"
              editable={!isLoading}
            />
            <ThemedText
              style={[
                styles.validationErrorText,
                !(formik.touched.newPassword && formik.errors.newPassword) &&
                  styles.hiddenError,
              ]}
            >
              {formik.errors.newPassword || ""}
            </ThemedText>

            <ThemedText style={styles.label}>Confirm New Password</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor, backgroundColor },
                formik.touched.confirmPassword &&
                  formik.errors.confirmPassword &&
                  styles.inputError,
              ]}
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange("confirmPassword")}
              onBlur={formik.handleBlur("confirmPassword")}
              placeholder="Confirm new password"
              placeholderTextColor={placeholderTextColor}
              secureTextEntry
              autoComplete="password-new"
              editable={!isLoading}
            />
            <ThemedText
              style={[
                styles.validationErrorText,
                !(
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                ) && styles.hiddenError,
              ]}
            >
              {formik.errors.confirmPassword || ""}
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
              {isLoading ? "Changing..." : "Change Password"}
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
