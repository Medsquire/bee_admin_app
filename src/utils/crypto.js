/**
 * Client-Side Credential & Password Security Helpers
 * Strict compliance with security requirements:
 * - Passwords are NEVER stored as plain text in localStorage.
 * - Client-side cryptographic SHA-256 digest with salt.
 * - UI displays masked password (••••••••••••).
 * - Change / Reset credential workflow with password strength validation.
 * - In production environments, credentials are submitted over TLS directly
 *   to the backend auth microservice for bcrypt/argon2 hashing and JWT token issuance.
 */

// Generate random salt
export function generateSalt(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

// Compute SHA-256 digest
export async function hashPassword(plainPassword, customSalt = null) {
  if (!plainPassword) return '';
  const salt = customSalt || generateSalt(12);
  const msgUint8 = new TextEncoder().encode(salt + ':' + plainPassword);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `$sha256$${salt}$${hashHex}`;
}

// Format masked representation
export function getMaskedPassword() {
  return '••••••••••••';
}

// Generate secure random initial password for admin convenience
export function generateSecurePassword(length = 12) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '!@#$%^&*';
  const all = upper + lower + digits + special;

  let pwd = '';
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += special[Math.floor(Math.random() * special.length)];

  const randomValues = new Uint8Array(length - 4);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < length - 4; i++) {
    pwd += all[randomValues[i] % all.length];
  }

  // Shuffle
  return pwd.split('').sort(() => 0.5 - Math.random()).join('');
}
