(function($) {
  $('#context-step1').click(function() {
    chrome.runtime.sendMessage({action: 'tutorial-step1'});
  });
  $('#context-step3').click(function() {
    chrome.runtime.sendMessage({action: 'tutorial-step3'});
  });
})(jQuery);
