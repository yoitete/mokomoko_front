import axios from "axios";
import { useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAPI = () => {
  const get = useCallback(async <T = unknown>(url: string) => {
    console.log("API Request:", API_BASE_URL + url);
    try {
      const response = await api.get<T>(url);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }, []);

  const post = useCallback(async <T = unknown>(url: string, data?: unknown) => {
    const response = await api.post<T>(url, data);
    return response.data;
  }, []);

  // 画像アップロード用のPOSTメソッド
  const postFormData = useCallback(
    async <T = unknown>(url: string, formData: FormData) => {
      const response = await api.post<T>(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    []
  );

  const put = useCallback(async <T = unknown>(url: string, data?: unknown) => {
    const response = await api.put<T>(url, data);
    return response.data;
  }, []);

  const del = useCallback(async <T = unknown>(url: string) => {
    const response = await api.delete<T>(url);
    return response.data;
  }, []);

  return { get, post, postFormData, put, delete: del };
};
