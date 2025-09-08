import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAPI = () => {
  const get = async <T = unknown>(url: string) => {
    const response = await api.get<T>(url);
    return response.data;
  };

  const post = async <T = unknown>(url: string, data?: unknown) => {
    const response = await api.post<T>(url, data);
    return response.data;
  };

  // 画像アップロード用のPOSTメソッド
  const postFormData = async <T = unknown>(url: string, formData: FormData) => {
    const response = await api.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const put = async <T = unknown>(url: string, data?: unknown) => {
    const response = await api.put<T>(url, data);
    return response.data;
  };

  const del = async <T = unknown>(url: string) => {
    const response = await api.delete<T>(url);
    return response.data;
  };

  return { get, post, postFormData, put, delete: del };
};
