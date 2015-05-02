"use strict"
var context = context || {};
context.iframeUtils = (function($) {
  return {
    // Sends a message to chrome runtime
    // If message fails, pops an alert letting the user know
    // that the extension crashed
    sendMessageToRuntime: function(message) {
      try {
        chrome.runtime.sendMessage(message);
      }
      catch (err) {
        var mask = $('<div class="mask"></div>');
        var errorPane = $('<div class="error-pane"><h3>Uh oh</h3>' +
            '<p>Tell me more has either crashed or been reloaded. You will' +
            ' need to refresh the page to dismiss this pane.</p></div>');
        mask.appendTo($('body')).hide().fadeIn(400);
        errorPane.appendTo($('body')).hide().fadeIn(400);
      }
    }
  };
})(jQuery);
