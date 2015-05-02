(function($) {
  $('#options-link').attr('href',
      chrome.extension.getURL('options.html'));
  $('#context-step2').click(function() {
    context.iframeUtils.sendMessageToRuntime({
      action: 'tutorial-step2'
    });
  });
  $('#context-tutorial-end').click(function() {
    context.iframeUtils.sendMessageToRuntime({
      action: 'tutorial-end'
    });
  });
})(jQuery);
