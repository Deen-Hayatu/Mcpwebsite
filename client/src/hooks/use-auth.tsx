import { createContext, ReactNode, useContext, useState } from "react";
import { useQuery, useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type User = {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
  mfaEnabled?: boolean;
  role?: string;
  permissions?: string[];
  emailVerified?: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
}

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type MfaRequiredResponse = {
  requireMfa: true;
  userId: number;
  message: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User | MfaRequiredResponse, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  requireMfa: boolean;
  mfaUserId: number | null;
  resetMfaState: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [requireMfa, setRequireMfa] = useState(false);
  const [mfaUserId, setMfaUserId] = useState<number | null>(null);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation<User | MfaRequiredResponse, Error, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      // Check if MFA is required
      if ('requireMfa' in data && data.requireMfa) {
        setRequireMfa(true);
        setMfaUserId(data.userId);
        toast({
          title: "Two-Factor Authentication Required",
          description: "Please enter the verification code from your authenticator app.",
        });
      } else {
        // Normal login success
        setRequireMfa(false);
        setMfaUserId(null);
        queryClient.setQueryData(["/api/user"], data);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation<User, Error, RegisterData>({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout Successful",
        description: "You have been logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetMfaState = () => {
    setRequireMfa(false);
    setMfaUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        requireMfa,
        mfaUserId,
        resetMfaState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}