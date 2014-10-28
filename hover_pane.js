// Module to create a hover pane. This pane can be moved next to a "target"
// element. The pane will appear in an unobtrusive location next to the target
// (by default, to the right)
var CONTEXT = CONTEXT || {};

CONTEXT.hoverPane = function() {
  // Create object to be returned. This object will have public methods exposed
  // for manipulating the hover pane
  var hp = {};

  // Create a jquery object for the frame
  var element = $('<div class="hover-pane"></div>');
  element.appendTo('body');
  element.hide();

  // Set up a handler to dismiss the hover pane if it's clicked out of
  $('body').mousedown(function() {
    if(!element.is(':hover')) {
      element.hide();
    }
  });

  // Position the frame relative to the target jQuery element
  hp.movePane = function(target) {
    var pos = target.offset();
    var width = target.outerWidth();
    element.css({
      top: (pos.top + 5) + "px",
      left: (pos.left + width + 10) + "px"
    }).show();
  };

  // Add content to the hoverPane. This can be done without this method through
  // jQuery selectors, but this method is preferred.
  hp.emptyContent = function(){
    element.empty();
  };

  hp.appendContent = function(content){
    content.appendTo(element);
  };

  return hp;
};
