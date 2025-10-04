import { useCallback, useMemo } from "react";
import { useGet, usePost, useDelete } from "./useSWRAPI";
import { mutate } from "swr";
import { authTokenAtom } from "@/lib/authAtoms";
import { useAtomValue } from "jotai";

export const useFavorites = (userId: number | null = null) => {
  const token = useAtomValue(authTokenAtom);
  // SWRを使用してお気に入り一覧を取得
  const {
    data: favoritesData,
    error,
    isLoading,
  } = useGet<{ post_id: number }[]>(
    token && userId ? `/favorites?user_id=${userId}` : null,
    {
      revalidateOnFocus: false, // お気に入りは頻繁に変更されないため
      dedupingInterval: 0,
    }
  );

  // デバッグログ
  console.log("useFavorites - userId:", userId);
  console.log("useFavorites - token:", token);
  console.log(
    "useFavorites - endpoint:",
    token && userId ? `/favorites?user_id=${userId}` : null
  );
  console.log("useFavorites - isLoading:", isLoading);
  console.log("useFavorites - error:", error);

  // お気に入りIDの配列を生成（useMemoで最適化）
  const favorites = useMemo(() => {
    console.log("useFavorites - favoritesData:", favoritesData);
    const result = favoritesData?.map((fav) => fav.post_id) || [];
    console.log("useFavorites - favorites result:", result);
    return result;
  }, [favoritesData]);

  // ミューテーション用のフック
  const postData = usePost();
  const deleteData = useDelete();

  // お気に入りを追加
  const addFavorite = useCallback(
    async (postId: number) => {
      if (!userId) {
        console.error("User ID is required to add favorite");
        return;
      }
      try {
        console.log("addFavorite - adding:", {
          user_id: userId,
          post_id: postId,
        });
        const response = await postData(`/favorites`, {
          user_id: userId,
          post_id: postId,
        });
        console.log("addFavorite - response:", response);
        // キャッシュを更新
        mutate(`/favorites?user_id=${userId}`);
        console.log("addFavorite - cache updated");
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
      if (!userId) {
        console.error("User ID is required to remove favorite");
        return;
      }
      try {
        console.log("removeFavorite - removing:", {
          user_id: userId,
          post_id: postId,
        });
        const response = await deleteData(
          `/favorites?user_id=${userId}&post_id=${postId}`
        );
        console.log("removeFavorite - response:", response);
        // キャッシュを更新
        mutate(`/favorites?user_id=${userId}`);
        console.log("removeFavorite - cache updated");
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
      console.log("toggleFavorite - postId:", postId);
      console.log("toggleFavorite - userId:", userId);
      console.log("toggleFavorite - favorites:", favorites);
      console.log("toggleFavorite - isFavorite:", favorites.includes(postId));

      if (!userId) {
        console.error(
          "toggleFavorite - userId is null, cannot toggle favorite"
        );
        return;
      }

      if (favorites.includes(postId)) {
        console.log("toggleFavorite - removing favorite");
        await removeFavorite(postId);
      } else {
        console.log("toggleFavorite - adding favorite");
        await addFavorite(postId);
      }
    },
    [favorites, addFavorite, removeFavorite, userId]
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
