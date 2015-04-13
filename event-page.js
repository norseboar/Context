"use strict"

// Show hoverpane for the selected text or text of the hyperlink
var clickHandler = function(info, tab) {
  if (info.menuItemId !== 'showContext'){
    return;
  }
  // Send a message to content script, which will surface actual hoverpane
  chrome.tabs.sendMessage(tab.id, {action: 'showPane'});
}

chrome.contextMenus.create({
  id: 'showContext',
  title: 'Show more info',
  contexts: ['selection', 'link']
});

chrome.contextMenus.onClicked.addListener(clickHandler);

// listen for messages from extension to inform it about settings
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(sender.id !== chrome.runtime.id) {
      return;
    }

    if(request.query === 'autoshow') {
      chrome.storage.sync.get({
        autoshow: true
      }, function(results){
        sendResponse({autoshow: results.autoshow});
      });
      return true;
    }

    if(request.query === 'blacklist') {
      chrome.storage.local.get({
        blacklist: []
      }, function(results) {
        sendResponse({blacklist: results.blacklist});
      });
      return true;
    }
  }
)
