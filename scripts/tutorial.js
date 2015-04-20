"use strict"

// Module for running a tutorial introducing a user to Context
// This tutorial shows popups on whatever page they're on to show them
// how context can be used
var context = context || {};

context.tutorial = (function($) {
  // we can't return the funtion directly, because we need jQuery
  return function() {
    // UTILITIES ==============================================================

    // Loads content from a URL, and adds it to hoverpane
    // Accepts a URL string, and a function to run afterwards (to initialize)
    // handlers and such
    var loadContentFromUrl = function(url, runAfter){
      var req = new XMLHttpRequest();
      req.open('GET',
          chrome.extension.getURL(url), true);
      req.onreadystatechange = function() {
        if(req.readyState === 4 && req.status === 200) {
          tutorialPane.appendContent($(req.responseText),
              context.TUTORIAL_HEIGHT);
          runAfter();
        }
      }
      req.send();
    }

    // TUTORIAL PROGRESS ======================================================
    // These functions are not automatically run, rather they are called as
    // the tutorial progresses
    var runStep1 = function() {
      // center pane
      var xPos = ($(window).width() - context.TUTORIAL_WIDTH)/2;
      var yPos = ($(window).height() - context.TUTORIAL_HEIGHT)/3;
      tutorialPane.moveCustom(xPos, yPos, context.TUTORIAL_WIDTH, 'animate');

      // Empty pane and load in new content
      tutorialPane.empty();
      loadContentFromUrl('/templates/tutorial-1.html', step1Handlers);
    };

    var runStep2 = function() {
      //TODO: step 2
    };

    // HANDLERS ===============================================================
    var introHandlers = function() {
      $('#context-never').click(function() {
        tutorialPane.hide();
        chrome.runtime.sendMessage({action: 'permanentDisableTutorial'});
      });

      $('#context-not-now').click(function() {
        console.log('not now clicked');
        tutorialPane.hide();
        chrome.runtime.sendMessage({action: 'tempDisableTutorial'});
      });

      $('#context-step1').click(function() {
        inTutorial = true;
        // Disable this in other tabs anyhow, since the user's already
        // engaged
        chrome.runtime.sendMessage({action: 'tempDisableTutorial'});
        runStep1();
      });
    };

    var step1Handlers = function() {
      $('#context-step2').click(function() {
        runStep2();
      });
    };

    // INITIALIZE AND DISPLAY PANE ============================================
    // If the user is in the middle of the tutorial, some things behave
    // differently
    var inTutorial = false;

    // first, get the appropriate location for tutorial popup
    var window_width = $(window).width();
    var width = window_width/3 > context.TUTORIAL_WIDTH ?
        context.TUTORIAL_WIDTH :
        window_width/3;
    var xPos = window_width - (context.PANE_PADDING_WIDTH*2) - width;
    var yPos = context.PANE_PADDING_HEIGHT*3;

    var branding = $('<div style="position:relative; height:1.5em">' +
        '<p>Powered by <span class="context-logo"><sup>[1]</sup>Context</span>' +
        '</p></div>');
    var tutorialPane = new context.HoverPane(branding);
    // tutorial pane must have Z dialed back so that other hovercards overlap
    // it when the user is experimenting
    tutorialPane.setZ(tutorialPane.getZ() - 1);
    tutorialPane.moveCustom(xPos, yPos, width, 0);
    loadContentFromUrl('/templates/tutorial-intro.html', introHandlers);

    // SET UP LISTENERS =======================================================
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(sender.id !== chrome.runtime.id) {
          return;
        }

        // Listen for a message to kill the tutorial
        // When the user interacts with a tutorial on one page, all other
        // tutorials are killed (for example, if the user opens five tabs in
        // quick sequence, the tutorials on all pages but the one the user is actively using should
        // be killed as quickly as possible)
        if(request.action === 'killTutorial') {
          if(!inTutorial) {
            tutorialPane.hide();
          }
        }
      }
    );
  };
})(jQuery);
