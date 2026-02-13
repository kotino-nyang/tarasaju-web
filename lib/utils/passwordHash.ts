/**
 * Hash a password using SHA-256
 * This is a simple client-side hashing for Q&A password protection
 *
 * @param password - The password to hash
 * @returns The hashed password as a hex string
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

/**
 * Verify password against hash
 *
 * @param password - The password to verify
 * @param hash - The hash to compare against
 * @returns True if the password matches the hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
}
