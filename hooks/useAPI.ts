import axios, { AxiosError } from "axios";
import { useCallback } from "react";
import { useAuth } from "./useAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// エラー情報の型定義
interface ErrorInfo {
  url: string;
  errorType: string;
  message: string;
  code: string;
  status: number | string;
  statusText: string;
  responseData: unknown;
  isNetworkError: boolean;
  isTimeout: boolean;
  isConnectionRefused: boolean;
}

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
      const fullUrl = API_BASE_URL + url;
      console.log("API Request:", {
        url: fullUrl,
        baseURL: API_BASE_URL,
        endpoint: url,
        timestamp: new Date().toISOString(),
      });
      try {
        const api = await createAuthenticatedRequest();
        const response = await api.get<T>(url);
        console.log("API Response:", response.data);
        return response.data;
      } catch (error) {
        // 404エラーの場合は詳細なログを出さない
        if (
          (error as unknown as { response?: { status: number } })?.response
            ?.status === 404
        ) {
          console.log("API 404:", API_BASE_URL + url);
        } else {
          // より詳細なエラー情報を取得
          const errorInfo: ErrorInfo = {
            url: API_BASE_URL + url,
            errorType: error?.constructor?.name || "Unknown",
            message: (error as Error)?.message || "No message",
            code: (error as AxiosError)?.code || "No code",
            status: (error as AxiosError)?.response?.status || "No status",
            statusText:
              (error as AxiosError)?.response?.statusText || "No status text",
            responseData:
              (error as AxiosError)?.response?.data || "No response data",
            isNetworkError: !(error as AxiosError)?.response,
            isTimeout: (error as AxiosError)?.code === "ECONNABORTED",
            isConnectionRefused: (error as AxiosError)?.code === "ECONNREFUSED",
          };

          console.error("API Error Details:", errorInfo);

          // ネットワークエラーの場合は追加の診断情報を表示
          if (errorInfo.isNetworkError) {
            console.error("Network Error - Possible causes:");
            console.error("1. Backend server is not running");
            console.error("2. Wrong API URL:", API_BASE_URL);
            console.error("3. CORS issues");
            console.error("4. Firewall blocking the connection");
          }
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
      const response = await api.post<T>(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      return response.data;
    },
    [createAuthenticatedRequest, token]
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

  return { get, post, postFormData, put, delete: del };
};
