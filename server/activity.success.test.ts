import { beforeEach, describe, expect, it, vi } from "vitest";

const { listMock, recordMock } = vi.hoisted(() => ({ listMock: vi.fn(), recordMock: vi.fn() }));

vi.mock("./db", () => ({
  getLearnerActivity: listMock,
  recordLearnerActivity: recordMock,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function authenticatedContext(): TrpcContext {
  return {
    user: {
      id: 42,
      openId: "learner-42",
      email: "learner@example.com",
      name: "Test Learner",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("authenticated activity success paths", () => {
  beforeEach(() => {
    listMock.mockReset();
    recordMock.mockReset();
  });

  it("returns activity for the authenticated learner", async () => {
    const activity = [{ id: 1, userId: 42, pathId: "azure-fundamentals", activityType: "module_completed", title: "Describe cloud service types", minutes: 18, completedAt: new Date() }];
    listMock.mockResolvedValue(activity);

    const result = await appRouter.createCaller(authenticatedContext()).activity.list();

    expect(result).toEqual(activity);
    expect(listMock).toHaveBeenCalledWith(42);
  });

  it("records a completion under the authenticated learner id", async () => {
    recordMock.mockResolvedValue({ success: true });

    const result = await appRouter.createCaller(authenticatedContext()).activity.record({
      pathId: "azure-fundamentals",
      activityType: "module_completed",
      title: "Describe cloud service types",
      minutes: 18,
    });

    expect(result).toEqual({ success: true });
    expect(recordMock).toHaveBeenCalledWith({
      userId: 42,
      pathId: "azure-fundamentals",
      activityType: "module_completed",
      title: "Describe cloud service types",
      minutes: 18,
    });
  });
});
