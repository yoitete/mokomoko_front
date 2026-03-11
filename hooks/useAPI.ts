import axios, { AxiosError } from "axios";
import { useCallback, useRef } from "react";
import { useAuth } from "./useAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const useAPI = () => {
  const { token, refreshToken } = useAuth();

  // refで最新のtoken/refreshTokenを保持し、useCallbackの依存配列から除外して参照安定性を確保
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const refreshTokenRef = useRef(refreshToken);
  refreshTokenRef.current = refreshToken;

  // トークン付きでAPIリクエストを作成する関数（依存なしで安定）
  const createAuthenticatedRequest = useCallback(async () => {
    const currentToken = tokenRef.current;

    const api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
      },
    });

    // レスポンスインターセプターでトークン期限切れを処理
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        // 再試行済みフラグで無限ループを防止
        if (error.response?.status === 401 && tokenRef.current && !error.config?._isRetryAttempt) {
          try {
            const newToken = await refreshTokenRef.current();
            const config = error.config;
            config.headers.Authorization = `Bearer ${newToken}`;
            config._isRetryAttempt = true;
            return axios(config);
          } catch {
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return api;
  }, []);

  const get = useCallback(
    async <T = unknown>(url: string) => {
      try {
        const api = await createAuthenticatedRequest();
        const response = await api.get<T>(url);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status !== 404) {
          console.error("API Error:", url, axiosError?.response?.status, (error as Error)?.message);
        }
        throw error;
      }
    },
    [createAuthenticatedRequest]
  );

  const post = useCallback(
    async <T = unknown>(url: string, data?: unknown) => {
      const api = await createAuthenticatedRequest();
      const response = await api.post<T>(url, data);
      return response.data;
    },
    [createAuthenticatedRequest]
  );

  const postFormData = useCallback(
    async <T = unknown>(url: string, formData: FormData) => {
      const api = await createAuthenticatedRequest();
      const response = await api.post<T>(url, formData, {
        headers: {
          "Content-Type": undefined,
        },
      });
      return response.data;
    },
    [createAuthenticatedRequest]
  );

  const putFormData = useCallback(
    async <T = unknown>(url: string, formData: FormData) => {
      const api = await createAuthenticatedRequest();
      const response = await api.put<T>(url, formData, {
        headers: {
          "Content-Type": undefined,
        },
      });
      return response.data;
    },
    [createAuthenticatedRequest]
  );

  const put = useCallback(
    async <T = unknown>(url: string, data?: unknown) => {
      const api = await createAuthenticatedRequest();
      const response = await api.put<T>(url, data);
      return response.data;
    },
    [createAuthenticatedRequest]
  );

  const del = useCallback(
    async <T = unknown>(url: string) => {
      const api = await createAuthenticatedRequest();
      const response = await api.delete<T>(url);
      return response.data;
    },
    [createAuthenticatedRequest]
  );

  return { get, post, postFormData, putFormData, put, delete: del };
};
