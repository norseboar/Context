(function($) {
  $('#context-step3').click(function() {
    chrome.runtime.sendMessage({action: 'tutorial-step3'});
  });
})(jQuery);
