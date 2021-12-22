const path = require('path');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const isDev = process.env.NODE_ENV === 'development';

module.exports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: isDev ? true : false,
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
});
