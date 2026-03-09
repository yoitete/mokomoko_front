import axios, { AxiosError } from "axios";
import { useCallback } from "react";
import { useAuth } from "./useAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const useAPI = () => {
  const { token, refreshToken } = useAuth();

  // トークン付きでAPIリクエストを作成する関数
  const createAuthenticatedRequest = useCallback(async () => {
    try {
      const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      // レスポンスインターセプターでトークン期限切れを処理
      api.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response?.status === 401 && token) {
            try {
              // トークンをリフレッシュして再試行
              const newToken = await refreshToken();
              const config = error.config;
              config.headers.Authorization = `Bearer ${newToken}`;
              return axios(config);
            } catch {
              // リフレッシュに失敗した場合は元のエラーを返す
              return Promise.reject(error);
            }
          }
          return Promise.reject(error);
        }
      );

      return api;
    } catch (error) {
      console.error("API request creation failed:", error);
      throw error;
    }
  }, [token, refreshToken]);
  const get = useCallback(
    async <T = unknown>(url: string) => {
      try {
        const api = await createAuthenticatedRequest();
        const response = await api.get<T>(url);
        return response.data;
      } catch (error) {
        // 404エラーの場合は詳細なログを出さない
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

  // 画像アップロード用のPOSTメソッド
  const postFormData = useCallback(
    async <T = unknown>(url: string, formData: FormData) => {
      const api = await createAuthenticatedRequest();
      // Content-Typeを手動設定せず、axiosにFormDataを自動検出させる（boundary付与のため）
      const response = await api.post<T>(url, formData, {
        headers: {
          "Content-Type": undefined,
        },
      });
      return response.data;
    },
    [createAuthenticatedRequest]
  );

  // 画像アップロード用のPUTメソッド
  const putFormData = useCallback(
    async <T = unknown>(url: string, formData: FormData) => {
      const api = await createAuthenticatedRequest();
      // Content-Typeを手動設定せず、axiosにFormDataを自動検出させる（boundary付与のため）
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
