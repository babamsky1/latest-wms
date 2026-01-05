/**
 * React Query DevTools - Development debugging tools
 * Provides real-time query inspection and debugging capabilities
 */

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bug, Eye, EyeOff } from 'lucide-react';

/**
 * React Query DevTools wrapper with toggle functionality
 * Only shows in development mode
 */
export const QueryDevTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsVisible(!isVisible)}
          className="bg-background shadow-lg border-2"
        >
          <Bug className="h-4 w-4 mr-2" />
          {isVisible ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Hide DevTools
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Show DevTools
            </>
          )}
        </Button>
      </div>

      {/* DevTools Panel */}
      {isVisible && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          styleNonce={undefined}
        />
      )}
    </>
  );
};

/**
 * Development info panel showing query status
 */
export const DevInfoPanel: React.FC = () => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-40 bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Bug className="h-3 w-3" />
        <span>Development Mode</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
};
