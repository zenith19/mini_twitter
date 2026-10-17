import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import client, { setAuthToken, setUnauthorizedHandler } from "../api/client";

const STORAGE_KEY = "loginData";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Corrupt or unavailable storage should log the user out, not crash the
    // app. Several components used to call JSON.parse(...).id at module
    // scope, which threw on a hard refresh while logged out.
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = readStoredUser();
    if (stored?.authentication_token) setAuthToken(stored.authentication_token);
    return stored;
  });

  const login = useCallback(async (credentials) => {
    const { data } = await client.post("/v1/sessions", credentials);
    setAuthToken(data.authentication_token);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  const signup = useCallback(async (details) => {
    const { data } = await client.post("/v1/users", details);
    setAuthToken(data.authentication_token);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  // Drops local session state without calling the API. Used when the server
  // has already told us the token is no longer valid.
  const clearSession = useCallback(() => {
    setAuthToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await client.delete("/v1/sessions");
    } catch {
      // A failed revoke should not strand the user in a logged-in UI.
    }
    clearSession();
  }, [clearSession]);

  // Without this, a revoked token left the UI looking signed in: every request
  // returned 401, an error appeared, and the app still showed the user's name.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      navigate("/login", { replace: true, state: { expired: true } });
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession, navigate]);

  const value = useMemo(
    () => ({ user, isSignedIn: Boolean(user), login, signup, logout }),
    [user, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
