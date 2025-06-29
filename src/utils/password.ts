import bcrypt from 'bcrypt';

// Password must:
// - between 15 characters and 64 characters long
// - contain at least 1 uppercase letter
// - 1 lowercase letter
// - 1 symbol
// - 1 number
export const passwordRules = [
    {
        test: (password: string) =>
            password.length >= 15 && password.length <= 64,
        message: 'Password must be between 15 and 64 characters long.',
    },
    {
        test: (password: string) => /[A-Z]/.test(password),
        message: 'Password must contain at least one uppercase letter.',
    },
    {
        test: (password: string) => /[a-z]/.test(password),
        message: 'Password must contain at least one lowercase letter.',
    },
    {
        test: (password: string) => /[0-9]/.test(password),
        message: 'Password must contain at least one number.',
    },
    {
        test: (password: string) => /[^A-Za-z0-9]/.test(password),
        message: 'Password must contain at least one symbol.',
    },
];

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export function isValidPassword(password: string): boolean {
    const results = passwordRules.map((rule) => ({
        ...rule,
        result: rule.test(password),
    }));
    if (!results.every((result) => result)) return false;
    return true;
}
