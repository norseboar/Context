// Module to create a hover pane. This pane can be moved next to a "target"
// element. The pane will appear in an unobtrusive location next to the target
// (by default, to the right)
var CONTEXT = CONTEXT || {};

CONTEXT.hoverPane = function() {
  // Create object to be returned. This object will have public methods exposed
  // for manipulating the hover pane
  var hp = {};
  hp.width = CONTEXT.defaultWidth;
  hp.height = CONTEXT.defaultHeight;

  // Create a jquery object for the frame
  var pane = $('<div class="hover-pane"></div>');
  var paneBody = $('<div class="pane-body"></div>');
  var branding = $('<div class="branding"><p>Powered by <span class="context-logo">Context</span></p></div>')
  pane.appendTo('body');
  paneBody.appendTo(pane);
  branding.appendTo(pane);

  pane.hide();

  // Set up a handler to dismiss the hover pane if it's clicked out of
  $('body').mousedown(function() {
    if(!pane.is(':hover')) {
      pane.fadeOut(200);
    }
  });

  // Gets the closest parent to an element that is /not/ inline (if the initial
  // element is already not inline, it will be returned as-is)
  var getNearestBlockElement = function(jqElement){
    if(!(window.getComputedStyle(jqElement[0]).display === "inline")){
      return jqElement;
    }
    else {
      return getNearestBlockElement(jqElement.parent());
    }
  };

  // Position the frame relative to the target jQuery element (not including
  // inline targets)
  // Positioning logic works as follows:
  // Check the highest-priority position. If there is space, place pane there.
  // Otherwise, move to the next highest-priority. Positions are:
  // 1) To the right of the relevant div
  // 2) Below the selected text
  // 3) Above the selected text
  hp.movePane = function(element) {
    target = getNearestBlockElement(element);
    var tarPos = target.offset();
    var tarWidth = target.outerWidth();

    // Check if there's space to the right first
    var widthAvailable = window.clientWidth - tarPos.left - tarWidth
      - CONTEXT.frameRightBuffer - CONTEXT.frameLeftBuffer;
    hp.width = widthAvailable > CONTEXT.defaultWidth ? CONTEXT.defaultWidth :
      widthAvailable;
    if(hp.width >= CONTEXT.minWidth){

      pane.css({
        top: (tarPos.top + 5) + "px",
        left: (tarPos.left + tarWidth + CONTEXT.frameLeftBuffer) + "px"
      }).fadeIn(200);
    }
    else {
      // If there's no space to the right, check for space below
      var ePos = element.offset();
      var eHeight = element.outerHeight();

      var ih = window.clientHeight;
      var t = ePos.top;


      var heightAvailable = window.clientHeight - ePos.top - eHeight
        - CONTEXT.frameTopBuffer - CONTEXT.frameBotBuffer;
      hp.height = heightAvailable > CONTEXT.defaultHeight ? CONTEXT.defaultHeight :
        heightAvailable;
      widthAvailable = window.clientWidth - CONTEXT.frameRightBuffer
        - CONTEXT.frameLeftBuffer;
      hp.width = CONTEXT.defaultWidth < widthAvailable ? CONTEXT.defaultWidth :
        widthAvailable;
      if(hp.height >= CONTEXT.minHeight) {
        var leftPos = ePos.left;
        if(leftPos + hp.width > window.clientWidth) {
          leftPos = window.clientWidth - hp.width - CONTEXT.frameRightBuffer;
        }
        pane.css({
          top: (ePos.top + eHeight + CONTEXT.frameTopBuffer) + "px",
          left: leftPos + "px"
        }).fadeIn(200);
      }
    }

  };

  // Add content to the hoverPane. This can be done without this method through
  // jQuery selectors, but this method is preferred.
  hp.reset = function(){
    paneBody.empty();
    paneBody.css({ height: 0 })
    hp.width = CONTEXT.defaultWidth;
  };

  hp.appendContent = function(content, isText){
    // Do not apply text formatting to non-text objects (like iframes)
    // pane.css({ width: hp.width })
    if(isText){
      var paneContent = $('<div class="pane-content"></div>');
      content.appendTo(paneContent.appendTo(paneBody));
    }
    else {
      content.appendTo(paneBody);
    }

    // For some reason, a small amount (like 20) needs to be added to
    // height to accommodate the iframe
    var h = content.height() < CONTEXT.maxHeight ? content.height() : CONTEXT.maxHeight;
    if(h > paneBody.height()){
      paneBody.animate({ height: h + 20 });
    }

  };

  return hp;
};
