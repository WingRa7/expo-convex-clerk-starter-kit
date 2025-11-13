import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="change-password"
        options={{
          headerShown: false,
          title: "Change Password",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="(modals)"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
    </Stack>
  );
}
