module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multiline-html-element-content-newline': 'error',
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        singleQuote: true,
        arrowParens: 'avoid',
        endOfLine: 'auto',
      },
    ],
    'vue/multi-word-component-names': 0,
    '@typescript-eslint/no-explicit-any': ['off'],
  },
}
