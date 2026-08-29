export async function persistCompletionAndRefresh<T>(options: {
  record: () => Promise<T>;
  refresh: () => Promise<unknown>;
  onSuccess: () => void;
  onError: () => void;
}) {
  try {
    const result = await options.record();
    await options.refresh();
    options.onSuccess();
    return result;
  } catch (error) {
    options.onError();
    throw error;
  }
}
