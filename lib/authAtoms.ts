import { atom } from "jotai";
import { User } from "firebase/auth";

// 認証状態を管理するatom
export const userAtom = atom<User | null>(null);
export const authLoadingAtom = atom<boolean>(true);
export const authErrorAtom = atom<string | null>(null);
export const authTokenAtom = atom<string | null>(null);

// 認証状態をまとめて取得するatom
export const authStateAtom = atom((get) => ({
  user: get(userAtom),
  loading: get(authLoadingAtom),
  error: get(authErrorAtom),
  token: get(authTokenAtom),
}));

// 認証状態をリセットするatom
export const resetAuthStateAtom = atom(null, (get, set) => {
  set(userAtom, null);
  set(authLoadingAtom, true);
  set(authErrorAtom, null);
  set(authTokenAtom, null);
});
