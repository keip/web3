module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.js'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
