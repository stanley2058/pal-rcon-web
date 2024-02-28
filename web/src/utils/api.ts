export function getApiUrl() {
  if (import.meta.env.PROD) return window.origin;
  return import.meta.env.VITE_BACKEND_URL;
}
