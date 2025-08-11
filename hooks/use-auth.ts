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
    let timeoutId: NodeJS.Timeout | null = null;
    let immediateTimeoutId: NodeJS.Timeout | null = null;
    
    // Set an immediate timeout to ensure loading is set to false
    immediateTimeoutId = setTimeout(() => {
      console.log('AuthProvider: Immediate timeout, setting loading to false');
      setLoading(false);
    }, 100); // 100ms timeout
    
    // Set a longer timeout for the authentication check
    const startTimeout = () => {
      timeoutId = setTimeout(() => {
        console.log('AuthProvider: Authentication check timeout, setting loading to false');
        setLoading(false);
      }, 5000); // 5 second timeout
    };

    // Check for stored auth
    console.log('AuthProvider: Starting authentication check');
    try {
      // Check if localStorage is available (client-side only)
      if (typeof window === 'undefined') {
        console.log('AuthProvider: Running on server, skipping localStorage check');
        setLoading(false);
        if (immediateTimeoutId) clearTimeout(immediateTimeoutId);
        return;
      }
      
      // Start the timeout
      startTimeout();
      
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
      
      // Clear timeouts and set loading to false
      console.log('AuthProvider: Setting loading to false');
      if (timeoutId) clearTimeout(timeoutId);
      if (immediateTimeoutId) clearTimeout(immediateTimeoutId);
      setLoading(false);
    } catch (error) {
      console.error('AuthProvider: Error reading stored user:', error);
      // Clear timeouts and set loading to false on error
      if (timeoutId) clearTimeout(timeoutId);
      if (immediateTimeoutId) clearTimeout(immediateTimeoutId);
      setLoading(false);
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
