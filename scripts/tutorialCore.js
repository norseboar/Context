// Core functionality for showing hoverpanes in tutorial
// This must be different than normal functions because they do not function
// in iframes
(function($) {
  var utilities = context.utilities();

  // Mirrors function from primary content script to show a hoverpane based
  // on a selection. Cannot be the same function, because this one requires
  // message passing
  var showPaneFromSelection = function (autoshow) {
    var selection = window.getSelection();
    if(!selection) {
      return;
    }
    var query = utilities.getFullTextFromSelection(selection);
    if(query) {
      chrome.runtime.sendMessage({action: 'tutorial-create-hoverpane',
          query: query, autoshow: autoshow});
      demoUp = true;
    }
  }
  // Because this is an iframe, the regular content script will not function
  // Send queries to main page, where a tutorial handler will pop panes
  var demoUp = false;
  $('body').on('mouseup.showPane', function () {
    if(demoUp) {
      // If demo is already up, close it (clicking outside of a frame should
      // always have this effect)
      chrome.runtime.sendMessage({action: 'tutorial-close-demo'});
      demoUp = false;
    }
    else {
      // Timeout needed so that only one event is fired if a user double-clicks
      // to select
      setTimeout(function() {
        showPaneFromSelection(true);
      }, (400));
    }
  });

  // Listen for context menu events
  chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(sender.id !== chrome.runtime.id) {
          return;
        }
        if(request.action === 'showPane') {
          showPaneFromSelection(false);
        }
  });
})(jQuery);
