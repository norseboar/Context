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
