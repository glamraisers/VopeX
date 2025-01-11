import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode
} from 'react';
import { authService } from './authService';

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check initial authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const currentUser = authService.getCurrentUser();
        const authStatus = authService.isAuthenticated();

        if (authStatus && currentUser) {
          setIsAuthenticated(true);
          setUser(currentUser);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login method
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login({ email, password });
      
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (err: any) {
      setIsAuthenticated(false);
      setUser(null);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = () => {
    try {
      authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  // Register method
  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.register({
        email,
        password,
        firstName,
        lastName
      });

      setIsAuthenticated(true);
      setUser(response.user);
    } catch (err: any) {
      setIsAuthenticated(false);
      setUser(null);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for route protection
export const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
      return <LoadingSpinner />;
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

// Protected Route Component
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : null;
};