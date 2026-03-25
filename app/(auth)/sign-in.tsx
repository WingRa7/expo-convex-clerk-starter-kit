import { Link } from "expo-router";
import { useState } from "react";

import { useSignIn } from "@clerk/clerk-expo";
import { useLocalCredentials } from "@clerk/clerk-expo/local-credentials";

import { useFormik, FormikProvider } from "formik";
import * as yup from "yup";

import SignInWithGoogle from "@/components/SignInWithGoogle";

import { IconSymbol } from "@/components/ui/IconSymbol";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { FormikField } from "@/components/ui/FormikField";

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
        setClerkError("Email Sign in could not be completed.");
        console.error(
          "Email Sign in status not complete:",
          JSON.stringify(signInAttempt, null, 2),
        );
      }
    } catch (err: any) {
      if (err?.errors?.some((e: any) => e.code === "session_exists")) {
        console.log("✅ Session already exists (sign-in)");
        return;
      }

      if (err?.errors) {
        const fieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];

        err.errors.forEach((e: any) => {
          let fieldName = e.meta?.paramName;

          if (fieldName === "identifier" || fieldName === "email_address")
            fieldName = "email";

          if (fieldName && Object.keys(initialValues).includes(fieldName)) {
            fieldErrors[fieldName] = e.longMessage || e.message;
          } else {
            generalErrors.push(e.longMessage || e.message);
          }
        });

        if (Object.keys(fieldErrors).length > 0) {
          formik.setErrors(fieldErrors);
        }

        if (generalErrors.length > 0) {
          setClerkError(generalErrors.join("\n"));
        } else {
          setClerkError("");
        }
      } else {
        setClerkError(
          err?.message || "An error occurred during email sign in.",
        );
      }

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
        console.log("✅ Session activated (biometric)");
      } else {
        setClerkError("Sign in could not be completed. Please try again");
        console.error(
          "Biometric sign in status not complete:",
          JSON.stringify(signInAttempt, null, 2),
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
    <View className="flex-1 justify-center items-center bg-background p-5">
      <View className="w-full max-w-[400px]">
        <Text type="title" className="mb-8 text-center">
          Sign in
        </Text>

        <FormikProvider value={formik}>
          <View className="gap-4">
            <View className="gap-1">
              <FormikField
                name="email"
                placeholder="Enter email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!isLoading}
              />

              <FormikField
                name="password"
                placeholder="Enter password"
                secureTextEntry={true}
                autoComplete="password"
                editable={!isLoading}
              />
            </View>

            {clerkError ? (
              <View className="min-h-[20px] -mt-2 -mb-2">
                <Text className="text-danger text-sm text-center leading-5">
                  {clerkError}
                </Text>
              </View>
            ) : null}

            <View className="gap-5">
              <Button
                onPress={() => formik.handleSubmit()}
                disabled={isLoading}
              >
                Sign in with email
              </Button>

              <SignInWithGoogle />

              {hasCredentials && biometricType && (
                <Button
                  onPress={handleBiometricSignIn}
                  disabled={isLoading}
                  variant="outline"
                >
                  {biometricType === "face-recognition" ? (
                    <View className="flex-col items-center gap-1">
                      <IconSymbol
                        name="faceid"
                        size={40}
                        weight="regular"
                        color="currentColor"
                        className="text-foreground"
                      />

                      <Text className="text-base font-semibold">
                        Sign in with Face ID
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <IconSymbol
                        name="touchid"
                        size={18}
                        weight="regular"
                        color="currentColor"
                        className="text-foreground"
                      />

                      <Text className="text-base font-semibold">
                        Sign in with Touch ID
                      </Text>
                    </View>
                  )}
                </Button>
              )}
            </View>
          </View>
        </FormikProvider>

        <View className="mt-5 gap-2">
          <View className="flex-row justify-center items-center">
            <Text className="text-sm">Don&apos;t have an account? </Text>

            <Link href="/sign-up">
              <Text type="link" className="text-sm">
                Sign up
              </Text>
            </Link>
          </View>

          <View className="flex-row justify-center items-center">
            <Text className="text-sm">Forgot your password? </Text>

            <Link href="/password-reset">
              <Text type="link" className="text-sm">
                Reset password
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
