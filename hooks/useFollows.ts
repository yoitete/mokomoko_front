import { useCallback } from "react";
import { useGet, usePost, useDelete } from "./useSWRAPI";
import { mutate } from "swr";

export type FollowUser = {
  id: number;
  name: string;
  nickname?: string | null;
  selected_icon?: string | null;
  profile_image?: string | null;
};

export const useFollowStatus = (
  currentUserId: number | null,
  targetUserId: number | null
) => {
  const { data, error, isLoading } = useGet<{ is_following: boolean }>(
    currentUserId && targetUserId
      ? `/relationships/check?following_id=${targetUserId}`
      : null,
    {
      requireAuth: true,
      revalidateOnFocus: false,
    }
  );

  const postData = usePost();
  const deleteData = useDelete();

  const isFollowing = data?.is_following ?? false;

  const follow = useCallback(async () => {
    if (!targetUserId) return;
    try {
      await postData(`/relationships`, { following_id: targetUserId });
      mutate(`/relationships/check?following_id=${targetUserId}`);
      mutate(`/relationships/followers?user_id=${targetUserId}`);
      mutate(`/relationships/following?user_id=${currentUserId}`);
    } catch (err) {
      console.error("Failed to follow:", err);
      throw err;
    }
  }, [postData, targetUserId, currentUserId]);

  const unfollow = useCallback(async () => {
    if (!targetUserId) return;
    try {
      await deleteData(`/relationships?following_id=${targetUserId}`);
      mutate(`/relationships/check?following_id=${targetUserId}`);
      mutate(`/relationships/followers?user_id=${targetUserId}`);
      mutate(`/relationships/following?user_id=${currentUserId}`);
    } catch (err) {
      console.error("Failed to unfollow:", err);
      throw err;
    }
  }, [deleteData, targetUserId, currentUserId]);

  const toggleFollow = useCallback(async () => {
    if (isFollowing) {
      await unfollow();
    } else {
      await follow();
    }
  }, [isFollowing, follow, unfollow]);

  return {
    isFollowing,
    isLoading,
    error: error?.message || null,
    follow,
    unfollow,
    toggleFollow,
  };
};

export const useFollowers = (userId: number | null) => {
  const { data, error, isLoading } = useGet<{
    followers: FollowUser[];
    count: number;
  }>(userId ? `/relationships/followers?user_id=${userId}` : null, {
    requireAuth: false,
    revalidateOnFocus: false,
  });

  return {
    followers: data?.followers || [],
    count: data?.count ?? 0,
    isLoading,
    error: error?.message || null,
  };
};

export const useFollowing = (userId: number | null) => {
  const { data, error, isLoading } = useGet<{
    following: FollowUser[];
    count: number;
  }>(userId ? `/relationships/following?user_id=${userId}` : null, {
    requireAuth: false,
    revalidateOnFocus: false,
  });

  return {
    following: data?.following || [],
    count: data?.count ?? 0,
    isLoading,
    error: error?.message || null,
  };
};
