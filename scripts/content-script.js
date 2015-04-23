"use strict";
(function ($) {
  var utilities = context.utilities();

  // Creates context pane, and creates a handler to update the context pane
  // whenever text is selected
  var hoverPane;
  var init = function(){
    // Set up tutorial
    context.runTutorial();
    // chrome.runtime.sendMessage({query: 'shouldRunTutorial'},
    //     function(response){
    //       if(response.shouldRunTutorial){
    //         context.runTutorial();
    //       }
    // });

    // Create one hoverpane to be re-used whenever this extension needs it
    var branding = $('<div style="position:relative; height:1.5em">' +
        '<p id="branding-attribution">Powered by ' +
        '<span class="context-logo"><sup>[1]</sup>Context</span></p>' +
        '<p id="branding-blacklist-link"><a id="add-to-blacklist" href="#">' +
        'Don\'t show context for this page</a></p></div>');
    hoverPane = new context.HoverPane({
      brandingContent: branding
    });
    // Add the current page to the blacklist, if user requests
    $('#add-to-blacklist').click(function() {
      var url = window.location.hostname + window.location.pathname;
      $('body').off('mouseup.showPane');
      hoverPane.hide();
      chrome.runtime.sendMessage({action: 'addToBlacklist', url: url});
      return false;
    });

    // Listen for messages from context menu
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(sender.id !== chrome.runtime.id) {
          return;
        }
        if(request.action === 'showPane') {
          showPaneFromSelection();
        }
      }
    );

    // automatic hoverpane logic
    // (when a user selects text, automatically show pane)
    // first, check if auto show is enabled
    chrome.runtime.sendMessage({query: 'autoshow'}, function(response) {
      if(response.autoshow) {
        // next, check if the current site is on the autoshow blacklist
        var url = window.location.hostname + window.location.pathname;
        var blacklisted = false;
        chrome.runtime.sendMessage({query: 'blacklist'}, function(response) {
          for(var i = 0; i < response.blacklist.length; i++) {
            if(response.blacklist[i] === url) {
              blacklisted = true;
              break;
            }
          }
          if(!blacklisted){
            // Wait for a user to select, then show Wikipedia content
            $('body').on('mouseup.showPane', function () {
              // A timeout is needed so that only one event is fired if a user
              // double-clicks to select text
              setTimeout(showPaneFromSelection(), (400));
            });
          }
        });
      }
    });
  };

  // Reveals a hoverpane based on text currently selected
  var showPaneFromSelection = function() {
    var selection = window.getSelection();
    if(!selection || !selection.anchorNode) {
      return;
    }
    var parentElement = $(selection.anchorNode.parentElement);
    var element = $(selection.focusNode);
    var query = utilities.getFullTextFromSelection(selection);
    if(!isQueryValid(query, element)) {
      return;
    }
    console.log("searching for " + query);
    context.contentRetriever.insertDataIntoPane(query, hoverPane,
        parentElement);
  }

  // Decides if a query is valid to search for
  // Includes making sure a query isn't empty, isn't too large, and isn't in a text box
  var isQueryValid = function(query, element){
    var valid = true;
    valid = valid && !query.isEmpty();
    valid = valid && query.length <= context.MAX_QUERY_LENGTH;
    valid = valid && query.split(/\s+/).length <= context.MAX_QUERY_WORDS;
    valid = valid && !element.is(":text");
    var close = element.closest("form");
    valid = valid && element.closest("form").length === 0;
    return valid;
  };

  init();

})(jQuery);
