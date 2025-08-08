"use client";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>© 2025 Sites Monitoring Portal</span>
          <span className="text-gray-400">|</span>
          <span>All rights reserved</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </button>
          <span className="text-gray-400">|</span>
          <button className="hover:text-gray-900 transition-colors">
            Terms of Service
          </button>
          <span className="text-gray-400">|</span>
          <span className="text-green-600 flex items-center">
            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            System Online
          </span>
        </div>
      </div>
    </footer>
  );
}
