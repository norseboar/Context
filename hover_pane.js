// Module to create a hover pane. This pane can be moved next to a "target"
// element. The pane will appear in an unobtrusive location next to the target
// (by default, to the right)
var CONTEXT = CONTEXT || {};

CONTEXT.hoverPane = function() {
  // Create object to be returned. This object will have public methods exposed
  // for manipulating the hover pane
  var hp = {};

  // Create a jquery object for the frame
  var pane = $('<div class="hover-pane"></div>');
  var paneBody = $('<div class="pane-body"></div>');
  var branding = $('<div class="context-branding"><p>Powered by <span class="context-logo"><sup>[1]</sup>Context</span></p></div>')
  pane.appendTo('body');
  paneBody.appendTo(pane);
  branding.appendTo(pane);

  pane.hide();

  // Create the initial dimensions of the frame (can be changed when placed)
  hp.width = CONTEXT.maxWidth;
  hp.height = CONTEXT.maxHeight;

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
  hp.movePane = function(target) {
    // Get space around the target (distance from element edges to page edges)
    target = getNearestBlockElement(target);
    var offset = target.offset();
    var docHeight = $(window).height();
    var docWidth = $(window).width();
    var tarWidth = target.outerWidth();
    var tarHeight = target.outerHeight();
    var topSpace = $(window).scrollTop() + offset.top - (CONTEXT.panePaddingHeight * 2);
    var bottomSpace = $(window).scrollTop() + docHeight - offset.top - tarHeight - branding.height()
      - (CONTEXT.panePaddingHeight * 2);
    var leftSpace = offset.left - (CONTEXT.panePaddingWidth * 2);
    var rightSpace = docWidth - offset.left - tarWidth
      - CONTEXT.panePaddingWidth * 2;

    if(rightSpace >= CONTEXT.minWidth){
      hp.width = (rightSpace > CONTEXT.maxHeight ? CONTEXT.maxHeight :
        rightSpace);
      pane.css({
        top: (offset.top - CONTEXT.panePaddingHeight) + "px",
        left: (offset.left + tarWidth + CONTEXT.panePaddingWidth) + "px"
      }).fadeIn(200);
    }
    else {
      // It's possible the width of the entire window is smaller than the
      // default (maybe if this ever moved to mobile?)
      hp.width = (docWidth > CONTEXT.maxWidth ? CONTEXT.maxWidth : docWidth);
      hp.height = (bottomSpace > CONTEXT.maxHeight ? CONTEXT.maxHeight :
        bottomSpace);
      // If there's not even enough space at the bottom, just push it down anyway
      hp.height = (bottomSpace < CONTEXT.minHeight ? CONTEXT.minHeight : bottomSpace);
      pane.css({
        top: (offset.top + tarHeight + CONTEXT.panePaddingHeight) + "px",
        left: (docWidth - hp.width - CONTEXT.panePaddingWidth) + "px"
      }).fadeIn(200);
    }

    // pane.css({
    //   top: (offset.top + CONTEXT.panePaddingHeight) + "px",
    //   left: (offset.left + tarWidth + CONTEXT.panePaddingWidth) + "px"
    // }).fadeIn(200);

    // Height is not set now because animation will take place when content
    // is appended
    pane.css({ width: hp.width });
    paneBody.css({ width:hp.width });
  };

  // Add content to the hoverPane. This can be done without this method through
  // jQuery selectors, but this method is preferred.
  hp.reset = function(){
    paneBody.empty();
    hp.width = CONTEXT.maxWidth;
    hp.height = CONTEXT.maxHeight;
    pane.css({ width: hp.width })
    paneBody.css({ height: 0, width: hp.width })
  };

  hp.appendContent = function(content, isText){
    // Do not apply text formatting to non-text objects (like iframes)
    if(isText){
      var paneContent = $('<div class="pane-content"></div>');
      content.appendTo(paneContent.appendTo(paneBody));
    }
    else {
      content.appendTo(paneBody);
    }

    // For some reason, a small amount (like 20) needs to be added to
    // height to accommodate the iframe
    var h = content.outerHeight() < CONTEXT.maxHeight ?
      content.outerHeight() : CONTEXT.maxHeight;
    if(h > paneBody.height()){
      paneBody.animate({ height: (h + branding.height())});
    }

  };

  return hp;
};
