import {
  SymbolView,
  type SymbolViewProps,
  type SymbolWeight,
} from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type ViewStyle } from "react-native";

export type IconSymbolName = SymbolViewProps["name"];

type IconSymbolProps = {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: IconSymbolProps) {
  return (
    <SymbolView
      name={name}
      weight={weight}
      tintColor={color} // Note: The prop for color is 'tintColor'
      style={[{ width: size, height: size }, style]}
    />
  );
}
