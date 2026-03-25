import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useFormik, FormikProvider } from "formik";
import { useState } from "react";
import * as yup from "yup";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { FormikField } from "@/components/ui/FormikField";

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

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleChangeUsername(values);
    },
  });

  const handleChangeUsername = async (values: typeof initialValues) => {
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
    } catch (err: any) {
      console.error("Change username error:", JSON.stringify(err, null, 2));
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Failed to change username";
      setClerkError(errorMessage);
    }
  };

  const displayError = clerkError || verificationError;
  const isLoading = formik.isSubmitting || isVerifying;

  return (
    <View className="flex-1 justify-center items-center bg-background p-5">
      <View className="w-full max-w-[400px]">
        <Text type="title" className="mb-8 text-center">
          Change Username
        </Text>

        <FormikProvider value={formik}>
          <View className="gap-4">
            <View className="gap-1">
              <Text className="text-base mb-2">New Username</Text>
              <FormikField
                name="newUsername"
                placeholder="Enter new username"
                autoComplete="username"
                editable={!isLoading}
              />

              <Text className="text-base mt-2 mb-2">Password</Text>
              <FormikField
                name="currentPassword"
                placeholder="Enter password"
                secureTextEntry
                autoComplete="off"
                editable={!isLoading}
              />
            </View>

            {displayError ? (
              <Text className="text-danger text-sm text-center leading-5 -mt-2">
                {displayError}
              </Text>
            ) : null}

            <View className="gap-3 mt-4">
              <Button
                onPress={() => formik.handleSubmit()}
                disabled={isLoading}
              >
                {isLoading ? "Changing..." : "Change Username"}
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
