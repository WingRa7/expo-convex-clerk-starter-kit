import { useAction } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

export function usePasswordVerification() {
  const verifyPassword = useAction(api.auth.verifyPassword);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const verify = async (password: string): Promise<boolean> => {
    setIsVerifying(true);
    setError("");

    try {
      const result = await verifyPassword({ password });

      if (result.verified) {
        return true;
      } else {
        setError(result.error || "Password verification failed");
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err?.data || err?.message || "Password verification failed";

      if (
        errorMessage.toLowerCase().includes("password") ||
        errorMessage.toLowerCase().includes("incorrect")
      ) {
        setError("Incorrect password. Please try again.");
      } else {
        setError(errorMessage);
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verify,
    isVerifying,
    error,
    clearError: () => setError(""),
  };
}
