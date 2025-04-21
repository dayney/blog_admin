/*
 * @Author: krui krui0728@gmail.com
 * @Date: 2024-06-13 09:53:24
 * @LastEditors: krui krui0728@gmail.com
 * @LastEditTime: 2025-04-02 14:19:39
 * @FilePath: /blog_express_api/eslint.config.js_back
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-env node */
module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true
  },
  plugins: ['prettier'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false, // <== ADD THIS
    ecmaVersion: 'latest',
    sourceType: "module"
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'semi': ['error', 'always'],
		// js相关
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off',
    'no-var': 'off',
    'no-async-promise-executor': 'off',
    'no-case-declarations': 'off',
    'no-empty': 'off',
    'no-prototype-builtins': 'off',
    'no-fallthrough': 'off',
    'no-unsafe-optional-chaining': 'off',
    'no-extra-boolean-cast': 'off',
    'no-irregular-whitespace': 'off',
    'prefer-const': 'off',

    // prettier相关
    'prettier/prettier': 'off'
  },
  // 9x版本 忽略文件这种配置方式 废弃掉eslintignore
  ignores: [
    '*.sh',
    'node_modules',
    '*.md',
    '*.woff',
    '*.ttf',
    '.idea',
    '/public',
    '/docs',
    '.husky',
    '.local',
    '/bin',
    'Dockerfile',
  ],
};
