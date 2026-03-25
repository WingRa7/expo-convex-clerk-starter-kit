import AnimatedBlob from "@/components/AnimatedBlob";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { Link, Redirect } from "expo-router";
import { T } from "gt-react-native";

export default function WelcomePage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);

  if (isAuthenticated && !isLoading && user !== undefined) {
    if (user && !user.onboardingCompleted) {
      return <Redirect href="/onboarding" />;
    }
    return <Redirect href="/(home)/(tabs)/" />;
  }

  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <View className="absolute top-20 opacity-50">
        <AnimatedBlob size={400} />
      </View>

      <View className="w-full max-w-[400px] items-center gap-12 z-10">
        <View className="items-center gap-4">
          <T>
            <Text className="text-5xl font-extrabold text-center tracking-tight text-foreground">
              Expo Starter-kit
            </Text>
          </T>
          <T>
            <Text className="text-lg text-center opacity-60 px-4 text-foreground">
              Your minimal accountability companion for better habits.
            </Text>
          </T>
        </View>

        <View className="w-full gap-4">
          <Link href="/(auth)/sign-in" asChild>
            <Button className="h-14">
              <Text className="font-bold">Sign in</Text>
            </Button>
          </Link>
          <Link href="/(auth)/sign-up" asChild>
            <Button variant="outline" className="h-14">
              <Text className="font-bold">Create account</Text>
            </Button>
          </Link>
        </View>
      </View>
    </View>
  );
}
