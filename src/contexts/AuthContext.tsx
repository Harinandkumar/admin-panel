import React, { createContext, useContext, useState, useEffect } from "react";
import { Admin, AuthState, LoginCredentials } from "@/lib/types";
import { authAPI } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    admin: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const { toast } = useToast();

  // Check for existing session on mount and verify token
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const storedAdmin = localStorage.getItem("admin");
      
      if (!token || !storedAdmin) {
        setState({
          admin: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }
      
      try {
        const response = await authAPI.verify();
        setState({
          admin: response.admin,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        // If token verification fails, clear storage
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
        
        setState({
          admin: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Session expired. Please login again.",
        });
      }
    };
    
    verifyToken();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      
      // Store admin data and token
      localStorage.setItem("admin", JSON.stringify(response.admin));
      localStorage.setItem("token", response.token);
      
      setState({
        admin: response.admin,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setState({
        ...state,
        isLoading: false,
        error: errorMessage,
      });
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    setState({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
