import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MfaSetup } from "@/components/auth/MfaSetup";
import { AlertCircle, Loader2, LogOut, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Define the type for user sessions
interface UserSession {
  id: number;
  userId: number;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
}

// Define the type for security info response
interface SecurityInfo {
  sessions: UserSession[];
  currentSessionId: string;
}

export default function AccountSecurityPage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: securityInfo,
    isLoading,
    error,
    refetch,
  } = useQuery<SecurityInfo>({
    queryKey: ["/api/mfa/security-info"],
    enabled: !!user,
  });

  // Function to disable MFA
  const handleDisableMfa = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/mfa/disable", { userId: user.id });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to disable MFA");
      }
      
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "MFA Disabled",
        description: "Two-factor authentication has been turned off for your account.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to disable MFA",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // After MFA setup is complete
  const handleMfaSetupComplete = () => {
    setShowMfaSetup(false);
    refetch();
    queryClient.invalidateQueries({ queryKey: ["/api/user"] });
  };

  // Function to terminate a session
  const handleTerminateSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      const response = await apiRequest("POST", "/api/mfa/terminate-session", { 
        userId: user.id, 
        sessionId 
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to terminate session");
      }
      
      refetch();
      
      toast({
        title: "Session Terminated",
        description: "The selected session has been terminated.",
      });
      
      // If current session was terminated, log out
      if (securityInfo?.currentSessionId === sessionId) {
        logoutMutation.mutate();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to terminate session",
        variant: "destructive",
      });
    }
  };

  // Main render
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view account security settings</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center text-sm text-muted-foreground">
          Loading security information...
        </p>
      </div>
    );
  }

  // Show MFA setup interface if requested
  if (showMfaSetup) {
    return (
      <div className="container py-10 flex justify-center">
        <MfaSetup 
          userId={user.id} 
          onComplete={handleMfaSetupComplete} 
        />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Account Security</h1>
          <Button 
            variant="outline" 
            onClick={() => logoutMutation.mutate()}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <Tabs defaultValue="two-factor">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="two-factor">Two-Factor Authentication</TabsTrigger>
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="two-factor" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </div>
                  {user.mfaEnabled ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Enabled</Badge>
                  ) : (
                    <Badge variant="outline">Disabled</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="mfa-toggle">Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require a verification code when signing in for added security
                    </p>
                  </div>
                  <Switch 
                    id="mfa-toggle"
                    checked={!!user.mfaEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setShowMfaSetup(true);
                      } else {
                        handleDisableMfa();
                      }
                    }}
                    disabled={isSubmitting}
                  />
                </div>
                
                {user.mfaEnabled && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Protection enabled</AlertTitle>
                    <AlertDescription>
                      Your account is protected with two-factor authentication.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                {user.mfaEnabled ? (
                  <Button 
                    variant="destructive" 
                    onClick={handleDisableMfa}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disabling...
                      </>
                    ) : (
                      "Disable 2FA"
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowMfaSetup(true)}
                    disabled={isSubmitting}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Set Up 2FA
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Review your account details and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email Status</p>
                      <p>
                        {user.emailVerified ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500">
                            Unverified
                          </Badge>
                        )}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Role</p>
                      <p>{user.role || "User"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                      <p>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">
                          Active
                        </Badge>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                      <p>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Unknown"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Last Login IP</p>
                      <p>{user.lastLoginIp || "Unknown"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage your active login sessions across devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {securityInfo?.sessions && securityInfo.sessions.length > 0 ? (
                  <div className="space-y-4">
                    {securityInfo.sessions.map((session: any) => (
                      <div 
                        key={session.id} 
                        className={`flex justify-between items-center p-4 rounded-lg border ${
                          session.id === securityInfo.currentSessionId ? 'bg-secondary/20' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {session.browser} on {session.os}
                              {session.id === securityInfo.currentSessionId && (
                                <Badge className="ml-2 bg-primary">Current</Badge>
                              )}
                            </h4>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <p>Last active: {new Date(session.lastActiveAt).toLocaleString()}</p>
                            <p className="text-xs">IP: {session.ip}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTerminateSession(session.id)}
                          disabled={isSubmitting}
                        >
                          {session.id === securityInfo.currentSessionId ? 'Sign Out' : 'Terminate'}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No active sessions found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  className="gap-2"
                >
                  <Loader2 className="h-4 w-4" />
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}