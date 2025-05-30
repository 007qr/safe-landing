import { createSignal } from "solid-js";
import { jwtDecode } from "jwt-decode";

const [accessToken, setAccessTokenSignal] = createSignal<string | null>(null);

export function storeAccessToken(token: string) {
    setAccessTokenSignal(token);
}

export function getAccessToken() {
    return accessToken();
}

export function clearAuth() {
    setAccessTokenSignal(null);
    localStorage.removeItem("refresh_token");
}

export function storeRefreshToken(token: string) {
    localStorage.setItem("refresh_token", token);
}

export function getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
}

export function isTokenExpired(token: string) {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
}

export type AuthState = {
    isAuthenticated: boolean
    user: any | null
    authTokens: AuthTokens | null
    roles?: { role: string; tenant: string }[]
}

export type AuthTokens = {
    token: string
    refresh_token: string
    exp: Date | string
}

export interface TokenProvider {
  getAuthTokens: () => Promise<AuthState>;
  refreshAuthTokens: () => Promise<AuthTokens>;
}
