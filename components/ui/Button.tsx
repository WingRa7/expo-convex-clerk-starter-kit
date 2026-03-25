import { Button as HeroUIButton, type ButtonProps as HeroUIButtonProps } from "heroui-native";
import React from "react";

export type ButtonProps = HeroUIButtonProps;

export function Button({
  style,
  children,
  variant = "primary",
  ...otherProps
}: ButtonProps) {
  return (
    <HeroUIButton
      variant={variant}
      style={style}
      {...otherProps}
    >
      {typeof children === "string" ? (
        <HeroUIButton.Label>{children}</HeroUIButton.Label>
      ) : (
        children
      )}
    </HeroUIButton>
  );
}
