const path = require("path");

module.exports = {
  extends: [
    "next/core-web-vitals",
  ],
  plugins: [
    "@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  root: true,
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["@", path.join(__dirname, "./src")]
        ],
        extensions: [".json", ".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    "indent": [
      "warn",
      2,
      {
        "SwitchCase": 1,
        "VariableDeclarator": "first",
        "outerIIFEBody": 1,
        "MemberExpression": 1,
        "ArrayExpression": 1,
        "ObjectExpression": 1,
        "ignoreComments": true,
      }
    ],
    "semi": ["warn", "always"],
    "semi-spacing": [
      "warn",
      {
        "after": true,
        "before": false
      }
    ],
    "semi-style": [
      "error",
      "last",
    ],
    "quotes": [
      "warn",
      "double",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "func-style": [
      "warn",
      "expression"
    ],
    "array-bracket-spacing": [
      "warn",
      "never",
      {
        "singleValue": false,
        "objectsInArrays": false,
        "arraysInArrays": false,
      }
    ],
    "brace-style": "warn",
    "padded-blocks": ["warn", "never"],
    "keyword-spacing": "warn",
    "space-infix-ops": "warn",
    "comma-spacing": [
      "warn",
      {
        "before": false,
        "after": true,
      }
    ],
    "key-spacing": ["warn",
      {
        "singleLine": {
          "beforeColon": false,
          "afterColon": true
        },
        "multiLine": {
          "beforeColon": false,
          "afterColon": true,
        }
      }
    ],
    "switch-colon-spacing": [
      "warn",
      {
        "before": false,
        "after": true,
      }
    ],
    "space-before-blocks": [
      "warn",
      "always"
    ],
    "space-before-function-paren": [
      "warn",
      "always",
    ],
    "arrow-spacing": "warn",
    "no-multiple-empty-lines": [
      "warn",
      { max: 1 }
    ],
    "no-var": "error",
    "no-new-object": "error",
    "no-new-wrappers": "error",
    "no-new-func": "error",
    "no-native-reassign": "error",
    "no-trailing-spaces": "warn",
    "no-unused-vars": "off",
    "no-alert": "warn",
    "no-multi-spaces": "warn",
    "no-throw-literal": "error",
    "no-duplicate-case": "warn",
    "no-extra-boolean-cast": "warn",
    "no-extra-semi": "warn",
    "no-unreachable": "warn",
    "no-console": "warn",
    "eqeqeq": [
      "error",
      "always",
      { "null": "ignore" }
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "caughtErrors": "none",
        "argsIgnorePattern": "^_",
      }
    ],
    "vars-on-top": "error",
    "jsx-quotes": ["error", "prefer-double"],
    "react/display-name": "off",
    "react-hooks/exhaustive-deps": "off"
  }
};