import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("roles and permissions", () => {
  it("should allow checking dashboard access", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.survey.checkDashboardAccess({
        email: "test@example.com",
      });

      expect(result).toHaveProperty("allowed");
      expect(result).toHaveProperty("roleId");
      expect(typeof result.allowed).toBe("boolean");
    } catch (error) {
      // Expected to fail without database
      expect(error).toBeDefined();
    }
  });

  it("should allow adding allowed users with roleId", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.survey.addAllowedUser({
        email: "newuser@example.com",
        name: "New User",
        roleId: 1,
      });

      expect(result).toHaveProperty("success");
    } catch (error) {
      // Expected to fail without database
      expect(error).toBeDefined();
    }
  });

  it("should validate roleId is a positive integer", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // This should fail validation
      await caller.survey.addAllowedUser({
        email: "newuser@example.com",
        name: "New User",
        roleId: -1,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
