import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { useAPI } from "./useAPI";
import { useAuth } from "./useAuth";
import { useCallback } from "react";

// カスタム設定の型定義
interface CustomSWRConfiguration<T = unknown>
  extends SWRConfiguration<T, unknown> {
  requireAuth?: boolean;
}

// SWR用のフェッチャー関数を作成するカスタムフック
export const useSWRAPI = () => {
  const { get, post, put, delete: del } = useAPI();
  const { isAuthenticated } = useAuth();

  // GET用のフェッチャー
  const fetcher = useCallback(
    async (url: string) => {
      return await get(url);
    },
    [get]
  );

  return {
    fetcher,
    post,
    put,
    delete: del,
    isAuthenticated,
  };
};

// GET用のSWRフック
export const useGet = <T = unknown>(
  url: string | null,
  config?: CustomSWRConfiguration<T>
): SWRResponse<T> => {
  const { fetcher, isAuthenticated } = useSWRAPI();

  // デフォルト設定（requireAuthのデフォルトはfalse）
  const requireAuth = config?.requireAuth ?? false;

  // 認証が必要なエンドポイントの場合、認証されていない場合はリクエストを無効化
  const shouldFetch = url && (!requireAuth || isAuthenticated);

  return useSWR<T>(
    shouldFetch ? url : null,
    (url: string) => fetcher(url) as Promise<T>,
    {
      // 最適化されたデフォルト設定
      revalidateOnFocus: true, // フォーカス時に再検証（デフォルトtrue）
      revalidateOnReconnect: true, // 再接続時に再検証
      dedupingInterval: 0,
      errorRetryCount: 3, // エラー時のリトライ回数
      errorRetryInterval: 1000, // リトライ間隔（1秒）
      refreshInterval: 0, // 自動リフレッシュは無効（必要に応じて個別設定）
      ...config, // ユーザー設定で上書き可能
    }
  );
};

// POST用のミューテーション関数を作成するフック
export const usePost = <T = unknown>() => {
  const { post } = useSWRAPI();

  const postData = useCallback(
    async (url: string, data?: unknown) => {
      return await post<T>(url, data);
    },
    [post]
  );

  return postData;
};

// PUT用のミューテーション関数を作成するフック
export const usePut = <T = unknown>() => {
  const { put } = useSWRAPI();

  const putData = useCallback(
    async (url: string, data?: unknown) => {
      return await put<T>(url, data);
    },
    [put]
  );

  return putData;
};

// DELETE用のミューテーション関数を作成するフック
export const useDelete = <T = unknown>() => {
  const { delete: del } = useSWRAPI();

  const deleteData = useCallback(
    async (url: string) => {
      return await del<T>(url);
    },
    [del]
  );

  return deleteData;
};
