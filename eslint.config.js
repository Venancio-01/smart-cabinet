import { antfu } from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['src/assets/**', 'src/env.d.ts', 'libs/**/*', 'resources/**/*', 'packages/ui/icons'],
  },
  {
    rules: {
      'curly': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'no-console': 'off',
      'antfu/if-newline': 'off',
      'antfu/generic-spacing': 'off',
      'import/no-mutable-exports': 'off',
    },
  },
)
