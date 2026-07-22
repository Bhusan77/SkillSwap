const API_ORIGIN = (import.meta.env.VITE_API_URL as string).replace(/\/api$/, "");

// Profile images can be either a relative backend path (/uploads/...)
// or, in the future, a full external URL (e.g. a Google OAuth avatar).
// This resolves either case to something the browser can actually load.
export const resolveImageUrl = (path?: string | null): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
};