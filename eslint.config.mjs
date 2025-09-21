import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  ...compat.config({
    rules: {
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            ['builtin', 'external'],
            'type',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc' },
        },
      ],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: ['arrow-function'],
          unnamedComponents: ['function-expression'],
        },
      ],
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],
      'react/no-unstable-nested-components': ['warn'],
      'react/jsx-no-useless-fragment': ['error'],
      'react/no-array-index-key': ['warn'],
      'react/jsx-boolean-value': ['error'],
      'react/self-closing-comp': ['error'],
      'react/display-name': ['off'],
    },
  }),
]

export default eslintConfig
