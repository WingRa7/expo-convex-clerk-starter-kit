import { Image } from "expo-image";
import { ScrollView } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useUser } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T, Var } from "gt-react-native";

export default function HomeScreen() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <View 
        className="px-6 mb-10"
        style={{ paddingTop: insets.top + 20 }}
      >
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <T>
              <Text className="text-4xl font-extrabold tracking-tight text-foreground leading-[48px]">
                Hey, <Var>{user?.firstName || 'there'}</Var>!
              </Text>
            </T>
            <HelloWave />
          </View>
          <T>
            <Text className="text-foreground opacity-50 text-base">
              You're doing great today.
            </Text>
          </T>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats */}
        <View className="flex-row gap-4">
          <View className="flex-1 bg-surface p-6 rounded-[32px] border border-foreground/5">
            <T>
              <Text className="text-[10px] font-bold opacity-30 uppercase tracking-[2px]">Streak</Text>
            </T>
            <Text className="text-3xl font-bold mt-1 text-foreground leading-[38px]">12</Text>
          </View>
          <View className="flex-1 bg-surface p-6 rounded-[32px] border border-foreground/5">
            <T>
              <Text className="text-[10px] font-bold opacity-30 uppercase tracking-[2px]">Points</Text>
            </T>
            <Text className="text-3xl font-bold mt-1 text-foreground leading-[38px]">1,240</Text>
          </View>
        </View>

        {/* Tasks Section */}
        <View className="mt-12">
          <View className="flex-row items-center justify-between mb-6 px-2">
            <T>
              <Text className="text-[11px] font-bold opacity-30 uppercase tracking-[3px]">Today's Tasks</Text>
            </T>
            <Button variant="ghost" className="p-0 h-auto">
              <T>
                <Text type="link" className="font-semibold text-xs uppercase tracking-wider">See all</Text>
              </T>
            </Button>
          </View>

          <View className="gap-3">
            {[1, 2, 3].map((i) => (
              <View key={i} className="bg-surface p-5 rounded-[32px] flex-row items-center gap-5 border border-foreground/5">
                <View className="bg-background w-12 h-12 rounded-2xl items-center justify-center">
                  <IconSymbol 
                    name={i === 1 ? "checkmark.circle" : i === 2 ? "calendar" : "star"} 
                    size={24} 
                    color={i === 1 ? "#22c55e" : "#2696DE"} 
                  />
                </View>
                <View className="flex-1 bg-transparent">
                  <T>
                    <Text className="font-bold text-lg text-foreground">Sample Task <Var>{i}</Var></Text>
                  </T>
                  <T>
                    <Text className="text-foreground opacity-50 text-sm">Action required for your habit.</Text>
                  </T>
                </View>
                <IconSymbol name="chevron.right" size={16} color="rgba(0,0,0,0.2)" />
              </View>
            ))}
          </View>
        </View>

        {/* Featured Card */}
        <View className="mt-12 bg-accent rounded-[40px] p-8 overflow-hidden">
          <View className="z-10 bg-transparent">
            <T>
              <Text className="text-white text-3xl font-extrabold leading-[42px] tracking-tight">New SVG morphs{"\n"}are here!</Text>
            </T>
            <T>
              <Text className="text-white/70 mt-3 mb-8 text-base leading-6">Check out the Explore tab for the new animations.</Text>
            </T>
            <Button variant="secondary" className="w-40 bg-white/20 border border-white/30 rounded-[18px]">
              <T>
                <Text className="text-white font-bold">Try them out</Text>
              </T>
            </Button>
          </View>
          <View className="absolute right-[-60] bottom-[-60] opacity-10 bg-transparent">
            <IconSymbol name="sparkles" size={240} color="white" />
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mt-12 mb-10">
          <T>
            <Text className="text-[11px] font-bold opacity-30 uppercase tracking-[3px] ml-2 mb-6">Activity</Text>
          </T>
          <View className="bg-surface rounded-[32px] p-2 border border-foreground/5">
            <View className="p-5 flex-row items-center gap-4 bg-transparent">
              <View className="h-2 w-2 rounded-full bg-accent" />
              <T>
                <Text className="text-base text-foreground">Completed <Text className="font-bold">Routine</Text></Text>
              </T>
              <Text className="text-foreground opacity-30 text-xs ml-auto">2h ago</Text>
            </View>
            <View className="h-px bg-foreground/5 mx-5" />
            <View className="p-5 flex-row items-center gap-4 bg-transparent">
              <View className="h-2 w-2 rounded-full bg-success" />
              <T>
                <Text className="text-base text-foreground">New badge: <Text className="font-bold">Star</Text></Text>
              </T>
              <Text className="text-foreground opacity-30 text-xs ml-auto">5h ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
