var context = context || {};
(function($) {
  // Register the 'next' button to go to the next page
  $('#context-step2').click(function() {
    context.iframeUtils.sendMessageToRuntime({
      action: 'tutorial-step2'
    });
  });
})(jQuery);
