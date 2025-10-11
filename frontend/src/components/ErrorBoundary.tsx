"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error | null;
    resetError: () => void;
  }>;
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Boundary caught an error:", error);
      console.error("Error Info:", errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === "production") {
      // reportError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      if (Fallback) {
        return (
          <Fallback error={this.state.error} resetError={this.resetError} />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
function DefaultErrorFallback({
  error,
  resetError,
}: {
  error: Error | null;
  resetError: () => void;
}) {
  const isChunkError =
    error?.message?.includes("Loading chunk") ||
    error?.message?.includes("ChunkLoadError");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isChunkError ? "Update Required" : "Something went wrong"}
        </h1>

        <p className="text-gray-600 mb-6">
          {isChunkError
            ? "The application has been updated. Please refresh the page to get the latest version."
            : "We're sorry, but something unexpected happened. Please try again."}
        </p>

        {process.env.NODE_ENV === "development" && error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
            <p className="text-sm text-red-700 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => {
              if (isChunkError) {
                window.location.reload();
              } else {
                resetError();
              }
            }}
            className="flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isChunkError ? "Refresh Page" : "Try Again"}
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

// Component Error Boundary for smaller components
function ComponentErrorBoundary({
  children,
  name = "Component",
}: {
  children: React.ReactNode;
  name?: string;
}) {
  return (
    <ErrorBoundaryClass
      fallback={({ error, resetError }) => (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center text-red-700 mb-2">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="font-medium">{name} Error</span>
          </div>
          <p className="text-sm text-red-600 mb-3">
            This component encountered an error and couldn&apos;t render
            properly.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-red-500 font-mono mb-3">
              {error?.message}
            </p>
          )}
          <Button size="sm" onClick={resetError}>
            Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundaryClass>
  );
}

// Export both the class and functional components
export { ErrorBoundaryClass as ErrorBoundary, ComponentErrorBoundary };
export default ErrorBoundaryClass;
