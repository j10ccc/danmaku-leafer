module.exports = {
  extends: ["next", "turbo", "@j10c"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  "settings": {
    "react": {
      "version": "18"
    }
  }
};
