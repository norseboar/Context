(function($) {
  $('#options-link').attr('href',
      chrome.extension.getURL('options.html'));
  $('#context-tutorial-end').click(function() {
    chrome.runtime.sendMessage({action: 'tutorial-end'});
  });
})(jQuery);
