import { useEffect } from "react";
import AnimatedBlob from "@/components/AnimatedBlob";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { Link, useRouter } from "expo-router";
import { T } from "gt-react-native";

// Module-level variable to track if we've already performed the initial redirect.
// This survives GTProvider unmounts/remounts within the same app session.
let initialRedirectDone = false;

export default function WelcomePage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();

  useEffect(() => {
    // If authenticated and we haven't done our one-time redirect yet, do it now.
    if (isAuthenticated && !isLoading && user !== undefined && !initialRedirectDone) {
      initialRedirectDone = true;
      if (user && !user.onboardingCompleted) {
        router.replace("/onboarding");
      } else {
        router.replace("/(home)/(tabs)/");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Reset the flag if the user signs out, so it can fire again on next sign-in.
  useEffect(() => {
    if (!isAuthenticated) {
      initialRedirectDone = false;
    }
  }, [isAuthenticated]);

  // If authenticated, we show a themed background View while the router handles 
  // the initial redirect or the deep-link recovery.
  if (isAuthenticated && !isLoading && user !== undefined) {
    return <View className="flex-1 bg-background" />;
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
