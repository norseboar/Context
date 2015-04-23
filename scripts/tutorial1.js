(function($) {
  // Register the 'next' button to go to the next page
  $('#context-step2').click(function() {
    chrome.runtime.sendMessage({action: 'tutorial-step2'});
  });
})(jQuery);
