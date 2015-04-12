"use strict"

// Show hoverpane for the selected text or text of the hyperlink
var clickHandler = function(info) {
  if (info.menuItemId !== 'showContext'){
    return;
  }

}

chrome.contextMenus.create({
  id: 'showContext',
  title: 'Show more Context',
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
        'autoshow': true
      }, function(results){
        sendResponse({autoshow: results.autoshow});
      });
      return true;
    }
  }
)
