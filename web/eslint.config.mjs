// ESLint 9+ "flat config": a plain array of config objects, applied in order.
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import prettier from '@vue/eslint-config-prettier';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },

  js.configs.recommended,
  // vue3-recommended, not vue3-essential: it adds the ordering, naming and
  // template style rules on top of the correctness ones.
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),

  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // Views are named after their route (HomeView, AdminView), which the
      // multi-word rule would otherwise flag.
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['tests/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
  },

  // Last, so it can switch off any rule that would fight the formatter.
  prettier,
];
