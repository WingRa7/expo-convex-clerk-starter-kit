import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { FormikField } from "@/components/ui/FormikField";
import { useSignUp } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { FormikProvider, useFormik } from "formik";
import { useState } from "react";
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
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});

const verificationInitialValues = {
  code: "",
};

const verificationValidationSchema = yup.object().shape({
  code: yup.string().required("Please input a verification code"),
});

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [clerkError, setClerkError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const onSignUpPress = async (values: typeof signUpInitialValues) => {
    if (!isLoaded || isLoading) return;

    setClerkError("");
    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
      setClerkError("");
    } catch (err: any) {
      if (err?.errors) {
        const fieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];

        err.errors.forEach((e: any) => {
          let fieldName = e.meta?.paramName;
          if (fieldName === "email_address") fieldName = "email";

          if (
            fieldName &&
            Object.keys(signUpInitialValues).includes(fieldName)
          ) {
            fieldErrors[fieldName] = e.longMessage || e.message;
          } else {
            generalErrors.push(e.longMessage || e.message);
          }
        });

        if (Object.keys(fieldErrors).length > 0) {
          signUpFormik.setErrors(fieldErrors);
        }

        if (generalErrors.length > 0) {
          setClerkError(generalErrors.join("\n"));
        } else {
          setClerkError("");
        }
      } else {
        setClerkError(
          err?.message || "An error occurred during sign up. Please try again.",
        );
      }
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
      if (err?.errors?.some((e: any) => e.code === "session_exists")) {
        console.log("✅ Session already exists (sign-up)");
        return;
      }

      if (err?.errors) {
        const fieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];

        err.errors.forEach((e: any) => {
          let fieldName = e.meta?.paramName;

          if (
            fieldName &&
            Object.keys(verificationInitialValues).includes(fieldName)
          ) {
            fieldErrors[fieldName] = e.longMessage || e.message;
          } else {
            generalErrors.push(e.longMessage || e.message);
          }
        });

        if (Object.keys(fieldErrors).length > 0) {
          verificationFormik.setErrors(fieldErrors);
        }

        if (generalErrors.length > 0) {
          setClerkError(generalErrors.join("\n"));
        } else {
          setClerkError("");
        }
      } else {
        setClerkError(
          err?.message ||
            "An error occurred during verification. Please try again.",
        );
      }
      console.error("Verification error:", JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-5">
        <View className="w-full max-w-[400px]">
          <Text type="title" className="mb-2 text-center">
            Verify your email
          </Text>
          <Text className="text-sm text-center mb-6 opacity-70">
            We&apos;ve sent a verification code to your email address.
          </Text>

          <FormikProvider value={verificationFormik}>
            <View className="gap-4">
              <FormikField
                name="code"
                placeholder="Enter your verification code"
                keyboardType="number-pad"
                autoComplete="one-time-code"
                editable={!isLoading}
              />

              {clerkError ? (
                <Text className="text-danger text-sm text-center leading-5 -mt-2">
                  {clerkError}
                </Text>
              ) : null}

              <Button
                onPress={() => verificationFormik.handleSubmit()}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </View>
          </FormikProvider>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-background p-5">
      <View className="w-full max-w-[400px]">
        <Text type="title" className="mb-8 text-center">
          Sign up
        </Text>

        <FormikProvider value={signUpFormik}>
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

              <FormikField
                name="username"
                placeholder="Enter username"
                autoCapitalize="none"
                autoComplete="username"
                editable={!isLoading}
              />

              <FormikField
                name="firstName"
                placeholder="Enter first name"
                autoCapitalize="words"
                autoComplete="given-name"
                editable={!isLoading}
              />

              <FormikField
                name="lastName"
                placeholder="Enter last name"
                autoCapitalize="words"
                autoComplete="family-name"
                editable={!isLoading}
              />
            </View>

            {clerkError ? (
              <Text className="text-danger text-sm text-center leading-5 -mt-2">
                {clerkError}
              </Text>
            ) : null}

            <Button
              onPress={() => signUpFormik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Continue"}
            </Button>

            <View className="flex-row justify-center items-center mt-5">
              <Text className="text-sm">
                Already have an account?{" "}
              </Text>
              <Link href="/sign-in">
                <Text type="link" className="text-sm">
                  Sign in
                </Text>
              </Link>
            </View>
          </View>
        </FormikProvider>
      </View>
    </View>
  );
}
