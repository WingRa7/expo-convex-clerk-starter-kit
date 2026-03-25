import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { FormikField } from "@/components/ui/FormikField";
import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useFormik, FormikProvider } from "formik";
import { useState } from "react";
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
      if (err?.errors?.some((e: any) => e.code === "session_exists")) {
        console.log("✅ Session already exists (password-reset)");
        return;
      }

      console.error("Reset password error:", JSON.stringify(err, null, 2));
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Failed to reset password";
      setClerkError(errorMessage);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-background p-5">
      <View className="w-full max-w-[400px]">
        <Text type="title" className="mb-8 text-center">
          Forgot Password?
        </Text>
        
        <View className="gap-4">
          {!successfulCreation && (
            <FormikProvider value={emailFormik}>
              <View className="gap-4">
                <Text className="text-base mb-2">
                  Provide your email address
                </Text>
                
                <FormikField
                  name="email"
                  placeholder="e.g myname@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />

                {clerkError ? (
                  <Text className="text-danger text-sm text-center leading-5 -mt-2">
                    {clerkError}
                  </Text>
                ) : null}

                <Button onPress={() => emailFormik.handleSubmit()}>
                  Send password reset code
                </Button>
              </View>
            </FormikProvider>
          )}

          {successfulCreation && (
            <FormikProvider value={resetFormik}>
              <View className="gap-4">
                <Text className="text-base mb-2">
                  Enter your new password
                </Text>
                
                <FormikField
                  name="password"
                  placeholder="Enter new password"
                  secureTextEntry={true}
                  autoComplete="password-new"
                />

                <Text className="text-base mt-2 mb-2">
                  Enter the password reset code that was sent to your email
                </Text>
                
                <FormikField
                  name="code"
                  placeholder="Enter code"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />

                {clerkError ? (
                  <Text className="text-danger text-sm text-center leading-5 -mt-2">
                    {clerkError}
                  </Text>
                ) : null}

                <Button onPress={() => resetFormik.handleSubmit()}>
                  Reset
                </Button>
              </View>
            </FormikProvider>
          )}

          {secondFactor && (
            <Text className="text-danger text-sm text-center mt-2">
              2FA is required, but this UI does not handle that
            </Text>
          )}

          <View className="flex-row justify-center items-center mt-2">
            <Link href="/(auth)/sign-in">
              <Text type="link" className="text-sm">
                Back to sign in
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
