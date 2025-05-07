import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MfaSetup } from "@/components/auth/MfaSetup";
import { useAuth } from "@/hooks/use-auth";
import { Shield, UserCircle, History, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function AccountSecurityPage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("mfa");
  
  // Get user's active sessions
  const { data: sessionsData } = useQuery({
    queryKey: ["/api/user/sessions"],
    enabled: !!user,
  });
  
  // Revoke a specific session
  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await apiRequest("POST", `/api/user/sessions/${sessionId}/revoke`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Session Revoked",
        description: "The session has been successfully revoked.",
      });
    },
  });
  
  // Revoke all other sessions
  const revokeAllSessionsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/user/sessions/revoke-all");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sessions Revoked",
        description: "All other sessions have been successfully revoked.",
      });
    },
  });
  
  if (!user) {
    navigate("/auth");
    return null;
  }
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/auth");
      },
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };
  
  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Account Security</h1>
          <p className="text-muted-foreground">
            Manage your account security settings and active sessions.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="mfa" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Two-Factor</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <UserCircle className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mfa" className="space-y-6">
            <MfaSetup />
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  These are the devices currently logged into your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!sessionsData?.sessions?.length ? (
                  <p className="text-center text-muted-foreground py-6">No active sessions found.</p>
                ) : (
                  <>
                    <ScrollArea className="h-80">
                      <div className="space-y-4">
                        {sessionsData.sessions.map((session: any) => (
                          <div key={session.id} className="flex justify-between items-center p-4 border rounded-md">
                            <div>
                              <p className="font-medium">
                                {session.id === sessionsData.currentSessionId ? "Current Session" : session.userAgent}
                              </p>
                              <div className="text-sm text-muted-foreground">
                                <p>IP: {session.ipAddress}</p>
                                <p>Last active: {formatDate(session.lastActivity)}</p>
                              </div>
                            </div>
                            {session.id !== sessionsData.currentSessionId && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => revokeSessionMutation.mutate(session.id)}
                                disabled={revokeSessionMutation.isPending}
                              >
                                Revoke
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => revokeAllSessionsMutation.mutate()}
                      disabled={revokeAllSessionsMutation.isPending}
                    >
                      Revoke All Other Sessions
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Username</h3>
                  <p className="text-muted-foreground">{user.username}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm text-muted-foreground">
                      {user.emailVerified ? 'Verified' : 'Not verified'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Role</h3>
                  <p className="text-muted-foreground">{user.role || 'User'}</p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Last Login</h3>
                  <p className="text-muted-foreground">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Not available'}
                  </p>
                  {user.lastLoginIp && (
                    <p className="text-sm text-muted-foreground">IP: {user.lastLoginIp}</p>
                  )}
                </div>
                
                <Button
                  variant="destructive"
                  className="w-full mt-6"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}