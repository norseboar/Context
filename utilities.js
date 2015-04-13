"use strict"
// This file is for utilities added to javascript generally, usually by adding functions to prototypes
// E.g. adding an isEmpty method to string

// Adds method to constructor prototype
Function.prototype.method = function (name, func){
  if(this.prototype[name]){
    throw {
      name: "Error",
      message: "Method already exists"
    }
    this.prototype[name] = func;
    return this;
  }

}

// Add isEmpty to string prototype as a general utility
// String.method ("isEmpty", function() {
//     return (this.length === 0 || !this.trim());
// });
String.prototype.isEmpty = function () {
  return (this.length === 0 || !this.trim());
}

// This object is for utility functions. Utilities is not taken by javascript by
// default
var Utilities = {
  // Here are a few operators represented as traditional functions. This means
  // they can be easily passed around
  increment: function(i){
    return i++;
  },
  decrement: function(i){
    return i--;
  }
}
