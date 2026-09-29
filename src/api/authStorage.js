const AUTH_DATA_KEY = "aurevia_auth";

export function saveAuth(authData) {
  localStorage.setItem(
    AUTH_DATA_KEY,
    JSON.stringify(authData),
  );
}

export function getAuth() {
  const storedValue = localStorage.getItem(AUTH_DATA_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    localStorage.removeItem(AUTH_DATA_KEY);
    return null;
  }
}

export function getAccessToken() {
  return getAuth()?.accessToken ?? null;
}

export function clearAuth() {
  localStorage.removeItem(AUTH_DATA_KEY);
}