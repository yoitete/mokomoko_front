# SWR 統合フック 使用ガイド

## 🎯 最適化されたデフォルト設定

### デフォルト値

```typescript
{
  requireAuth: false,                // 認証不要（デフォルト）
  revalidateOnFocus: true,          // フォーカス時に再検証
  revalidateOnReconnect: true,      // 再接続時に再検証
  dedupingInterval: 2 * 60 * 1000,  // 2分キャッシュ（最適化済み）
  errorRetryCount: 3,               // エラー時3回リトライ
  errorRetryInterval: 1000,         // 1秒間隔でリトライ
  refreshInterval: 0,               // 自動リフレッシュ無効
}
```

## 📝 基本的な使用方法

### 1. シンプルな使用（推奨）

```typescript
// デフォルト設定を使用（最もシンプル）
const { data: posts, error, isLoading } = useGet<Post[]>("/posts");
```

### 2. カスタム設定が必要な場合のみ指定

```typescript
// 詳細ページ：再検証頻度を下げる
const {
  data: post,
  error,
  isLoading,
} = useGet<Post>(`/posts/${id}`, {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000, // 10分キャッシュ
});

// 認証が必要なAPI
const {
  data: userProfile,
  error,
  isLoading,
} = useGet<UserProfile>("/profile", {
  requireAuth: true, // 認証必須
});

// リアルタイム更新が必要
const {
  data: notifications,
  error,
  isLoading,
} = useGet<Notification[]>("/notifications", {
  refreshInterval: 30000, // 30秒ごとに自動更新
});
```

## 🎨 使用パターン

### パターン 1: 一覧ページ（デフォルト設定）

```typescript
function PostsList() {
  const { data: posts, error, isLoading } = useGet<Post[]>("/posts");

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <PostList posts={posts} />;
}
```

### パターン 2: 詳細ページ（長めキャッシュ）

```typescript
function PostDetail({ id }: { id: string }) {
  const {
    data: post,
    error,
    isLoading,
  } = useGet<Post>(`/posts/${id}`, {
    revalidateOnFocus: false,
    dedupingInterval: 10 * 60 * 1000,
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <PostContent post={post} />;
}
```

### パターン 3: 認証必須 API

```typescript
function UserProfile() {
  const {
    data: profile,
    error,
    isLoading,
  } = useGet<UserProfile>("/profile", {
    requireAuth: true,
  });

  if (isLoading) return <Loading />;
  if (error) return <LoginPrompt />;

  return <ProfileView profile={profile} />;
}
```

### パターン 4: ミューテーションとの組み合わせ

```typescript
function PostManager() {
  const { data: posts, mutate } = useGet<Post[]>("/posts");
  const createPost = usePost<Post>();

  const handleCreate = async (postData: CreatePostData) => {
    try {
      await createPost("/posts", postData);
      mutate(); // キャッシュを更新
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return <PostForm onSubmit={handleCreate} posts={posts} />;
}
```

## ⚡ パフォーマンス最適化

### キャッシュ戦略

- **一般的なデータ**: 2 分キャッシュ（デフォルト）
- **詳細ページ**: 10 分キャッシュ
- **お気に入り**: 5 分キャッシュ
- **ユーザー設定**: 長めのキャッシュ推奨

### 再検証戦略

- **一覧ページ**: フォーカス時再検証（デフォルト）
- **詳細ページ**: 再検証無効
- **リアルタイムデータ**: 短間隔での自動更新

## 🚫 避けるべきパターン

### ❌ 不要な設定の指定

```typescript
// 悪い例：デフォルト値を明示的に指定
const { data } = useGet("/posts", {
  requireAuth: false, // デフォルトなので不要
  revalidateOnFocus: true, // デフォルトなので不要
  dedupingInterval: 2 * 60 * 1000, // デフォルトなので不要
});

// 良い例：デフォルト設定を使用
const { data } = useGet("/posts");
```

### ❌ 過度に短いキャッシュ

```typescript
// 悪い例：頻繁なリクエストでサーバー負荷増
const { data } = useGet("/posts", {
  dedupingInterval: 1000, // 1秒は短すぎる
});
```

### ❌ 不適切な自動リフレッシュ

```typescript
// 悪い例：静的なデータに自動リフレッシュ
const { data } = useGet("/posts", {
  refreshInterval: 5000, // 投稿一覧に5秒間隔は不要
});
```

## 🎯 まとめ

1. **基本はデフォルト設定を使用**
2. **必要な場合のみカスタム設定**
3. **適切なキャッシュ期間を選択**
4. **ユーザー体験を重視した再検証戦略**
