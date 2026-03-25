import { Stack, Redirect } from "expo-router";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ActivityIndicator } from "react-native";

export default function AuthLayout() {
  return (
    <>
      <Authenticated>
        <Redirect href={"/(home)/(tabs)/"} />
      </Authenticated>
      <AuthLoading>
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      </AuthLoading>
      <Unauthenticated>
        <Stack>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen
            name="password-reset"
            options={{ headerShown: false }}
          />
        </Stack>
      </Unauthenticated>
    </>
  );
}
