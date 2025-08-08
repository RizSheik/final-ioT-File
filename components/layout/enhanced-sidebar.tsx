"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const navigation = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
      </svg>
    )
  },
  { 
    name: "Devices", 
    href: "/devices", 
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    name: "Device Map", 
    href: "/map", 
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  { 
    name: "Alerts", 
    href: "/alerts", 
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    )
  },
  { 
    name: "Thresholds", 
    href: "/thresholds", 
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
      </svg>
    )
  },
];

export function EnhancedSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden shadow-md bg-white text-gray-900 hover:bg-gray-100"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </Button>

      {/* Desktop Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex fixed top-4 z-50 shadow-lg bg-slate-800 text-white hover:bg-slate-700"
        style={{ 
          left: isCollapsed ? '4px' : '260px',
          transform: isCollapsed ? 'translateX(0)' : 'translateX(-4px)'
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <svg 
          className={cn("h-5 w-5 transition-transform duration-300", isCollapsed ? "rotate-0" : "rotate-180")} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 text-white transform transition-all duration-300 ease-in-out shadow-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
        // Mobile styles
        "md:translate-x-0",
        isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
        // Desktop styles
        "hidden md:block",
        isCollapsed ? "md:w-16" : "md:w-64"
      )}>
        {/* Header */}
        <div className="flex h-16 items-center justify-center border-b border-slate-700 px-4">
          <div className={cn(
            "transition-all duration-300 overflow-hidden",
            isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
          )}>
            <h1 className="text-lg font-bold whitespace-nowrap">
              Sites <span className="text-blue-400">Monitoring</span> Portal
            </h1>
          </div>
          {isCollapsed && (
            <div className="text-xl font-bold text-blue-400">
              SMP
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 px-2">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:text-white hover:bg-slate-700"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <span className={cn(
                      "flex-shrink-0 transition-all duration-300",
                      isCollapsed ? "mr-0" : "mr-3"
                    )}>
                      {item.icon}
                    </span>
                    
                    <span className={cn(
                      "transition-all duration-300 overflow-hidden whitespace-nowrap",
                      isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
                    )}>
                      {item.name}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-16 left-0 right-0 px-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-red-300 hover:text-red-100 hover:bg-red-900",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            onClick={logout}
          >
            <svg className={cn(
              "h-5 w-5 flex-shrink-0 transition-all duration-300",
              isCollapsed ? "mr-0" : "mr-3"
            )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={cn(
              "transition-all duration-300 overflow-hidden whitespace-nowrap",
              isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
            )}>
              Logout
            </span>
          </Button>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className={cn(
            "transition-all duration-300 overflow-hidden",
            isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
          )}>
            <div className="text-xs text-slate-400 text-center">
              <p>© 2025 Sites Portal</p>
              <p className="mt-1">v1.0.0</p>
            </div>
          </div>
          {isCollapsed && (
            <div className="text-xs text-slate-400 text-center">
              <p>v1.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
