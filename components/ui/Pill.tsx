import { View } from "./View";
import { Text } from "./Text";

export type PillProps = {
  label: string;
  variant?: "primary" | "outline";
  className?: string;
};

export function Pill({ label, variant = "primary", className }: PillProps) {
  const containerClasses = variant === "outline" 
    ? "border border-accent" 
    : "bg-accent";
    
  const textClasses = variant === "outline"
    ? "text-accent"
    : "text-accent-foreground";

  return (
    <View className={`px-2 py-0.5 rounded-xl bg-transparent ${containerClasses} ${className || ""}`}>
      <Text className={`text-xs font-semibold ${textClasses}`}>
        {label}
      </Text>
    </View>
  );
}
