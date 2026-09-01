const path = require('path');
const { createStrapi } = require('@strapi/strapi');

createStrapi({
  appDir: __dirname,
  distDir: path.join(__dirname, 'dist'),
}).start();
