// Client for the backend auth endpoints (src/auth/auth.controller.ts).
// In dev, Vite proxies /auth to the Nest server; in prod, Nest serves the app on the same origin.

import { ApiError, post } from "../tools/Request";

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

type TokenRequest =
  | { grantType: "password"; email: string; password: string }
  | { grantType: "refresh_token"; refreshToken: string };

const TOKEN_STORAGE_KEY = "auth.tokens";

function saveTokens(tokens: TokenResponse) {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

function getTokens(): TokenResponse | null {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TokenResponse;
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
}

function clearTokens() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function requestToken(request: TokenRequest): Promise<TokenResponse> {
  const tokens = await post<TokenResponse>("/auth/token", request);
  saveTokens(tokens);
  return tokens;
}

const AuthService = {
  signup(request: SignupRequest): Promise<SignupResponse> {
    return post<SignupResponse>("/auth/signup", request);
  },

  login(email: string, password: string): Promise<TokenResponse> {
    return requestToken({ grantType: "password", email, password });
  },

  refresh(): Promise<TokenResponse> {
    const tokens = getTokens();
    if (!tokens) return Promise.reject(new ApiError(401, "Not signed in."));
    return requestToken({ grantType: "refresh_token", refreshToken: tokens.refreshToken });
  },

  logout() {
    clearTokens();
  },

  getTokens,

  isAuthenticated(): boolean {
    return getTokens() !== null;
  },
};

export default AuthService;
