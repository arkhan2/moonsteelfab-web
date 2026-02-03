export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "https://moonsteelfab-api.mynickar.workers.dev") ?? ""
};

