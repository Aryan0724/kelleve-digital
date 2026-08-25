// Development local API endpoint (using local network IP for physical device testing)
// Production: "https://truedial.in/api/v1"
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://truedial.in/api/v1";
export const APP_PLATFORM_HEADER = "truedial";
export const AUTH_TOKEN_HEADER = "Authorization";
export const AUTH_TOKEN_PREFIX = "Bearer";
export const APP_NAME = "TrueDial";
export const APP_VERSION = "1.0.0";
