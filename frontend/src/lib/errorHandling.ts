import { toast } from "sonner";
import { AxiosError } from "axios";

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

export class ErrorService {
  // Handle different types of errors
  static handleError(error: unknown, context?: string): AppError {
    let appError: AppError;

    if (error instanceof AxiosError) {
      appError = this.handleApiError(error);
    } else if (error instanceof Error) {
      appError = {
        code: "GENERIC_ERROR",
        message: error.message,
        details: { context },
      };
    } else if (typeof error === "string") {
      appError = {
        code: "STRING_ERROR",
        message: error,
        details: { context },
      };
    } else {
      appError = {
        code: "UNKNOWN_ERROR",
        message: "An unknown error occurred",
        details: { originalError: error, context },
      };
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error(`Error in ${context || "Unknown"}:`, error);
    }

    // In production, send to error reporting service
    if (process.env.NODE_ENV === "production") {
      this.reportError(appError, context);
    }

    return appError;
  }

  // Handle API errors specifically
  static handleApiError(error: AxiosError): AppError {
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        return {
          code: "BAD_REQUEST",
          message:
            (data?.error as string) ||
            (data?.message as string) ||
            "Invalid request",
          statusCode: 400,
          details: data,
        };

      case 401:
        return {
          code: "UNAUTHORIZED",
          message: "You need to log in to access this resource",
          statusCode: 401,
          details: data,
        };

      case 403:
        return {
          code: "FORBIDDEN",
          message: "You don't have permission to access this resource",
          statusCode: 403,
          details: data,
        };

      case 404:
        return {
          code: "NOT_FOUND",
          message:
            (data?.error as string) || "The requested resource was not found",
          statusCode: 404,
          details: data,
        };

      case 409:
        return {
          code: "CONFLICT",
          message: (data?.error as string) || "This resource already exists",
          statusCode: 409,
          details: data,
        };

      case 422:
        return {
          code: "VALIDATION_ERROR",
          message:
            (data?.error as string) || "Please check your input and try again",
          statusCode: 422,
          details: data,
        };

      case 429:
        return {
          code: "RATE_LIMIT",
          message: "Too many requests. Please wait a moment and try again",
          statusCode: 429,
          details: data,
        };

      case 500:
        return {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong on our end. Please try again later",
          statusCode: 500,
          details: data,
        };

      case 502:
      case 503:
      case 504:
        return {
          code: "SERVICE_UNAVAILABLE",
          message:
            "The service is temporarily unavailable. Please try again later",
          statusCode: status,
          details: data,
        };

      default:
        return {
          code: "NETWORK_ERROR",
          message: error.message || "Network error occurred",
          statusCode: status,
          details: { originalError: error.toJSON() },
        };
    }
  }

  // Show user-friendly error messages
  static showErrorToast(error: AppError, customMessage?: string) {
    const message = customMessage || this.getUserFriendlyMessage(error);

    // Use different toast types based on error severity
    if (error.statusCode && error.statusCode >= 500) {
      toast.error(message, {
        description:
          "Please try again later or contact support if the problem persists.",
        duration: 5000,
      });
    } else if (error.code === "UNAUTHORIZED") {
      toast.error("Please log in to continue", {
        description: "Your session may have expired.",
        duration: 4000,
      });
    } else if (error.code === "VALIDATION_ERROR") {
      toast.error(message, {
        description: "Please check your input and try again.",
        duration: 4000,
      });
    } else {
      toast.error(message, {
        duration: 3000,
      });
    }
  }

  // Get user-friendly error messages
  static getUserFriendlyMessage(error: AppError): string {
    const errorMessages: Record<string, string> = {
      NETWORK_ERROR: "Please check your internet connection and try again",
      UNAUTHORIZED: "Please log in to continue",
      FORBIDDEN: "You don't have permission to perform this action",
      NOT_FOUND: "The requested item could not be found",
      VALIDATION_ERROR: "Please check your input and try again",
      RATE_LIMIT: "Too many requests. Please wait a moment and try again",
      INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later",
      SERVICE_UNAVAILABLE: "The service is temporarily unavailable",
    };

    return errorMessages[error.code] || error.message;
  }

  // Report error to external service (implement based on your error tracking service)
  private static reportError(error: AppError, context?: string) {
    // Example: Send to Sentry, LogRocket, or your custom error tracking service
    // Sentry.captureException(error, { tags: { context } });

    // For now, just log to console in production
    console.error("Production Error:", {
      error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  }

  // Validation helpers
  static createValidationError(field: string, message: string): AppError {
    return {
      code: "VALIDATION_ERROR",
      message: `${field}: ${message}`,
      details: { field, validationMessage: message },
    };
  }

  // Check if error is a specific type
  static isNetworkError(error: AppError): boolean {
    return (
      error.code === "NETWORK_ERROR" ||
      (error.statusCode !== undefined && error.statusCode >= 500)
    );
  }

  static isAuthError(error: AppError): boolean {
    return error.code === "UNAUTHORIZED" || error.code === "FORBIDDEN";
  }

  static isValidationError(error: AppError): boolean {
    return error.code === "VALIDATION_ERROR" || error.statusCode === 422;
  }
}

// Helper function for async operations
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: string,
  showToast: boolean = true
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    const appError = ErrorService.handleError(error, context);

    if (showToast) {
      ErrorService.showErrorToast(appError);
    }

    return null;
  }
};

// React hook for error handling
export const useErrorHandler = () => {
  const handleError = (
    error: unknown,
    context?: string,
    showToast: boolean = true
  ) => {
    const appError = ErrorService.handleError(error, context);

    if (showToast) {
      ErrorService.showErrorToast(appError);
    }

    return appError;
  };

  return { handleError, ErrorService };
};
