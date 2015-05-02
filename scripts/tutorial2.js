var context = context || {};
(function($) {
  $('#context-step1').click(function() {
    context.iframeUtils.sendMessageToRuntime({
      action: 'tutorial-step1'
    });
  });
  $('#context-step3').click(function() {
    context.iframeUtils.sendMessageToRuntime({
      action: 'tutorial-step3'
    });
  });
})(jQuery);
