import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('AuthProvider: Authentication check timeout, setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout

    // Check for stored auth
    console.log('AuthProvider: Starting authentication check');
    try {
      // Check if localStorage is available (client-side only)
      if (typeof window === 'undefined') {
        console.log('AuthProvider: Running on server, skipping localStorage check');
        setLoading(false);
        clearTimeout(timeoutId);
        return;
      }
      
      console.log('AuthProvider: Checking localStorage for stored user');
      const storedUser = localStorage.getItem('auth-user');
      console.log('AuthProvider: Stored user found:', storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthProvider: Setting user:', parsedUser);
        setUser(parsedUser);
      } else {
        console.log('AuthProvider: No stored user found');
      }
    } catch (error) {
      console.error('AuthProvider: Error reading stored user:', error);
    } finally {
      console.log('AuthProvider: Setting loading to false');
      setLoading(false);
      clearTimeout(timeoutId);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Demo authentication
    if (email === 'admin@company.com' && password === 'admin123') {
      const user = {
        id: '1',
        email: 'admin@company.com',
        name: 'System Administrator'
      };
      setUser(user);
      localStorage.setItem('auth-user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
  };

  return {
    user,
    login,
    logout,
    loading
  };
}

export { AuthContext };
