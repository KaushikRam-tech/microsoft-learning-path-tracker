import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function unauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("activity procedures", () => {
  it("rejects activity history for unauthenticated learners", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    await expect(caller.activity.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects activity writes for unauthenticated learners", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    await expect(caller.activity.record({
      pathId: "azure-fundamentals",
      activityType: "module_completed",
      title: "Describe cloud service types",
      minutes: 18,
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
