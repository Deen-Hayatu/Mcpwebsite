import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/hooks/use-auth";

interface MfaVerificationProps {
  userId: number;
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

export function MfaVerification({ userId, onSuccess, onCancel }: MfaVerificationProps) {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleVerifyMfa = async () => {
    if (!token) {
      setError("Please enter the verification code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiRequest(
        "POST", 
        "/api/mfa/verify", 
        { token, userId }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed");
      }

      const user = await response.json();
      toast({
        title: "Verification Successful",
        description: "You have successfully logged in."
      });
      onSuccess(user);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed");
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the verification code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter 6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleVerifyMfa} disabled={isSubmitting || !token}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}