import { ScrollView } from "react-native";
import { View } from "@/components/ui/View";
import { Text } from "@/components/ui/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { T } from "gt-react-native";
import { ArrowLeft } from "lucide-react-native";

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <View 
        className="flex-row items-center justify-between px-4 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Button variant="ghost" onPress={() => router.back()} className="p-2 min-w-10">
          <ArrowLeft size={24} className="text-foreground" />
        </Button>
        <T>
          <Text className="text-lg font-semibold flex-1 text-center text-foreground">
            Privacy Policy
          </Text>
        </T>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 20,
          gap: 16,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <T>
          <Text className="text-2xl font-bold mb-1 text-foreground">
            Privacy Policy for Amigo (2026)
          </Text>
        </T>
        <T>
          <Text className="text-sm opacity-60 mb-4 text-foreground">
            Effective Date: March 21, 2026{"\n"}
            Developer: RaineTech
          </Text>
        </T>

        <T><Text className="text-lg font-bold mt-2 text-foreground">1. Introduction</Text></T>
        <T><Text className="text-base leading-6 opacity-80 text-foreground">
          Amigo, developed by RaineTech, is committed to protecting your privacy. This policy explains how we handle your data to provide our accountability services.
        </Text></T>

        <T><Text className="text-lg font-bold mt-2 text-foreground">2. Information We Collect</Text></T>
        <T><Text className="text-base leading-6 opacity-80 text-foreground">
          • <Text className="font-bold">Contact Information:</Text> Name and email address via Clerk.{"\n"}
          • <Text className="font-bold">Identifiers:</Text> Device ID and User ID for app functionality.{"\n"}
          • <Text className="font-bold">Purchases & Financial Info:</Text> We use RevenueCat to process in-app purchases. We do not store your credit card details; these are handled securely by the Apple App Store.{"\n"}
          • <Text className="font-bold">User Content:</Text> Tasks, descriptions, messages, and uploaded task images.{"\n"}
          • <Text className="font-bold">Usage Data:</Text> Technical logs to improve app performance.
        </Text></T>
        
        {/* ... More sections could be added here as per template ... */}
      </ScrollView>
    </View>
  );
}
