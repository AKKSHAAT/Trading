import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // Handle request errors
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // You could stop loading state here
    // e.g., dispatch(setLoading(false))

    return response;
  },
  (error: AxiosError) => {
    // You could stop loading state here
    // e.g., dispatch(setLoading(false))

    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401: // Unauthorized
          // Handle token expiration or invalid token
          localStorage.removeItem("token");
          // Redirect to login page or show notification
          // window.location.href = '/auth/login';
          break;

        case 403: // Forbidden
          // Handle forbidden requests
          console.error("You do not have permission to access this resource");
          break;

        case 404: // Not found
          console.error("Resource not found");
          break;

        case 500: // Server error
          console.error("Server error occurred");
          break;

        default:
          console.error(`Error with status code: ${status}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from the server");
    } else {
      // Something happened in setting up the request
      console.error("Error setting up the request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
