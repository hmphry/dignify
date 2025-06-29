import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import unicorn from 'eslint-plugin-unicorn';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import security from 'eslint-plugin-security';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        plugins: {
            unicorn,
            'jsx-a11y': jsxA11y,
            security,
        },
        rules: {
            ...unicorn.configs.recommended.rules,
        },
    },
    ...compat.extends('prettier'),
];

export default eslintConfig;