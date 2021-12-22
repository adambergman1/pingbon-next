const path = require('path');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
});
