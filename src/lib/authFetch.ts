import {
    getAccessToken,
    isTokenExpired,
    storeAccessToken,
    getRefreshToken,
    clearAuth,
} from "./auth";
import { refreshAccessToken } from "./authApi";

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
    let token = getAccessToken();

    if (!token || isTokenExpired(token)) {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            clearAuth();
            throw new Error("No refresh token available");
        }

        try {
            token = await refreshAccessToken(refreshToken);
            storeAccessToken(token!);
        } catch {
            clearAuth();
            throw new Error("Session expired");
        }
    }

    return fetch(input, {
        ...init,
        headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });
}
