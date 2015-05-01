(function($) {
  $('#options-link').attr('href',
      chrome.extension.getURL('options.html'));
  $('#context-step2').click(function() {
    chrome.runtime.sendMessage({action: 'tutorial-step2'});
  });
  $('#context-tutorial-end').click(function() {
    chrome.runtime.sendMessage({action: 'tutorial-end'});
  });
})(jQuery);
