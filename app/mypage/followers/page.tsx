"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { useFollowers } from "@/hooks/useFollows";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Button from "@/components/Button/Button";

export default function FollowersPage() {
  const { isUnauthenticated, loading } = useAuth();
  const { userId } = useCurrentUser();
  const { followers, isLoading } = useFollowers(userId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  if (isUnauthenticated) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center whitespace-nowrap">
            このページはログイン後に表示されます
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            この機能をご利用いただくには
            <br />
            ログインまたは新規登録が必要です。
          </p>
          <Link href="/signup">
            <Button className="w-full">新規アカウント作成</Button>
          </Link>
          <div className="mt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E2D8D8]">
      <PageHeader title="フォロワー" backHref="/mypage" centerTitle={true} />

      <div className="max-w-md mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-[#7E6565]">読み込み中...</p>
          </div>
        ) : followers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p
              className="text-[#7E6565]"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              フォロワーはまだいません
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {followers.map((user) => {
              const isMyself = user.id === userId;
              const content = (
                <div className={`bg-white rounded-lg shadow p-4 flex items-center space-x-3 ${!isMyself ? "hover:bg-gray-50 transition-colors" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-[#F5F0F0] flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-[#7E6565] text-lg"
                    />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-[#5A4A4A]"
                      style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                    >
                      {user.nickname || user.name}
                    </p>
                  </div>
                </div>
              );
              return isMyself ? (
                <div key={user.id}>{content}</div>
              ) : (
                <Link key={user.id} href={`/user/${user.id}`}>{content}</Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
