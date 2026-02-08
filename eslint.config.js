import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  typescript: true,
})
  .overrideRules({
    // eslint
    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],

    // eslint-plugin-antfu
    'antfu/if-newline': 0,

    // eslint.style
    'style/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
    'style/brace-style': 'error',
    'style/arrow-parens': ['error', 'always'],
    'style/quote-props': ['error', 'as-needed', { keywords: true }],
  })
