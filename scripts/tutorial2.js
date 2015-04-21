(function($) {
  var utilities = context.utilities();
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
        var selection = window.getSelection();
        if(!selection) {
          return;
        }
        var query = utilities.getFullTextFromSelection(selection);
        if(query) {
          chrome.runtime.sendMessage({action: 'tutorial-create-hoverpane',
              query: query});
          demoUp = true;
        }
      }, (400));
    }
  });

  $('#context-step3').click(function() {
    chrome.runtime.sendMessage({action: 'tutorial-step3'});
  });
})(jQuery);
