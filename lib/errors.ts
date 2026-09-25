export function getErrorMessage(err: unknown, fallback = "Ocurrió un error"): string {
  if (err && typeof err === "object" && "message" in err && typeof err.message === "string" && err.message) {
    return err.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
