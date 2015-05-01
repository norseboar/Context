"use strict"
// Module to create a hover pane. This pane can be moved next to a "target"
// element. The pane will appear in an unobtrusive location next to the target
// (by default, to the right)
var context = context || {};

// Instead of creating the constructor directly, it is wrapped in a function
// call so jQuery can be passed in
context.HoverPane = (function($) {
  // return the constructor

  return function(options) {
    // Create a jquery object for the pane
    var pane = $('<div class="hover-pane"></div>');
    if(options.fixed) {
      pane.css('position', 'fixed');
    }
    var paneBody = $('<div class="pane-body"></div>');
    var branding = $('<div class="pane-branding"></div>');

    paneBody.appendTo(pane);
    branding.appendTo(pane);

    if(options.brandingContent) {
      options.brandingContent.appendTo(branding);
    }

    pane.appendTo('body');
    pane.hide();

    this.pane = pane;

    // Create the initial dimensions of the frame (can be changed when placed)
    var width = context.MAX_WIDTH;
    var height = context.MAX_HEIGHT;

    this.getWidth = function() {
      return width;
    }
    this.getHeight = function() {
      return height;
    }
    this.getZ = function() {
      return pane.css('z-index');
    }
    this.setZ = function(z) {
      pane.css('z-index', z);
    }

    // Set up a handler to dismiss the hover pane if it's clicked out of
    if(!options.sticky) {
      $('html').mousedown(function() {
        if(!pane.is(':hover')) {
          pane.fadeOut(200);
        }
      });
    }

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
      var topSpace = $(window).scrollTop() + offset.top;
      var bottomSpace = $(window).scrollTop() + docHeight - offset.top -
          context.PANE_PADDING_HEIGHT;
      var underTarSpace = bottomSpace - tarHeight;
      var leftSpace = offset.left - (context.PANE_PADDING_WIDTH * 2);
      var rightSpace = docWidth - offset.left - tarWidth -
          context.PANE_PADDING_WIDTH * 2;
      var paneSpace = context.MAX_HEIGHT + context.PANE_PADDING_HEIGHT +
          context.BRANDING_HEIGHT;

      if(rightSpace >= context.MIN_WIDTH){
        width = (rightSpace > context.MAX_WIDTH ? context.MAX_WIDTH :
          rightSpace);
        if(options.brandingContent) {
          options.brandingContent.width(width);
        }
        var topPos = offset.top - context.PANE_PADDING_HEIGHT;
        // If the target is too low, shift the hover pane up a bit
        if(bottomSpace < paneSpace && docHeight >= paneSpace) {
          topPos = docHeight + $(window).scrollTop() - paneSpace;
        }
        pane.css({
          top: (topPos) + "px",
          left: (offset.left + tarWidth + context.PANE_PADDING_WIDTH) + "px"
        }).fadeIn(200);
      }
      else {
        // It's possible the width of the entire window is smaller than the
        // default (maybe if this ever moved to mobile?)
        width = (docWidth > context.MAX_WIDTH ? context.MAX_HEIGHT : docWidth);
        if(options.brandingContent) {
          options.brandingContent.width(width);
        }
        height = (underTarSpace > context.MAX_HEIGHT ? context.MAX_HEIGHT :
          underTarSpace);
        // If there's not even enough space at the bottom, just push it
        // down anyway
        height = (underTarSpace < context.MIN_HEIGHT ? context.MIN_HEIGHT :
            underTarSpace);
        pane.css({
          top: (offset.top + tarHeight + context.PANE_PADDING_HEIGHT) + "px",
          left: (docWidth - width - context.PANE_PADDING_WIDTH) + "px"
        }).fadeIn(200);
      }

      // Height is not set now because animation will take place when content
      // is appended
      pane.css({ width: width });
      paneBody.css({ width: width });
    };

    // Places the hoverpane directly (no intelligence about where it should be moved)
    // Must pass in starting x and y coordinates, and desired width (height is always
    // determined by content)
    // Effect is a string that defines certain effects for how the movement will occur
    this.moveCustom = function(xPos, yPos, width, effect) {
      width = width;
      if(options.brandingContent) {
        options.brandingContent.width(width);
      }
      if(effect === 'animate') {
        pane.animate({
          width: width,
          left: xPos + 'px',
          top: yPos + 'px'
        })
      }
      else {
        pane.css({
          left: xPos + 'px',
          top: yPos + 'px',
        }).fadeIn(200);

        pane.css({ width: width });
        paneBody.css({ width: width });
      }
    };

    // Empty the pane, and move its size back to default
    this.reset = function(){
      paneBody.empty();
      width = context.MAX_WIDTH;
      if(options.brandingContent) {
        options.brandingContent.width(width);
      }
      height = context.MAX_HEIGHT;
      pane.css({ width: width })
      paneBody.css({ height: 0, width: width })
    };

    // Add content to the hoverPane. This can be done without this method through
    // jQuery selectors, but this method is preferred.
    // content must be a jQuery element
    // maxHeight is an optional parameter for what the max height of this pane can be
    this.appendContent = function(content, maxHeight, options){
      var options = options || {};
      if(options.fade) {
        content.appendTo(paneBody).hide();
        content.fadeIn(200)
      }
      else {
        content.appendTo(paneBody);
      }
      maxHeight = maxHeight || context.MAX_HEIGHT
      var h = content.outerHeight() < maxHeight ?
        content.outerHeight() : maxHeight;
      height = h;
      if(h > paneBody.height()){
        paneBody.animate({ height: h});
      }
    };

    this.empty = function(options) {
      var that = this;
      var options = options || {};
      if(options.fade) {
        // fade the body out before emptying and re-showing it
        paneBody.fadeOut(200, function() {
          $(this).empty();
          $(this).show();
          if(options.callAfter) {
            options.callAfter();
          }
        });
      }
      else {
        paneBody.empty();
      }
    };

  };
})(jQuery);
