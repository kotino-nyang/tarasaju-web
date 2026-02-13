/**
 * Masks a name by showing only the first character
 *
 * Examples:
 * - "고티노리" → "고**"
 * - "김철수" → "김**"
 * - "John" → "J***"
 * - "홍" → "홍"
 *
 * @param name - The name to mask
 * @returns The masked name
 */
export function maskName(name: string): string {
  if (!name || name.length === 0) {
    return "";
  }

  if (name.length === 1) {
    return name;
  }

  const firstChar = name.charAt(0);
  const maskLength = name.length - 1;
  const mask = "*".repeat(maskLength);

  return `${firstChar}${mask}`;
}

/**
 * Masks an email address
 *
 * Examples:
 * - "user@example.com" → "u***@example.com"
 * - "john.doe@company.com" → "j*******@company.com"
 *
 * @param email - The email to mask
 * @returns The masked email
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) {
    return email;
  }

  const [localPart, domain] = email.split("@");

  if (localPart.length <= 1) {
    return email;
  }

  const firstChar = localPart.charAt(0);
  const maskLength = localPart.length - 1;
  const mask = "*".repeat(maskLength);

  return `${firstChar}${mask}@${domain}`;
}

/**
 * Masks a phone number
 *
 * Examples:
 * - "010-1234-5678" → "010-****-5678"
 * - "01012345678" → "010****5678"
 *
 * @param phone - The phone number to mask
 * @returns The masked phone number
 */
export function maskPhone(phone: string): string {
  if (!phone) {
    return "";
  }

  // Remove all non-digit characters for processing
  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length !== 10 && digitsOnly.length !== 11) {
    return phone; // Return as-is if not a valid Korean phone number
  }

  // For 010-XXXX-XXXX format
  if (phone.includes("-")) {
    const parts = phone.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-****-${parts[2]}`;
    }
  }

  // For 010XXXXXXXX format
  if (digitsOnly.length === 11) {
    return `${digitsOnly.slice(0, 3)}****${digitsOnly.slice(7)}`;
  } else if (digitsOnly.length === 10) {
    return `${digitsOnly.slice(0, 3)}***${digitsOnly.slice(6)}`;
  }

  return phone;
}
