module.exports = {
  extends: ['stylelint-config-standard-scss'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx'],
      },
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global'],
      },
    ],
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'custom-property-empty-line-before': null,
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
    'color-hex-length': null,
    'no-descending-specificity': null,
  },
}
