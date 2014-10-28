// Namespace & methods for accessing Vox card stacks
var CONTEXT = CONTEXT || {};

CONTEXT.cardstacks = {};
var cs = CONTEXT.cardstacks;

// Collection of keywords mapped to Vox card stacks
// Keywords are more accurately "key phrases" -- some terms are specifically
// collections of two or three words
cs.mappings = [
  {
    keywords: ['obamacare'],
    url: 'http://www.vox.com/cards/obamacare'
  },
  {
    keywords: ['detroit bankruptcy'],
    url: 'http://www.vox.com/cards/detroit-bankruptcy-pensions-municipal'
  },
  {
    keywords: ['individual mandate'],
    url: 'http://www.vox.com/cards/individual-mandate'
  },
  {
    keywords: ['ebola'],
    url: 'http://www.vox.com/cards/ebola-facts-you-need-to-know'
  },
  {
    keywords: ['michael brown', 'ferguson'],
    url: 'http://www.vox.com/cards/mike-brown-protests-ferguson-missouri'
  },
  {
    keywords: ['global warming', 'climate change'],
    url: 'http://www.vox.com/cards/global-warming'
  }
];

cs.get = function(query) {
  var url = '';
  cs.mappings.forEach(function (mapping){
    mapping.keywords.forEach(function(keyword){
      if(query === keyword){
        url = mapping.url;
      }
    });
  });
  return url;
};
