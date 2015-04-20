"use strict";
(function ($) {

  // Creates context pane, and creates a handler to update the context pane
  // whenever text is selected
  var hoverPane;
  var init = function(){
    // Set up tutorial
    chrome.runtime.sendMessage({query: 'shouldRunTutorial'},
        function(response){
          context.runTutorial();
          // if(response.shouldRunTutorial){
          //   context.tutorial();
          // }
    });

    // Create one hoverpane to be re-used whenever this extension needs it
    var branding = $('<div style="position:relative; height:1.5em">' +
        '<p id="branding-attribution">Powered by ' +
        '<span class="context-logo"><sup>[1]</sup>Context</span></p>' +
        '<p id="branding-blacklist-link"><a id="add-to-blacklist" href="#">' +
        'Don\'t show context for this page</a></p></div>');
    hoverPane = new context.HoverPane(branding);
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
          showPaneFromSelection(hoverPane);
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
              setTimeout(showPaneFromSelection(hoverPane), (400));
            });
          }
        });
      }
    });
  };

  // Reveals a hoverpane based on text currently selected
  var showPaneFromSelection = function(hoverPane) {
    var selection = window.getSelection();
    if(!selection) {
      return;
    };
    var parentElement = $(selection.anchorNode.parentElement);
    var element = $(selection.focusNode);
    var query = getFullTextFromSelection(selection);
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

  // Strips out any punctuation that should end a word (whitespace, comma,
  // colon, semicolon, period, question mark, exclamation mark, paretheses)
  String.prototype.removePunctuation = function(){
    return this.replace(/[,:;.?!()]/, '');
  };

  String.prototype.condenseWhitespace = function(){
    return this.replace(/\s+/gm, ' ');
  }

  // Returns any words that are partially selected in addition to the full
  // text of a selection
  var getFullTextFromSelection = function (selection){
    if(!selection){
      return '';
    }
    var text = selection.toString();
    if(!text){
      return '';
    }

    var earlyIndex, lateIndex = 0;
    var earlyText, lateText = '';
    var anchorIsFirst = true;

    var anchorPosition = selection.anchorNode.compareDocumentPosition(
        selection.focusNode);
    if(anchorPosition) {
      anchorIsFirst = (Node.DOCUMENT_POSITION_FOLLOWING & anchorPosition) ||
        (Node.DOCUMENT_POSITION_CONTAINED_BY & anchorPosition);
    }
    else {
      anchorIsFirst = selection.anchorOffset <= selection.focusOffset;
    }
    if(anchorIsFirst){
      earlyIndex = selection.anchorOffset - 1;
      earlyText = selection.anchorNode.nodeValue;
      lateIndex = selection.focusOffset;
      lateText = selection.focusNode.nodeValue;
    }
    else {
      earlyIndex = selection.focusOffset - 1;
      earlyText = selection.focusNode.nodeValue;
      lateIndex = selection.anchorOffset;
      lateText = selection.anchorNode.nodeValue;
    }


    var c = '';

    // If the start of the selection leads with whitespace or punctuation, don't
    // search farther forward
    if(text[0].removePunctuation().trim()){
      while(earlyText && (c = earlyText.charAt(earlyIndex--)
          .removePunctuation().trim())){
        text = c.concat(text);
      }
    }

    // Same for the end of the selection trailing with whitespace or punctuation
    if(text[(text.length -1)].removePunctuation().trim()){
      while(lateText && (c = lateText.charAt(lateIndex++)
          .removePunctuation().trim())){
        text = text.concat(c);
      }
    }

    return text.removePunctuation().condenseWhitespace().trim();
  };

  init();

})(jQuery);
