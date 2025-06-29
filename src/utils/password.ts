import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function isValidPassword(password: string): boolean {
    // TODO: update password needs:
    // - between 15 characters and 64 characters long
    // - contain at least 1 uppercase letter
    // - 1 lowercase letter
    // - 1 symbol
    // - 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{15,}$/;
  return passwordRegex.test(password);
}