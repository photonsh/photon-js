var highlighter = require('./highlighter');

function photon() {
  var apiKey = '';

  return {
    setup: function setup(options) {
      if (options === undefined) {
        options = {};
      }

      if (typeof options !== 'object' || options === null) {
        throw new Error('Setup\'s first argument (options) must be an object.');
      }

      if (options.apiKey) {
        apiKey = options.apiKey;
      }
    },
    highlight: function highlight(options) {
      if (options === undefined) {
        options = {};
      }

      if (typeof options !== 'object' || options === null) {
        throw new Error('Highlight\'s second argument (options) must be an object.');
      }

      if (apiKey === '' && options.apiKey === undefined) {
        throw new Error('Missing API key.');
      }

      return highlighter(document, { apiKey: options.apiKey || apiKey });
    }
  }
}

module.exports = photon()
