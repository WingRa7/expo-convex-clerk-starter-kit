import { useClerk } from "@clerk/clerk-expo";
import { Button } from "@/components/ui/Button";
import { ReactNode } from "react";

export type SignOutButtonProps = {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft";
  style?: any;
  className?: string;
};

export const SignOutButton = ({ children, variant = "primary", style, className }: SignOutButtonProps) => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <Button variant={variant} onPress={handleSignOut} style={style} className={className}>
      {children || "Sign out"}
    </Button>
  );
};
