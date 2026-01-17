export type ApiResponse<T = any> = {
  statusCode: number;
  message: string;
  data?: T;
  success?: boolean;
};

export type ApiError = {
  statusCode: number;
  message: string | string[];
  data?: any;
};

export const handleApiResponse = (response: ApiResponse): ApiResponse => {
  // Success responses
  if (response?.statusCode === 200 || response?.statusCode === 201) {
    return {
      statusCode: response.statusCode,
      message: response.message || "Operation successful",
      data: response.data,
      success: true,
    };
  }

  // Handle specific error status codes
  const errorMessages: Record<number, string> = {
    400: "Invalid request parameters",
    401: "Unauthorized - Please log in again",
    403: "Forbidden - You don't have access",
    404: "Resource not found",
    409: "Conflict - Resource already exists",
    429: "Too many requests - Please try again later",
    500: "Internal server error",
    502: "Bad gateway",
    503: "Service unavailable",
  };

  const message =
    response?.message || errorMessages[response?.statusCode] || "An error occurred";

  throw {
    statusCode: response?.statusCode,
    message,
    data: response?.data,
  } as ApiError;
};

export const handleApiError = (error: any): ApiError => {
  // Handle NestJS API errors
  if (error?.statusCode && error?.message) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      data: error.data,
    };
  }

  // Handle fetch errors
  if (error instanceof TypeError) {
    return {
      statusCode: 0,
      message: "Network error - Please check your connection",
    };
  }

  // Default error
  return {
    statusCode: error?.statusCode || 500,
    message: error?.message || "Something went wrong",
    data: error?.data,
  };
};
