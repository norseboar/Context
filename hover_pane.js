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
  hp.movePane = function(target) {
    // Get space around the target (distance from element edges to page edges)
    target = getNearestBlockElement(target);
    var offset = target.offset();
    var docHeight = $(window).height();
    var docWidth = $(window).width();
    var tarWidth = target.outerWidth();
    var tarHeight = target.outerHeight();
    var topSpace = offset.top - (CONTEXT.panePaddingHeight * 2);
    var bottomSpace = docHeight - offset.top - tarHeight
      - (CONTEXT.panePaddingHeight * 2);
    var leftSpace = offset.left - (CONTEXT.panePaddingWidth * 2);
    var rightSpace = docWidth - offset.left - tarWidth
      - CONTEXT.panePaddingWidth * 2;

    // if(rightSpace >= CONTEXT.minWidth){
    //   pane.css({
    //     top: (offset.top - CONTEXT.panePaddingHeight) + "px",
    //     left: (offset.left + tarWidth + CONTEXT.panePaddingWidth) + "px"
    //   }).fadeIn(200);
    // }
    // else if (bottomSpace >= CONTEXT.minHeight) {
    //   pane.css({
    //
    //   })
    // }

    pane.css({
      top: (offset.top + CONTEXT.panePaddingHeight) + "px",
      left: (offset.left + tarWidth + CONTEXT.panePaddingWidth) + "px"
    }).fadeIn(200);

  };

  // Add content to the hoverPane. This can be done without this method through
  // jQuery selectors, but this method is preferred.
  hp.reset = function(){
    paneBody.empty();
    paneBody.css({ height: 0, width: 400 })
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
    var h = content.height() < CONTEXT.maxHeight ? content.height() : CONTEXT.maxHeight;
    if(h > paneBody.height()){
      paneBody.animate({ height: h + 20 });
    }

  };

  return hp;
};
