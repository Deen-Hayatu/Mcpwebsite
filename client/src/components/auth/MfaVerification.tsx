import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Shield } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MfaVerificationProps {
  userId: number;
  onSuccess: (user: any) => void;
  onCancel: () => void;
}

export function MfaVerification({ userId, onSuccess, onCancel }: MfaVerificationProps) {
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [isBackupCode, setIsBackupCode] = useState(false);

  const verifyMfaMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await apiRequest("POST", "/api/auth/mfa/verify", { token });
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Verification Successful",
          description: "You have been successfully authenticated.",
        });
        if (data.user) {
          onSuccess(data.user);
        }
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Verification Error",
        description: "There was an error verifying your code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      toast({
        title: "Code Required",
        description: "Please enter a verification code.",
        variant: "destructive",
      });
      return;
    }
    verifyMfaMutation.mutate(verificationCode);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          {isBackupCode
            ? "Enter a backup code to sign in"
            : "Enter the verification code from your authenticator app"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder={isBackupCode ? "XXXX-XXXX-XX" : "000000"}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="font-mono text-center text-lg"
              maxLength={isBackupCode ? 12 : 6}
              autoFocus
            />
          </div>
          <Button
            type="button"
            variant="link"
            className="px-0 text-sm"
            onClick={() => {
              setIsBackupCode(!isBackupCode);
              setVerificationCode("");
            }}
          >
            {isBackupCode
              ? "Use verification code from authenticator app instead"
              : "Use a backup code instead"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={!verificationCode || verifyMfaMutation.isPending}
          >
            {verifyMfaMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}