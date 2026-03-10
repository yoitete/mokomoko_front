"use client";

import { useFollowStatus } from "@/hooks/useFollows";
import Button from "@/components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserCheck } from "@fortawesome/free-solid-svg-icons";

interface FollowButtonProps {
  currentUserId: number | null;
  targetUserId: number;
}

export default function FollowButton({
  currentUserId,
  targetUserId,
}: FollowButtonProps) {
  const { isFollowing, isLoading, toggleFollow } = useFollowStatus(
    currentUserId,
    targetUserId
  );

  if (isLoading) return null;
  if (currentUserId === targetUserId) return null;

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "primary"}
      onClick={toggleFollow}
      className="cursor-pointer"
    >
      <FontAwesomeIcon
        icon={isFollowing ? faUserCheck : faUserPlus}
        className="mr-1"
      />
      {isFollowing ? "フォロー中" : "フォロー"}
    </Button>
  );
}
