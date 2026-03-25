import { Link } from "expo-router";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { T } from "gt-react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 justify-center items-center p-8 bg-background">
      <View className="w-full max-w-[400px] items-center gap-8">
        <View className="h-20 w-20 rounded-[32px] bg-accent-soft items-center justify-center">
          <IconSymbol name="square.stack.3d.up.fill" size={40} color="#2696DE" />
        </View>

        <View className="items-center gap-2">
          <T>
            <Text className="text-3xl font-bold text-center">Standard Modal</Text>
          </T>
          <T>
            <Text className="text-foreground opacity-50 text-base text-center px-4">
              This is a standard modal navigation pattern for focused actions.
            </Text>
          </T>
        </View>

        <View className="w-full">
          <Link href="/(home)/(tabs)/explore" dismissTo asChild>
            <Button className="h-14">
              <Text className="font-bold">Go back</Text>
            </Button>
          </Link>
        </View>
      </View>
    </View>
  );
}
