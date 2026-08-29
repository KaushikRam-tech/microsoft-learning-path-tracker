import { describe, expect, it, vi } from "vitest";
import { persistCompletionAndRefresh } from "./activityFlow";

describe("persistCompletionAndRefresh", () => {
  it("records first, refreshes analytics second, then confirms success", async () => {
    const record = vi.fn().mockResolvedValue({ success: true });
    const refresh = vi.fn().mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const onError = vi.fn();

    await persistCompletionAndRefresh({ record, refresh, onSuccess, onError });

    expect(record).toHaveBeenCalledOnce();
    expect(refresh).toHaveBeenCalledOnce();
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
    expect(record.mock.invocationCallOrder[0]).toBeLessThan(refresh.mock.invocationCallOrder[0]);
  });

  it("does not confirm success when persistence fails", async () => {
    const record = vi.fn().mockRejectedValue(new Error("offline"));
    const refresh = vi.fn();
    const onSuccess = vi.fn();
    const onError = vi.fn();

    await expect(persistCompletionAndRefresh({ record, refresh, onSuccess, onError })).rejects.toThrow("offline");

    expect(refresh).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledOnce();
  });
});
