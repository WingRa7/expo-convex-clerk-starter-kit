import { ActivityIndicator } from "react-native";
import { View } from "./View";

export function Loading({ fullScreen }: { fullScreen?: boolean }) {
  return (
    <View className={`justify-center items-center p-5 ${fullScreen ? "flex-1" : ""}`}>
      <ActivityIndicator size="large" className="text-accent" />
    </View>
  );
}
