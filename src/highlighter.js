var compressGzip = require('pako/lib/deflate').gzip;

function highlighter(document, options) {
  function sendSnippet(snippet) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', encodeURI('https://api.photon.sh/snippets'));
    xhr.setRequestHeader('Authorization', 'APIKey ' + options.apiKey);
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.setRequestHeader('Content-Encoding', 'gzip');
    xhr.setRequestHeader('Library', 'javascript');

    xhr.onload = function () {
      if (xhr.status === 200 && xhr.responseText) {
        var div = document.createElement('div');
        div.innerHTML = xhr.responseText;
        snippet.parentNode.parentNode.replaceChild(div.firstChild, snippet.parentNode);
      }
    }

    xhr.send(compressGzip(snippet.outerHTML));
  }

  var snippets = document.querySelectorAll('pre code[class*=language-], pre code[class*=lang-], pre samp[class*=language-], pre samp[class*=lang-]');

  for (var i = 0; i < snippets.length; i++) {
    if (snippets[i].textContent !== '') {
      sendSnippet(snippets[i]);
    }
  }
}

module.exports = highlighter
