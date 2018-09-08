const createWebpackConfig = require('@dabapps/create-webpack-config');

module.exports = createWebpackConfig({
  input: './src/index.tsx',
  outDir: './build/',
  tsconfig: './tsconfig.dist.json',
  env: {
    NODE_ENV: 'production'
  }
});
