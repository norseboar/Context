"use strict"
// Module to create a hover pane. This pane can be moved next to a "target"
// element. The pane will appear in an unobtrusive location next to the target
// (by default, to the right)
var context = context || {};

// Instead of creating the constructor directly, it is wrapped in a function
// call so jQuery can be passed in
context.HoverPane = (function($) {
  // return the constructor
  // constructor takes optional branding jQuery object, to set the branding
  // (the gray space under the hoverpane
  return function(brandingContent) {
    // Create a jquery object for the pane
    var pane = $('<div class="hover-pane"></div>');
    var paneBody = $('<div class="pane-body"></div>');
    var branding = $('<div class="pane-branding"></div>');
    pane.appendTo('body');
    paneBody.appendTo(pane);
    branding.appendTo(pane);
    brandingContent.appendTo(branding);

    pane.hide();

    // Create the initial dimensions of the frame (can be changed when placed)
    this.width = context.MAX_WIDTH;
    this.height = context.MAX_HEIGHT;

    // Set up a handler to dismiss the hover pane if it's clicked out of
    $('body').mousedown(function() {
      if(!pane.is(':hover')) {
        pane.fadeOut(200);
      }
    });

    // Gets a block element that's as close as possible to the target element
    // (if the target is already a block, it will be returned as-is)
    // target must be a jQuery element
    var getNearestBlockElement = function(target){
      if(!(window.getComputedStyle(target[0]).display === "inline")){
        return target;
      }
      else {
        return getNearestBlockElement(target.parent());
      }
    };

    // Hide pane
    this.hide = function() {
      pane.fadeOut(200);
    };

    // Position the frame relative to the target (not including
    // inline targets)
    // target must be a jQuery element
    this.move = function(target) {
      // Get space around the target (distance from element edges to page edges)
      target = getNearestBlockElement(target);
      var offset = target.offset();
      var docHeight = $(window).height();
      var docWidth = $(window).width();
      var tarWidth = target.outerWidth();
      var tarHeight = target.outerHeight();
      var topSpace = $(window).scrollTop() + offset.top -
          (context.PANE_PADDING_HEIGHT * 2);
      var bottomSpace = $(window).scrollTop() + docHeight - offset.top -
          tarHeight - branding.height() - (context.PANE_PADDING_HEIGHT * 2);
      var leftSpace = offset.left - (context.PANE_PADDING_WIDTH * 2);
      var rightSpace = docWidth - offset.left - tarWidth -
          context.PANE_PADDING_WIDTH * 2;

      if(rightSpace >= context.MIN_WIDTH){
        this.width = (rightSpace > context.MAX_HEIGHT ? context.MAX_HEIGHT :
          rightSpace);
        pane.css({
          top: (offset.top - context.PANE_PADDING_HEIGHT) + "px",
          left: (offset.left + tarWidth + context.PANE_PADDING_WIDTH) + "px"
        }).fadeIn(200);
      }
      else {
        // It's possible the width of the entire window is smaller than the
        // default (maybe if this ever moved to mobile?)
        this.width = (docWidth > context.MAX_WIDTH ? context.MAX_HEIGHT : docWidth);
        this.height = (bottomSpace > context.MAX_HEIGHT ? context.MAX_HEIGHT :
          bottomSpace);
        // If there's not even enough space at the bottom, just push it
        // down anyway
        this.height = (bottomSpace < context.MIN_HEIGHT ? context.MIN_HEIGHT :
            bottomSpace);
        pane.css({
          top: (offset.top + tarHeight + context.PANE_PADDING_HEIGHT) + "px",
          left: (docWidth - this.width - context.PANE_PADDING_WIDTH) + "px"
        }).fadeIn(200);
      }

      // Height is not set now because animation will take place when content
      // is appended
      pane.css({ width: this.width });
      paneBody.css({ width: this.width });
    };

    // Places the hoverpane directly (no intelligence about where it should be moved)
    // Must pass in starting x and y coordinates, desired width, and desired height
    this.placeCustom = function(xPos, yPos, width, height) {
      this.width = width;
      this.height = height;
      pane.css({
        left: xPos + 'px',
        top: yPos + 'px',
      }).fadeIn(200);

      // Height is not set now because animation will take place when content
      // is appended
      pane.css({ width: this.width });
      paneBody.css({ width: this.width });
    };

    // Empty the pane, and move its size back to default
    this.reset = function(){
      paneBody.empty();
      this.width = context.MAX_WIDTH;
      this.height = context.MAX_HEIGHT;
      pane.css({ width: this.width })
      paneBody.css({ height: 0, width: this.width })
    };

    // Add content to the hoverPane. This can be done without this method through
    // jQuery selectors, but this method is preferred.
    // content must be a jQuery element
    this.appendContent = function(content){
      content.appendTo(paneBody);

      var h = content.outerHeight() < context.MAX_HEIGHT ?
        content.outerHeight() : context.MAX_HEIGHT;
      this.height = h;
      if(h > paneBody.height()){
        paneBody.animate({ height: (h + branding.height())});
      }
    };
  };
})(jQuery);
