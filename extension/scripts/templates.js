"use strict"
console.log("loaded");
// Runs all content scripts for template html that lives in /templates
// Must be run here, because templates are included as iframes, so the
// regular content script won't affect them

(function(){
  console.log('in templates function');
  var closePane = function() {
    chrome.tabs.getCurrent(function(tab) {
      chrome.tabs.sendMessage(tab.id, {action: 'closePane'});
    });
  };


  console.log('exiting templates function');
})(jQuery);
