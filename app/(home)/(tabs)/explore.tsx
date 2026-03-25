import { Link } from "expo-router";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T } from "gt-react-native";
import AnimatedBlob from "@/components/AnimatedBlob";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: insets.top + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mb-10">
          <T>
            <Text className="text-4xl font-extrabold tracking-tight text-foreground leading-[48px]">Explore</Text>
          </T>
          <T>
            <Text className="text-foreground opacity-50 text-base mt-1">Discover what's possible.</Text>
          </T>
        </View>

        <View className="px-6 gap-8">
          {/* Feature Highlight */}
          <View className="bg-surface rounded-[32px] p-8 border border-foreground/5 overflow-hidden">
            <View className="z-10 gap-2 bg-transparent">
              <T>
                <Text className="text-2xl font-bold text-foreground">Fluid Motion</Text>
              </T>
              <T>
                <Text className="text-foreground opacity-60 text-base leading-6">
                  Experience seamless SVG morphing and performant animations powered by Reanimated.
                </Text>
              </T>
            </View>
            <View className="items-center mt-6 bg-transparent">
              <AnimatedBlob size={200} />
            </View>
          </View>

          {/* Quick Links */}
          <View className="gap-4">
            <T>
              <Text className="text-[11px] font-bold opacity-30 uppercase tracking-[3px] ml-4">Components</Text>
            </T>
            <View className="gap-3">
              <Link href="/(home)/(modals)/modal" asChild>
                <View className="bg-surface rounded-[32px] p-5 flex-row items-center gap-4 border border-foreground/5">
                  <View className="bg-background w-12 h-12 rounded-2xl items-center justify-center">
                    <IconSymbol name="square.stack.3d.up" size={24} color="#2696DE" />
                  </View>
                  <View className="flex-1">
                    <T>
                      <Text className="font-bold text-lg text-foreground">Modals</Text>
                    </T>
                    <T>
                      <Text className="text-foreground opacity-50 text-sm">Overlay navigation patterns.</Text>
                    </T>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color="rgba(0,0,0,0.2)" />
                </View>
              </Link>

              <View className="bg-surface rounded-[32px] p-5 flex-row items-center gap-4 border border-foreground/5">
                <View className="bg-background w-12 h-12 rounded-2xl items-center justify-center">
                  <IconSymbol name="leaf.fill" size={24} color="#22c55e" />
                </View>
                <View className="flex-1">
                  <T>
                    <Text className="font-bold text-lg text-foreground">Minimal UI</Text>
                  </T>
                  <T>
                    <Text className="text-foreground opacity-50 text-sm">Clean, focused design system.</Text>
                  </T>
                </View>
                <IconSymbol name="chevron.right" size={16} color="rgba(0,0,0,0.2)" />
              </View>
            </View>
          </View>

          {/* Info Card */}
          <View className="bg-accent/5 rounded-[32px] p-8 border border-accent/10">
            <T>
              <Text className="text-accent font-bold text-base text-center leading-6">
                More features coming soon in the next update.
              </Text>
            </T>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
