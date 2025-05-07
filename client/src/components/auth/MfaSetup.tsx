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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, RefreshCw, ClipboardCopy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MfaInfo {
  secret: string;
  qrCode: string;
}

interface BackupCodesResponse {
  backupCodes: string[];
}

export function MfaSetup() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [verificationCode, setVerificationCode] = useState("");
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [backupCodesCopied, setBackupCodesCopied] = useState(false);

  // Get user MFA status
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  // Generate MFA setup info
  const generateMfaMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/mfa/generate");
      const data = await res.json();
      return data as MfaInfo;
    },
  });

  // Enable MFA
  const enableMfaMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await apiRequest("POST", "/api/auth/mfa/enable", { token });
      const data = await res.json();
      return data as { success: boolean; backupCodes: string[] };
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        setBackupCodes(data.backupCodes);
        setShowBackupCodes(true);
        toast({
          title: "MFA Enabled",
          description: "Multi-factor authentication has been successfully enabled for your account.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error Enabling MFA",
        description: "Failed to enable MFA. Please check your verification code and try again.",
        variant: "destructive",
      });
    },
  });

  // Disable MFA
  const disableMfaMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/mfa/disable");
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "MFA Disabled",
        description: "Multi-factor authentication has been disabled for your account.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Disabling MFA",
        description: "Failed to disable MFA. Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Regenerate backup codes
  const regenerateBackupCodesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/mfa/backup-codes");
      const data = await res.json();
      return data as BackupCodesResponse;
    },
    onSuccess: (data) => {
      setBackupCodes(data.backupCodes);
      setShowBackupCodes(true);
      setBackupCodesCopied(false);
      toast({
        title: "Backup Codes Regenerated",
        description: "Your MFA backup codes have been regenerated. Please save them in a secure location.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Regenerating Backup Codes",
        description: "Failed to regenerate backup codes. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleEnableMfa = () => {
    if (!verificationCode) {
      toast({
        title: "Verification Code Required",
        description: "Please enter the verification code from your authenticator app.",
        variant: "destructive",
      });
      return;
    }

    enableMfaMutation.mutate(verificationCode);
  };

  const copyBackupCodes = () => {
    if (backupCodes.length > 0) {
      navigator.clipboard.writeText(backupCodes.join("\n"));
      setBackupCodesCopied(true);
      toast({
        title: "Backup Codes Copied",
        description: "Backup codes have been copied to your clipboard.",
      });
    }
  };

  // If MFA is already enabled, show disable option and backup code regeneration
  if (user?.mfaEnabled) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Manage Two-Factor Authentication</CardTitle>
          <CardDescription>Your account is protected with two-factor authentication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>MFA is currently enabled</AlertTitle>
            <AlertDescription>
              You will be required to enter a verification code when signing in.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Backup Codes</h3>
            <p className="text-sm text-muted-foreground">
              If you lose access to your authenticator app, you can use a backup code to sign in.
            </p>
            <Button
              variant="outline"
              onClick={() => regenerateBackupCodesMutation.mutate()}
              disabled={regenerateBackupCodesMutation.isPending}
              className="w-full"
            >
              {regenerateBackupCodesMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Regenerate Backup Codes
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Disable Two-Factor Authentication
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Disabling two-factor authentication will make your account less secure. Are you sure you want to
                  continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => disableMfaMutation.mutate()}
                  disabled={disableMfaMutation.isPending}
                >
                  {disableMfaMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    "Disable"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    );
  }

  // Show backup codes after enabling MFA
  if (showBackupCodes) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Save Your Backup Codes</CardTitle>
          <CardDescription>
            Store these backup codes in a secure place. You can use these codes to sign in if you lose access to your
            authenticator app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <code key={index} className="text-sm font-mono">
                  {code}
                </code>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={copyBackupCodes}
            disabled={backupCodesCopied}
          >
            {backupCodesCopied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <ClipboardCopy className="h-4 w-4 mr-2" />
                Copy Backup Codes
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setShowBackupCodes(false)}>
            I've Saved My Backup Codes
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show MFA setup
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Enable Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enhance your account security by enabling two-factor authentication. You'll need to enter a verification code
          from your authenticator app when signing in.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generateMfaMutation.data ? (
          <Button
            onClick={() => generateMfaMutation.mutate()}
            disabled={generateMfaMutation.isPending}
            className="w-full"
          >
            {generateMfaMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              "Set Up Two-Factor Authentication"
            )}
          </Button>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="font-medium">1. Scan this QR code</h3>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to scan this QR
                code.
              </p>
              <div className="flex justify-center p-4">
                <img src={generateMfaMutation.data.qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">2. Enter verification code</h3>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit verification code from your authenticator app.
              </p>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))}
                  className="font-mono text-center"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      {generateMfaMutation.data && (
        <CardFooter>
          <Button
            onClick={handleEnableMfa}
            disabled={!verificationCode || enableMfaMutation.isPending}
            className="w-full"
          >
            {enableMfaMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              "Enable Two-Factor Authentication"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}