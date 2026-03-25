import {
  SymbolView,
  type SymbolViewProps,
  type SymbolWeight,
} from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type ViewStyle } from "react-native";

export type IconSymbolName = SymbolViewProps["name"];

export type IconSymbolProps = {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  className?: string;
  weight?: SymbolWeight;
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  className,
  weight,
}: IconSymbolProps) {
  return (
    <SymbolView
      name={name}
      weight={weight}
      tintColor={color}
      className={className}
      style={[{ width: size, height: size }, style]}
    />
  );
}
