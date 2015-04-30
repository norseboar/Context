(function() {
  document.getElementById('blacklist-link').onclick = function() {
    chrome.runtime.sendMessage({action: 'blacklist-demo'});
    return false;
  };
})();
