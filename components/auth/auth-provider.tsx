"use client";

import { useAuthProvider, AuthContext } from "@/hooks/use-auth";
import { EnhancedLoginForm } from "./enhanced-login-form";
import { EnhancedSidebar } from "@/components/layout/enhanced-sidebar";
import { EnhancedHeader } from "@/components/layout/enhanced-header";
import { Footer } from "@/components/layout/footer";
import { AlertNotification } from "@/components/alerts/alert-notification";
import { AlarmSystem } from "@/components/alerts/alarm-system";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./theme-provider";
import { useTheme } from "@/hooks/use-theme";

function AppContent({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  const { actualTheme } = useTheme();

  if (auth.loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${
        actualTheme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className={`${actualTheme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
            Initializing system...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {!auth.user ? (
        <EnhancedLoginForm />
      ) : (
        <ErrorBoundary>
          <div className={`flex h-screen transition-colors ${
            actualTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <EnhancedSidebar />
            
            <div className="flex-1 flex flex-col transition-all duration-300 md:ml-16 lg:ml-64">
              <EnhancedHeader />
              
              <main className="flex-1 overflow-auto p-6">
                {children}
              </main>
              
              <Footer />
            </div>
          </div>
          
          <AlertNotification />
          <AlarmSystem />
          <Toaster />
        </ErrorBoundary>
      )}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppContent>{children}</AppContent>
    </ThemeProvider>
  );
}
