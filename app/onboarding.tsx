import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T } from "gt-react-native";
import { ArrowRight, CheckCircle, Search, Trophy } from "lucide-react-native";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      await completeOnboarding();
      router.replace("/(home)/(tabs)/" as any);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      router.replace("/(home)/(tabs)/" as any);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View className="flex-1 items-center justify-between py-5">
            <View className="items-center w-full mt-5">
              <T>
                <Text className="text-3xl text-center font-bold mb-3 text-foreground">
                  Welcome to Amigo
                </Text>
              </T>
              <T>
                <Text className="text-base text-center opacity-70 leading-6 text-foreground">
                  Placeholder description for the first step of onboarding.
                </Text>
              </T>
            </View>
            
            <View className="flex-1 w-full items-center justify-center">
              <Trophy size={120} color="#2696DE" />
            </View>

            <View className="w-full gap-3">
              <Button onPress={handleNext}>
                Get Started
              </Button>
              <Button variant="outline" onPress={handleFinish}>
                Skip Tutorial
              </Button>
            </View>
          </View>
        );
      case 1:
        return (
          <View className="flex-1 items-center justify-between py-5">
            <View className="items-center w-full mt-5">
              <T>
                <Text className="text-3xl text-center font-bold mb-3 text-foreground">
                  Feature One
                </Text>
              </T>
              <T>
                <Text className="text-base text-center opacity-70 leading-6 text-foreground">
                  Placeholder description for the second step of onboarding.
                </Text>
              </T>
            </View>
            
            <View className="flex-1 w-full items-center justify-center">
              <CheckCircle size={100} color="#22c55e" />
            </View>

            <Button onPress={handleNext} className="w-full">
              Next
            </Button>
          </View>
        );
      case 2:
        return (
          <View className="flex-1 items-center justify-between py-5">
            <View className="items-center w-full mt-5">
              <T>
                <Text className="text-3xl text-center font-bold mb-3 text-foreground">
                  Feature Two
                </Text>
              </T>
              <T>
                <Text className="text-base text-center opacity-70 leading-6 text-foreground">
                  Placeholder description for the third step of onboarding.
                </Text>
              </T>
            </View>

            <View className="flex-1 w-full items-center justify-center">
              <Search size={100} color="#ef4444" />
            </View>

            <Button onPress={handleNext} className="w-full">
              Next
            </Button>
          </View>
        );
      case 3:
        return (
          <View className="flex-1 items-center justify-between py-5">
            <View className="items-center w-full mt-5">
              <T>
                <Text className="text-3xl text-center font-bold mb-3 text-foreground">
                  Ready to Go!
                </Text>
              </T>
              <T>
                <Text className="text-base text-center opacity-70 leading-6 text-foreground">
                  Placeholder description for the final step of onboarding.
                </Text>
              </T>
            </View>

            <View className="flex-1 w-full items-center justify-center">
              <ArrowRight size={100} color="#2696DE" />
            </View>

            <Button onPress={handleFinish} className="w-full">
              Start My Journey
            </Button>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View 
      className="flex-1 px-6 bg-background" 
      style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 10 }}
    >
      <View className="flex-1">
        {renderStep()}
      </View>
      
      <View className="h-[60px] items-center justify-center">
        <View className="flex-row gap-[10px]">
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              className={`h-[10px] rounded-[5px] ${
                step === i 
                  ? "bg-[#2696DE] w-[24px]" 
                  : "bg-black/10 dark:bg-white/10 w-[10px]"
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
}


