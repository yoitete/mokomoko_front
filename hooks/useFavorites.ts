import { useState, useCallback, useEffect } from "react";
import { useAPI } from "./useAPI";

export const useFavorites = (userId: number = 1) => {
  const { get, post, delete: del } = useAPI();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // お気に入り一覧を取得
  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await get<{ post_id: number }[]>(
        `/favorites?user_id=${userId}`
      );
      const favoriteIds = data.map((fav) => fav.post_id);
      setFavorites(favoriteIds);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "お気に入りの取得に失敗しました";
      setError(errorMessage);
      console.error("Failed to fetch favorites:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // お気に入りを追加
  const addFavorite = useCallback(
    async (postId: number) => {
      try {
        setError(null);
        await post(`/favorites`, { user_id: userId, post_id: postId });
        setFavorites((prev) => [...prev, postId]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "お気に入りの追加に失敗しました";
        setError(errorMessage);
        throw err;
      }
    },
    [post, userId]
  );

  // お気に入りを削除
  const removeFavorite = useCallback(
    async (postId: number) => {
      try {
        setError(null);
        await del(`/favorites?user_id=${userId}&post_id=${postId}`);
        setFavorites((prev) => prev.filter((id) => id !== postId));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "お気に入りの削除に失敗しました";
        setError(errorMessage);
        throw err;
      }
    },
    [del, userId]
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

  // コンポーネントマウント時にお気に入り一覧を取得
  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  return {
    favorites,
    isLoading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};
