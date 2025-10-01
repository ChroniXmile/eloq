'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 p-4">
          <div className="pool-ball-solid w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center">
            <AlertCircle className="h-12 w-12" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground max-w-md">
              An unexpected error occurred. Our team has been notified.
            </p>
            
            <div className="mt-4 p-4 bg-muted rounded-lg text-left text-sm font-mono max-w-md">
              {this.state.error?.message && (
                <p className="truncate">{this.state.error.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;