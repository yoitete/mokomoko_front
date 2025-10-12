import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";

// Mock Firebase auth
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();
const mockSendPasswordResetEmail = jest.fn();
const mockGetIdToken = jest.fn();

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: mockSignIn,
  createUserWithEmailAndPassword: mockSignUp,
  signOut: mockSignOut,
  sendPasswordResetEmail: mockSendPasswordResetEmail,
  onAuthStateChanged: jest.fn(),
}));

// Mock Jotai atoms
const mockUser = {
  getIdToken: mockGetIdToken,
};

jest.mock("jotai", () => ({
  atom: jest.fn(),
  useAtomValue: jest.fn(() => ({
    user: mockUser,
    loading: false,
    error: null,
    token: "mock-token",
  })),
  useSetAtom: jest.fn(() => jest.fn()),
}));

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides authentication methods", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.signIn).toBeDefined();
    expect(result.current.signUp).toBeDefined();
    expect(result.current.logout).toBeDefined();
    expect(result.current.resetPassword).toBeDefined();
    expect(result.current.refreshToken).toBeDefined();
  });

  it("handles sign in", async () => {
    mockSignIn.mockResolvedValue({});

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn("test@example.com", "password");
    });

    expect(mockSignIn).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password"
    );
  });

  it("handles sign up", async () => {
    mockSignUp.mockResolvedValue({});

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signUp("test@example.com", "password");
    });

    expect(mockSignUp).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password"
    );
  });

  it("handles logout", async () => {
    mockSignOut.mockResolvedValue({});

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("handles password reset", async () => {
    mockSendPasswordResetEmail.mockResolvedValue({});

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.resetPassword("test@example.com");
    });

    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com"
    );
  });

  it("handles token refresh", async () => {
    mockGetIdToken.mockResolvedValue("new-token");

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const newToken = await result.current.refreshToken();
      expect(newToken).toBe("new-token");
    });

    expect(mockGetIdToken).toHaveBeenCalledWith(true);
  });

  it("provides authentication state", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isUnauthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.token).toBe("mock-token");
  });
});
