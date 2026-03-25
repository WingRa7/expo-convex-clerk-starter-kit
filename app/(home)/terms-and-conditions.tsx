import { ScrollView } from "react-native";
import { View } from "@/components/ui/View";
import { Text } from "@/components/ui/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { T } from "gt-react-native";
import { ArrowLeft } from "lucide-react-native";

export default function TermsAndConditionsScreen() {
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
            Terms & Conditions
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
            Terms and Conditions for Amigo (2026)
          </Text>
        </T>
        <T>
          <Text className="text-sm opacity-60 mb-4 text-foreground">
            Effective Date: March 21, 2026{"\n"}
            Developer: RaineTech (tom@raine.run)
          </Text>
        </T>

        <T><Text className="text-lg font-bold mt-2 text-foreground">1. Agreement to Terms</Text></T>
        <T><Text className="text-base leading-6 opacity-80 text-foreground">
          By accessing or using Amigo, you agree to be bound by these Terms and Conditions. If you do not agree, do not use the application.
        </Text></T>

        <T><Text className="text-lg font-bold mt-2 text-foreground">2. User Eligibility</Text></T>
        <T><Text className="text-base leading-6 opacity-80 text-foreground">
          You must be at least 13 years of age (or the minimum age required in your country) to use Amigo. By using the app, you represent that you meet this requirement.
        </Text></T>

        <T><Text className="text-lg font-bold mt-2 text-foreground">3. Account Responsibility</Text></T>
        <T><Text className="text-base leading-6 opacity-80 text-foreground">
          • You are responsible for maintaining the confidentiality of your Clerk authentication credentials.{"\n"}
          • You are solely responsible for all activities that occur under your account.{"\n"}
          • RaineTech reserves the right to suspend or terminate accounts that violate these terms.
        </Text></T>
        
        {/* ... More sections could be added here as per template ... */}
      </ScrollView>
    </View>
  );
}
