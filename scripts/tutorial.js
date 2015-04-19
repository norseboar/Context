"use strict"

// Module for running a tutorial introducing a user to Context
// This tutorial shows popups on whatever page they're on to show them
// how context can be used
var context = context || {};

context.tutorial = (function($) {
  // If the user is in the middle of the tutorial, some things behave
  // differently
  var inTutorial = false;

  return {
    runTutorial: function() {
      // first, get the appropriate location for tutorial popup
      var window_width = $(window).width();
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

      var registerHandlers = function() {
        $('#context-never').click(function() {
          tutorialPane.hide();
          chrome.runtime.sendMessage({action: 'permanentDisableTutorial'});
        });

        $('#context-not-now').click(function() {
          console.log('not now clicked');
          tutorialPane.hide();
          chrome.runtime.sendMessage({action: 'tempDisableTutorial'});
        });

        $('#context-yes').click(function() {
          inTutorial = true;
          // Disable this in other tabs anyhow, since the user's already
          // engaged
          chrome.runtime.sendMessage({action: 'tempDisableTutorial'});
          // TODO: start tutorial
        });
      };

      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if(sender.id !== chrome.runtime.id) {
            return;
          }

          // Listen for a message to kill the tutorial
          // When the user interacts with a tutorial on one page, all other tutorials
          // are killed (for example, if the user opens five tabs in quick sequence,
          // the tutorials on all pages but the one the user is actively using should
          // be killed as quickly as possible)
          if(request.action === 'killTutorial') {
            if(!inTutorial) {
              tutorialPane.hide();
            }
          }
        }
      );

      // Load contents of tutorial intro, and add that to tutorial pane
      var req = new XMLHttpRequest();
      req.open('GET',
          chrome.extension.getURL('/templates/tutorial-intro.html'), true);
      req.onreadystatechange = function() {
        if(req.readyState === 4 && req.status === 200) {
          tutorialPane.appendContent($(req.responseText));
          registerHandlers();
        }
      }
      req.send();
    }
  }
})(jQuery);
