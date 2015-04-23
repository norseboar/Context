"use strict"

// Module for running a tutorial introducing a user to Context
// This tutorial shows popups on whatever page they're on to show them
// how context can be used
var context = context || {};

context.runTutorial = (function($) {
  // we can't return the funtion directly, because we need jQuery
  return function() {
    var autoshowEnabled = true;

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
      var iframe = $('<iframe src="' +
          chrome.extension.getURL('/templates/tutorial1.html') +
          '" width="' + context.TUTORIAL_WIDTH + '" height="' +
          context.TUTORIAL_HEIGHT + '"></iframe>');
      tutorialPane.appendContent(iframe, context.TUTORIAL_HEIGHT);
    };

    var runStep2 = function() {
      tutorialPane.empty();
      var iframe = $('<iframe src="' +
          chrome.extension.getURL('/templates/tutorial2.html') +
          '" width="' + context.TUTORIAL_WIDTH + '" height="' +
          380 + 'px"></iframe>');
      tutorialPane.appendContent(iframe, context.TUTORIAL_HEIGHT);
    };

    var runStep3 = function() {
      tutorialPane.empty();
      var iframe = $('<iframe src="' +
          chrome.extension.getURL('/templates/tutorial3.html') +
          '" width="' + context.TUTORIAL_WIDTH + '" height="' +
          context.TUTORIAL_HEIGHT + '"></iframe>');
      tutorialPane.appendContent(iframe, context.TUTORIAL_HEIGHT);
    };


    // INITIALIZE AND DISPLAY PANE ============================================
    // If the user is in the middle of the tutorial, some things behave
    // differently

    // first, get the appropriate location for tutorial popup
    var window_width = $(window).width();
    var width = window_width/3 > context.TUTORIAL_WIDTH ?
        context.TUTORIAL_WIDTH :
        window_width/3;
    // must take the margin & padding of body into account (a rare few websites
    // throw the placement off with it)
    var body = $('body');
    var margin = body.css('margin-left');
    margin = Length.toPx(document.body, margin);
    var padding = body.css('padding-left');
    padding = Length.toPx(document.body, padding);

    var xPos = window_width - (context.PANE_PADDING_WIDTH*2) - width
        - padding + margin;
    var yPos = context.PANE_PADDING_HEIGHT*3;

    var tutorialBranding = $('<div style="position:relative; height:1.5em">' +
        '<p id="branding-attribution">Powered by ' +
        '<span class="context-logo"><sup>[1]</sup>Context</span></p>');

    var tutorialPane = new context.HoverPane(true, tutorialBranding);
    // tutorial pane must have Z dialed back so that other hovercards overlap
    // it when the user is experimenting
    tutorialPane.setZ(tutorialPane.getZ() - 1);
    tutorialPane.moveCustom(xPos, yPos, width, 0);
    var iframe = $('<iframe src="' +
        chrome.extension.getURL('/templates/tutorial-intro.html') +
        '" width="' + context.TUTORIAL_INTRO_WIDTH + '" height="' +
        context.TUTORIAL_INTRO_HEIGHT + '"></iframe>');
    tutorialPane.appendContent(iframe);

    // SET UP DEMO PANE =======================================================
    // Rather than interfering with the default hoverpane that the main content
    // script manages, create a 'demo pane' that will be hovered next to the
    // tutorial pane
    var demoBranding = $('<div style="position:relative; height:1.5em">' +
        '<p id="branding-attribution">Powered by ' +
        '<span class="context-logo"><sup>[1]</sup>Context</span></p>' +
        '<p id="branding-blacklist-link"><a id="add-to-blacklist" href="#">' +
        'Don\'t show context for this page</a></p></div>');
    var demoPane = new context.HoverPane(false, demoBranding);

    // "Don't show context for this page" button must function differently for
    // tutorial, since it's not domain-bound
    $('#add-to-blacklist').click(function() {
      autoshowEnabled = false;
      demoPane.hide();
    });

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
          tutorialPane.hide();
        }

        // Listeners for messages coming from the tutorial iframes
        if(request.action === 'tutorial-close') {
          tutorialPane.hide();
        }
        if(request.action === 'tutorial-step1') {
          runStep1();
        }
        if(request.action === 'tutorial-step2') {
          runStep2();
        }
        if(request.action === 'tutorial-step3') {
          runStep3();
        }
        if(request.action === 'tutorial-end') {
          tutorialPane.hide();
        }
        if(request.action === 'tutorial-create-hoverpane') {
          // Check if user has banned autoshow
          if(request.autoshow === true && !autoshowEnabled) {
            return;
          }
          context.contentRetriever.insertDataIntoPane(request.query,
              demoPane, tutorialPane.pane);
        }
        if(request.action === 'tutorial-close-demo') {
          demoPane.hide();
        }
      }
    );
  };
})(jQuery);
