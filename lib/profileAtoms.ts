import { atom } from "jotai";

export interface ProfileData {
  nickname: string;
  bio: string;
  profileImage: string | null;
  selectedIcon: string;
}

export const profileAtom = atom<ProfileData>({
  nickname: "ユーザー名",
  bio: "自己紹介が設定されていません",
  profileImage: null,
  selectedIcon: "user",
});

export const updateProfileAtom = atom(
  null,
  (get, set, updates: Partial<ProfileData>) => {
    const currentProfile = get(profileAtom);
    set(profileAtom, { ...currentProfile, ...updates });
  }
);

// プロフィールをリセットするatom
export const resetProfileAtom = atom(null, (get, set) => {
  set(profileAtom, {
    nickname: "ユーザー名",
    bio: "自己紹介が設定されていません",
    profileImage: null,
    selectedIcon: "user",
  });
});
