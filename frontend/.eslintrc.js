module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'next'
  ],
  rules: {
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-useless-escape': 'warn'
    },
    ignorePatterns: ['*.d.ts']
  },
  extends: ['next']
}
