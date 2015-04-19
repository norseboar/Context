"use strict"

// Module for running a tutorial introducing a user to Context
// This tutorial shows popups on whatever page they're on to show them
// how context can be used
var context = context || {};

context.tutorial = (function($) {
  var exposed = {};

  // first, get the appropriate location for tutorial popup
  var window_width = $(window.width);
  var width = window_width/3 > context.MAX_WIDTH ?
      context.MAX_WIDTH :
      window_width/3;
  var xPos = window_width - (context.PANE_PADDING_WIDTH*2) - width;
  var yPos = context.PANE_PADDING_HEIGHT*3;

  var branding = $('<div style="position:relative; height:1.5em">' +
      '<p>Powered by <span class="context-logo"><sup>[1]</sup>Context</span>' +
      '</p></div>');
  var tutorialPane = new context.HoverPane(branding);
  tutorialPane.placeCustom(xPos, yPos, width, 0);

  return {
    runTutorial: function() {
      // Load contents of tutorial intro, and add that to tutorial pane
      var iframe = $('<iframe src="' +
          chrome.extension.getURL('templates/tutorial-intro.html') +
          '" width=' + width + '" height="' + context.MAX_HEIGHT +
          '"></iframe>');
      tutorialPane.appendContent(iframe);
      // var req = new XMLHttpRequest();
      // req.open('GET', chrome.extension.getURL('templates/tutorial-intro.html'),
      //     true);
      // req.onreadystatechange = function() {
      //   if(req.readyState === 4 && req.status === 200) {
      //     tutorialPane.appendContent($(req.responseText));
      //   }
      // };
      // req.send(null);
    }
  }
})(jQuery);
