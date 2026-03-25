import { Text as RNText, type TextProps as RNTextProps } from "react-native";

export type TextProps = RNTextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function Text({
  style,
  type = "default",
  className,
  ...rest
}: TextProps) {
  // Mapping types to Tailwind classes
  const typeClasses = {
    default: "text-base leading-6",
    defaultSemiBold: "text-base font-semibold leading-6",
    title: "text-4xl font-bold leading-[44px] pt-1",
    subtitle: "text-xl font-bold",
    link: "text-link leading-[30px]",
  };

  const defaultTextColorClass = type === "link" ? "text-link" : "text-foreground";

  return (
    <RNText
      className={`${defaultTextColorClass} ${typeClasses[type]} ${className || ""}`}
      style={style}
      {...rest}
    />
  );
}
