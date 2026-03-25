import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useFormik, FormikProvider } from "formik";
import { useState } from "react";
import * as yup from "yup";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { FormikField } from "@/components/ui/FormikField";

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

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleChangePassword(values);
    },
  });

  const handleChangePassword = async (values: typeof initialValues) => {
    if (!isLoaded || !user) {
      setClerkError("User not loaded. Please try again.");
      return;
    }

    setClerkError("");
    setIsLoading(true);

    try {
      await user?.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

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
    <View className="flex-1 justify-center items-center bg-background p-5">
      <View className="w-full max-w-[400px]">
        <Text type="title" className="mb-8 text-center">
          Change Password
        </Text>

        <FormikProvider value={formik}>
          <View className="gap-4">
            <View className="gap-1">
              <Text className="text-base mb-2">Current Password</Text>
              <FormikField
                name="currentPassword"
                placeholder="Enter current password"
                secureTextEntry
                autoComplete="password"
                editable={!isLoading}
              />

              <Text className="text-base mt-2 mb-2">New Password</Text>
              <FormikField
                name="newPassword"
                placeholder="Enter new password"
                secureTextEntry
                autoComplete="password-new"
                editable={!isLoading}
              />

              <Text className="text-base mt-2 mb-2">Confirm New Password</Text>
              <FormikField
                name="confirmPassword"
                placeholder="Confirm new password"
                secureTextEntry
                autoComplete="password-new"
                editable={!isLoading}
              />
            </View>

            {clerkError ? (
              <Text className="text-danger text-sm text-center leading-5 -mt-2">
                {clerkError}
              </Text>
            ) : null}

            <View className="gap-3 mt-4">
              <Button
                onPress={() => formik.handleSubmit()}
                disabled={isLoading}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>

              <Button
                onPress={() => router.back()}
                variant="ghost"
              >
                Cancel
              </Button>
            </View>
          </View>
        </FormikProvider>
      </View>
    </View>
  );
}
