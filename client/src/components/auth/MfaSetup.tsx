import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Shield, Copy, RotateCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";

interface MfaSetupProps {
  userId: number;
  onComplete: () => void;
}

export function MfaSetup({ userId, onComplete }: MfaSetupProps) {
  const [step, setStep] = useState<"generate" | "verify">("generate");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    generateMfaSecret();
  }, []);

  const generateMfaSecret = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/auth/generate-mfa", { userId });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to generate MFA secret");
      }
      
      const data = await response.json();
      setQrCode(data.qrCode);
      setSecret(data.secret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate MFA secret");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to generate MFA secret",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!token) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/auth/enable-mfa", {
        userId,
        token,
        secret,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Verification failed");
      }

      const data = await response.json();
      setBackupCodes(data.backupCodes);
      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication has been successfully enabled for your account.",
      });
      
      // Move to complete if no backup codes are provided
      if (!data.backupCodes || data.backupCodes.length === 0) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      toast({
        title: "Verification Failed",
        description: err instanceof Error ? err.message : "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Successfully copied to clipboard",
    });
  };

  const copyBackupCodes = () => {
    const formattedCodes = backupCodes.join("\n");
    navigator.clipboard.writeText(formattedCodes);
    toast({
      title: "Backup Codes Copied",
      description: "Save these codes in a secure location",
    });
  };

  if (backupCodes.length > 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Backup Codes</CardTitle>
          <CardDescription>
            Save these codes in a secure location. Each code can be used once to log in if you lose access to your authenticator app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md mb-4">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm p-1 border border-border rounded-sm flex justify-between items-center">
                  <span>{code}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(code)}
                  >
                    <Copy size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Alert className="bg-yellow-50 text-yellow-800 border-yellow-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              These codes will only be shown once. Keep them safe.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={copyBackupCodes}>
            <Copy className="mr-2 h-4 w-4" />
            Copy All Codes
          </Button>
          <Button onClick={onComplete}>
            Complete Setup
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (step === "generate") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enhance your account security by enabling two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-center text-sm text-muted-foreground">
                Generating your secure key...
              </p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                {qrCode && (
                  <div 
                    className="p-4 bg-white rounded-lg border"
                    dangerouslySetInnerHTML={{ __html: qrCode }} 
                  />
                )}
                <div className="flex items-center space-x-2">
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    {secret}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(secret)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Instructions:</h3>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Download an authenticator app like Google Authenticator</li>
                  <li>Scan the QR code or enter the key manually</li>
                  <li>Enter the 6-digit code from the app to verify</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={generateMfaSecret} 
            disabled={isLoading}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button 
            onClick={() => setStep("verify")} 
            disabled={isLoading || !qrCode}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Setup</CardTitle>
        <CardDescription>
          Enter the verification code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setStep("generate")} 
          disabled={isLoading}
        >
          Back
        </Button>
        <Button 
          onClick={verifyAndEnable} 
          disabled={isLoading || token.length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Enable MFA
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}