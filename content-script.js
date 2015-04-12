"use strict";
(function ($) {

  // Creates context pane, and creates a handler to update the context pane
  // whenever text is selected
  var hoverPane;
  var init = function(){
    hoverPane = new context.HoverPane();
    var stacks = context.cardstacks.getKeywords();
    // Wrap all cardstack-related terms in highlights that will pop cardstacks
    $('p').highlight(context.cardstacks.getKeywords(), { element: 'span',
      className: 'cardstack-highlight'});
    $('.cardstack-highlight').click(function(event){
      var element = $(event.currentTarget);
      context.contentRetriever.insertDataIntoPane(element.text(), hoverPane,
          element);
    });

    // automatic hoverpane logic (when a user selects text, automatically
    // show pane)

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
            $('body').mouseup(function () {
              setTimeout(function () {
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
              }, (400));
            });
          }
        });
      }
    });
  };

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
  // colon, semicolon, period, question mark, exclamation mark)
  String.prototype.removePunctuation = function(){
    return this.replace(/[,:;.?!]/, '');
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
    var earlyText, lateText = "";
    var anchorIsFirst = true;

    var anchorPosition = selection.anchorNode.compareDocumentPosition(selection.focusNode);
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
      while(earlyText && (c = earlyText.charAt(earlyIndex--).removePunctuation().trim())){
        text = c.concat(text);
      }
    }

    // Same for the end of the selection trailing with whitespace or punctuation
    if(text[(text.length -1)].removePunctuation().trim()){
      while(lateText && (c = lateText.charAt(lateIndex++).removePunctuation().trim())){
        text = text.concat(c);
      }
    }

    return text.removePunctuation().condenseWhitespace().trim();
  };

  init();

})(jQuery);
