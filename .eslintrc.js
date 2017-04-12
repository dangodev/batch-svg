module.exports = {
  "env": {
    "node": true
  },
  "extends": ["plugin:node/recommended", "standard"],
  "plugins": ["import", "node"],
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
      "modules": true,
      "experimentalObjectRestSpread": true
    }
  },
  "rules": {
    "array-bracket-spacing": [1, "never"],
    "comma-dangle": [1, "always-multiline"],
    "indent": ["error", 2],
    "object-curly-spacing": [1, "always"],
    "prefer-template": "error",
    "semi": ["error", "always"]
  }
};
