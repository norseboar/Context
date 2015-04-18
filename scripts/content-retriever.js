"use strict"
// Module for retrieving content about a particular query and inserting it into
// a hoverpane

var context = context || {};

context.contentRetriever = (function($) {
  // content functions for individual sources
  var getVoxContent = function (query) {
    return context.cardstacks.getUrl(query);
  };
  var getWikipediaContent = function (query) {
    // Wikipedia pages replace spaces in titles with underscores
    query = query.replace(/\s+/gm, '_');
    return context.WIKIPEDIA_PREFIX + query;
  };

  // For now, only used source is Wikipedia. This will grow, though.
  var getContentUrl = function (query) {
    query = query.toLowerCase();
    return getWikipediaContent(query);
  };

  return {
    // Gets a context URL based on the query, moves the hoverpane to the
    // appropriate location, and inserts the iframe into the pane
    // movement must be done at this time because moving the hoverpane could
    // change its size, which affects what size the iframe can be
    insertDataIntoPane: function(query, hp, jqElement) {
      hp.reset();
      hp.move(jqElement);
      var url = getContentUrl(query);
      var iframe = $('<iframe src="' + url + '" width="' + hp.width +
          '" height="' + hp.height + '"></iframe>');
      hp.appendContent(iframe, false);
    }
  };
})(jQuery);
