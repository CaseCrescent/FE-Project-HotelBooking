// Pulls the most informative error message out of a non-OK fetch Response.
// Tries JSON body { error | message } first, falls back to status text, then the caller-supplied default.
// Use as: throw new Error(await extractError(res, "Could not load X"));
export async function extractError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.clone().json();
    if (body?.error) return String(body.error);
    if (body?.message) return String(body.message);
  } catch {
    // not JSON — fall through
  }
  if (res.statusText) return `${fallback} (${res.status} ${res.statusText})`;
  return `${fallback} (${res.status})`;
}
