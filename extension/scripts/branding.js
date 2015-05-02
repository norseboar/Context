(function() {
  document.getElementById('blacklist-link').onclick = function() {
    chrome.runtime.sendMessage({action: 'blacklist-triggered'});
    return false;
  };
})();
