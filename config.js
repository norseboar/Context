var CONTEXT = CONTEXT || {};

CONTEXT.freebaseMinimum = 75;
CONTEXT.strings = {};
CONTEXT.maxHeight = 500;
CONTEXT.minHeight = 50;
CONTEXT.minWidth = 330;
CONTEXT.defaultWidth = 400;
CONTEXT.defaultHeight = 400;
CONTEXT.iframeHeight = 400;

CONTEXT.frameLeftBuffer = 10;
CONTEXT.frameRightBuffer = 10;
CONTEXT.frameTopBuffer = 10;
CONTEXT.frameBotBuffer = 10;

CONTEXT.wikipediaPrefix = 'http://en.m.wikipedia.org/wiki/';
(function (){
  s = CONTEXT.strings;
  s.google_api_key = "AIzaSyBTLamb0-7P5lVpI5DWbcVLRd6DEfBQynU";
  s.wikipedia_search_url = "http://www.wikipedia.org/search-redirect.php?family=wikipedia&language=en&search=";
  s.freebase_search_url = "https://www.googleapis.com/freebase/v1/search?key=" + s.google_api_key;
  s.freebase_topic_url = "https://www.googleapis.com/freebase/v1/topic";
  s.freebase_image_url = "https://usercontent.googleapis.com/freebase/v1/image";
})();
