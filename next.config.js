require('dotenv').config();
const path = require("path");
const withTypeScript = require("@zeit/next-typescript");
const withCustomBabelConfigFile = require("next-plugin-custom-babel-config");
const withSass = require('@zeit/next-sass')
module.exports = withCustomBabelConfigFile(
  withTypeScript(withSass({
    cssModules: true,
    babelConfigFile: path.resolve("./babel.config.js"),
    publicRuntimeConfig: {
      API_URL: process.env.API_URL,
      COOKIE_URL: process.env.COOKIE_URL
    }
  }))
);
