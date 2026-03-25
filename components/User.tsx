import { View } from "@/components/ui/View";
import { Text } from "@/components/ui/Text";
import { TouchableOpacity, Image } from "react-native";
import { Avatar } from "heroui-native";

export type UserProps = {
  imageUrl?: string;
  username?: string;
  email?: string;
  onAvatarPress?: () => void;
  isUpdatingAvatar?: boolean;
  avatarSize?: number;
  containerStyle?: any;
  className?: string;
  variant?: "card" | "ghost";
  compact?: boolean;
};

export function User({ 
  imageUrl, 
  username, 
  email, 
  onAvatarPress, 
  isUpdatingAvatar, 
  avatarSize = 40,
  containerStyle,
  className,
  variant = "card",
  compact = false
}: UserProps) {
  return (
    <View style={containerStyle} className={`flex-row items-center gap-3 bg-transparent ${className || ""}`}>
      <TouchableOpacity onPress={onAvatarPress} disabled={!onAvatarPress || isUpdatingAvatar}>
        <Avatar 
          alt={username || "User avatar"} 
          style={{ width: avatarSize, height: avatarSize, backgroundColor: 'transparent' }}
        >
          {imageUrl && <Avatar.Image source={{ uri: imageUrl }} />}
        </Avatar>
      </TouchableOpacity>
      <View className="flex-1 bg-transparent">
        {username && (
          <Text className={`text-foreground font-semibold ${compact ? "text-sm" : "text-base"}`}>
            {username}
          </Text>
        )}
        {email && !compact && (
          <Text className="text-foreground text-sm opacity-60">
            {email}
          </Text>
        )}
      </View>
    </View>
  );
}
