import { useClerk } from "@clerk/clerk-expo";
import { ThemedButton } from "./ThemedButton";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", JSON.stringify(err, null, 2)); // TODO add error message handling and disabled state (might need to pass down loading state)
    }
  };

  return <ThemedButton onPress={handleSignOut}>Sign out</ThemedButton>;
};
