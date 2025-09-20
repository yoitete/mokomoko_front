import { useCallback, useMemo } from "react";
import { useGet, usePost, useDelete } from "./useSWRAPI";
import { mutate } from "swr";
import { authTokenAtom } from "@/lib/authAtoms";
import { useAtomValue } from "jotai";

export const useFavorites = (userId: number = 1) => {
  const token = useAtomValue(authTokenAtom);
  // SWRを使用してお気に入り一覧を取得
  const {
    data: favoritesData,
    error,
    isLoading,
  } = useGet<{ post_id: number }[]>(
    token ? `/favorites?user_id=${userId}` : null,
    {
      revalidateOnFocus: false, // お気に入りは頻繁に変更されないため
      dedupingInterval: 0,
    }
  );

  // お気に入りIDの配列を生成（useMemoで最適化）
  const favorites = useMemo(() => {
    return favoritesData?.map((fav) => fav.post_id) || [];
  }, [favoritesData]);

  // ミューテーション用のフック
  const postData = usePost();
  const deleteData = useDelete();

  // お気に入りを追加
  const addFavorite = useCallback(
    async (postId: number) => {
      try {
        await postData(`/favorites`, { user_id: userId, post_id: postId });
        // キャッシュを更新
        mutate(`/favorites?user_id=${userId}`);
      } catch (err) {
        console.error("Failed to add favorite:", err);
        throw err;
      }
    },
    [postData, userId]
  );

  // お気に入りを削除
  const removeFavorite = useCallback(
    async (postId: number) => {
      try {
        await deleteData(`/favorites?user_id=${userId}&post_id=${postId}`);
        // キャッシュを更新
        mutate(`/favorites?user_id=${userId}`);
      } catch (err) {
        console.error("Failed to remove favorite:", err);
        throw err;
      }
    },
    [deleteData, userId]
  );

  // お気に入りを切り替え
  const toggleFavorite = useCallback(
    async (postId: number) => {
      if (favorites.includes(postId)) {
        await removeFavorite(postId);
      } else {
        await addFavorite(postId);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  // お気に入り状態をチェック
  const isFavorite = useCallback(
    (postId: number) => {
      return favorites.includes(postId);
    },
    [favorites]
  );

  return {
    favorites,
    isLoading,
    error: error?.message || null,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};
