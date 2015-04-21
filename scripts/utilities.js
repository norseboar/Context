"use strict"

// Add isEmpty to string prototype as a general utility
// String.method ("isEmpty", function() {
//     return (this.length === 0 || !this.trim());
// });
String.prototype.isEmpty = function () {
  return (this.length === 0 || !this.trim());
}

// Strips out any punctuation that should end a word (whitespace, comma,
// colon, semicolon, period, question mark, exclamation mark, paretheses)
String.prototype.removePunctuation = function(){
  return this.replace(/[,:;.?!()"]/, '');
};

String.prototype.condenseWhitespace = function(){
  return this.replace(/\s+/gm, ' ');
}

// This object is for utility functions. Utilities is not taken by javascript by
// default
var context = context || {};
context.utilities = (function() {
  return {
    increment: function(i) {
      return i++;
    },
    decrement: function(i) {
      return i--;
    },
    // Returns any words that are partially selected in addition to the full
    // text of a selection
    getFullTextFromSelection : function(selection) {
      if(!selection){
        return '';
      }
      var text = selection.toString();
      if(!text){
        return '';
      }

      var earlyIndex, lateIndex = 0;
      var earlyText, lateText = '';
      var anchorIsFirst = true;

      var anchorPosition = selection.anchorNode.compareDocumentPosition(
          selection.focusNode);
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
        while(earlyText && (c = earlyText.charAt(earlyIndex--)
            .removePunctuation().trim())){
          text = c.concat(text);
        }
      }

      // Same for the end of the selection trailing with whitespace or punctuation
      if(text[(text.length -1)].removePunctuation().trim()){
        while(lateText && (c = lateText.charAt(lateIndex++)
            .removePunctuation().trim())){
          text = text.concat(c);
        }
      }

      return text.removePunctuation().condenseWhitespace().trim();
    }
  }
});
