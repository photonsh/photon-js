var compressGzip = require('pako/lib/deflate').gzip;

function highlighter(document, options) {
  function sendSnippet(snippet) {
    function executor(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', encodeURI('https://api.photon.sh/snippets'));
      xhr.setRequestHeader('Authorization', 'Token ' + options.apiKey);
      xhr.setRequestHeader('Content-Type', 'text/html');
      xhr.setRequestHeader('Content-Encoding', 'gzip');
      xhr.setRequestHeader('Library', 'javascript');

      xhr.onload = function () {
        if (xhr.status === 200 && xhr.responseText) {
          var div = document.createElement('div');
          div.innerHTML = xhr.responseText;
          snippet.parentNode.parentNode.replaceChild(div.firstChild, snippet.parentNode);
          resolve();
        } else if (xhr.status >= 400) {
          var error;
          try {
            error = xhr.responseText;
          } catch (err) {
            error = JSON.stringify({ error: { type: 'unknown_error', message: 'Unknown error.' } });
          }

          reject(new Error(error));
        }
      }

      xhr.onerror = function () {
        reject(new Error(JSON.stringify({ error: { type: 'unknown_error', message: 'Unknown error.' } })));
      }

      xhr.send(compressGzip(snippet.outerHTML));
    }

    return (typeof Promise === 'function') ? new Promise(executor) : executor(function () {}, function (err) { throw(err); });
  }

  var snippets = document.querySelectorAll('pre code[class*=language-], pre code[class*=lang-], pre samp[class*=language-], pre samp[class*=lang-]');

  return Array.prototype.slice.call(snippets)
    .filter(function(snippet) { return (snippet.textContent !== '') })
    .map(sendSnippet)
}

module.exports = highlighter
