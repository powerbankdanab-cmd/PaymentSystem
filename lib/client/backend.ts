const DEFAULT_USERS_BACKEND_URL = "https://usersbackend-6yhs.onrender.com";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getUsersBackendBaseUrl() {
  const configured =
    process.env.NEXT_PUBLIC_USERS_BACKEND_URL || DEFAULT_USERS_BACKEND_URL;

  return trimTrailingSlash(configured);
}

export function getUsersBackendUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getUsersBackendBaseUrl()}${normalizedPath}`;
}
