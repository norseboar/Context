"use strict";
(function ($) {

  // Creates context pane, and creates a handler to update the context pane
  // whenever text is selected
  var hp;
  var init = function(){
    hp = CONTEXT.hoverPane();

    $('body').mouseup(function () {
      setTimeout(function () {
        getContext(window.getSelection());
      }, (400));
    });
  };

  // Functions for retrieving data
  var getContext = function(selection){
    var query = getFullTextFromSelection(selection);
    if(query.isEmpty()) {
      return;
    }
    query = query.toLowerCase();

    var element = $(selection.anchorNode.parentElement);

    // If the term is associated with a cardstack, show the cardstack
    var url = cs.get(query);
    if(url){
      var iframe = $('<iframe src="' + url +
      '" width="400" height="500"></iframe>');
      updateContextPane(iframe, element);
    }

    // Otherwise, get the term from FreeBase
    else {
      getFreebaseTopic(query, element);
    }
  }

  var getFreebaseTopic = function(query, element){
    var params = {
      'query': query,
      'lang': 'en',
      'limit': 1
    };

    console.log("searching for query " + query);
    $.getJSON(CONTEXT.strings.freebase_search_url, params, function(data, textStatus, jqXHR){
      // Validate that the response is good
      if(!data.result || !data.result[0] || !data.result[0]["mid"] || !data.result[0]["score"]){
        return null;
      };

      var result = data.result[0];

      console.log("score for " + result["name"] + " is " + result["score"]);

      // filter out very unrelated items
      if(data.result[0]["score"] < CONTEXT.freebaseMinimum){
        return null;
      }

      var mid = data.result[0]["mid"];
      $.getJSON(CONTEXT.strings.freebase_topic_url + mid, function(data, textStatus, jqXHR){
        if(!data){
          throw new Error("No topic returned");
        }

        updateContextPane(getFreebasePaneContent(data), element);
      });
    });
  };

  var getFreebasePaneContent = function(data){
    var properties = {
      title: '',
      image: '',
      body: ''
    };

    // Title, image and body will be displayed (if available)
    // Title and body should exist for all entries. Image may not.

    try{
      properties.title = $('<h2>', {text:data.property['/type/object/name'].values[0].text});

      // There are a few places in FreeBase data that might contain good body text.
      // Move through them in order.
      properties.body = $('<p>', {text:data.property['/common/topic/article'].values[0].property['/common/document/text'].values[0].value});


    } catch (e){
      throw new Error('Could not retrieve either title or body from FreeBase data');
    }

    try {
      properties.image = $('<img src="' + CONTEXT.strings.freebase_image_url +
          data.property['/common/topic/image'].values[0].id + '"/>');
    } catch (e){
      console.log('No image available');
    }

    var paneContent = $('<div class="pane-content"></div>');
    paneContent.append(properties.title);
    if(properties.image) {
      paneContent.append(properties.image);
    }
    paneContent.append(properties.body);
    return paneContent;

  };

  // Moves the context pane to the right of the parent element of the selected text
  var updateContextPane = function (content, element) {
    if(!content){
      return;
    }
    // Position the context pane to the right of the element containing selected text
    hp.movePane(element);
    hp.emptyContent();
    hp.appendContent(content);
  };

  // Strips out any punctuation that should end a word (whitespace, comma,
  // colon, semicolon, period, question mark, exclamation mark)
  String.prototype.removePunctuation = function(){
    return this.replace(/[,:;.?!]/, '');
  };

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

    if(selection.anchorOffset < selection.focusOffset){
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

    return text.removePunctuation().trim();
  };

  init();

})(jQuery);
