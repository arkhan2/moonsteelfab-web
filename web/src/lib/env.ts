// Get API base URL from environment variable
// This is replaced at build time by Next.js for NEXT_PUBLIC_* vars
const getApiBaseUrl = (): string => {
  const envVar = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  
  // Validate that we have a non-empty, valid URL
  if (envVar && envVar.length > 0 && (envVar.startsWith("http://") || envVar.startsWith("https://"))) {
    return envVar.replace(/\/+$/, "");
  }
  
  // Fallback to localhost for local development
  // In production, this should never be used if env var is set correctly
  const fallback = "http://127.0.0.1:8787";
  
  // Log warning in browser console if using fallback (helps debug)
  if (typeof window !== "undefined") {
    console.warn(
      "⚠️ NEXT_PUBLIC_API_BASE_URL not set or invalid. Using fallback:",
      fallback,
      "\nSet NEXT_PUBLIC_API_BASE_URL in Cloudflare Pages environment variables."
    );
  }
  
  return fallback;
};

export const env = {
  apiBaseUrl: getApiBaseUrl()
};
