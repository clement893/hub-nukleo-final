/**
 * Tests for authentication helper functions
 * 
 * These tests verify that the auth helpers correctly interact with NextAuth
 * and handle authentication states properly.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCurrentUserId, getCurrentUser, requireAuth } from "../auth-helpers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Mock dependencies
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("auth-helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCurrentUserId", () => {
    it("should return user ID when user is authenticated", async () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);

      const userId = await getCurrentUserId();

      expect(userId).toBe("user-123");
      expect(auth).toHaveBeenCalledTimes(1);
      expect(redirect).not.toHaveBeenCalled();
    });

    it("should redirect to login when user is not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      await expect(getCurrentUserId()).rejects.toThrow();
      expect(redirect).toHaveBeenCalledWith("/login");
    });

    it("should redirect to login when session exists but user is missing", async () => {
      vi.mocked(auth).mockResolvedValue({} as any);

      await expect(getCurrentUserId()).rejects.toThrow();
      expect(redirect).toHaveBeenCalledWith("/login");
    });

    it("should redirect to login when user exists but ID is missing", async () => {
      vi.mocked(auth).mockResolvedValue({
        user: {
          email: "test@example.com",
        },
      } as any);

      await expect(getCurrentUserId()).rejects.toThrow();
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });

  describe("getCurrentUser", () => {
    it("should return user when authenticated", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
      };

      vi.mocked(auth).mockResolvedValue({
        user: mockUser,
      } as any);

      const user = await getCurrentUser();

      expect(user).toEqual(mockUser);
      expect(auth).toHaveBeenCalledTimes(1);
    });

    it("should return null when not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      const user = await getCurrentUser();

      expect(user).toBeNull();
      expect(auth).toHaveBeenCalledTimes(1);
    });

    it("should return null when session exists but user is missing", async () => {
      vi.mocked(auth).mockResolvedValue({} as any);

      const user = await getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe("requireAuth", () => {
    it("should return session when user is authenticated", async () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
        },
      };

      vi.mocked(auth).mockResolvedValue(mockSession as any);

      const session = await requireAuth();

      expect(session).toEqual(mockSession);
      expect(auth).toHaveBeenCalledTimes(1);
      expect(redirect).not.toHaveBeenCalled();
    });

    it("should redirect to login when user is not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue(null);

      await expect(requireAuth()).rejects.toThrow();
      expect(redirect).toHaveBeenCalledWith("/login");
    });

    it("should redirect to login when session exists but user is missing", async () => {
      vi.mocked(auth).mockResolvedValue({} as any);

      await expect(requireAuth()).rejects.toThrow();
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });
});


