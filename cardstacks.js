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
  },
  {
    keywords: ['gun control', 'gun violence'],
    url: 'http://www.vox.com/cards/gun-violence-facts'
  },
  {
    keywords: ['gay marriage', 'same-sex marriage', 'same sex marriage', 'marriage equality'],
    url: 'http://www.vox.com/cards/same-sex-marriage'
  },
  {
    keywords: ['voting rights'],
    url:'http://www.vox.com/cards/voting-rights-fight-explained'
  },
  {
    keywords: ['medicaid expansion'],
    url:'http://www.vox.com/cards/medicaid-expansion-explained'
  },
  {
    keywords: ['vaccines', 'vaccine'],
    url: 'http://www.vox.com/cards/vaccines'
  },
  {
    keywords: ['bitcoin', 'bitcoins'],
    url: 'http://www.vox.com/cards/bitcoin'
  },
  {
    keywords: ['campus rape', 'campus sexual assault', 'sexual assault on campus',
      'rape on campus', 'college sexual assault', 'sexual assault in college', 'title ix',
      'title nine'],
    url: 'http://www.vox.com/cards/campus-sexual-assault-title-ix'
  },
  {
    keywords: ["obama's climate plan", "war on coal"],
    url: 'http://www.vox.com/cards/obama-climate-plan'
  },
  {
    keywords: ['affirmative action'],
    url: 'http://www.vox.com/cards/affirmative-action/what-is-affirmative-action'
  },
  {
    keywords: ['immigration reform', 'dream act', 'daca'],
    url: 'http://www.vox.com/cards/obama-immigration-executive-action-amnesty-congress/what-is-daca-obama-deferred-action-dreamers-immigration'
  }
];

cs.keywords = [];
cs.mappings.forEach(function(mapping){
  mapping.keywords.forEach(function (keyword){
    cs.keywords.push(keyword);
  });
});

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
