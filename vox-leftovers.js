var stacks = context.cardstacks.getKeywords();

// Wrap all Vox-related terms in highlights that will pop cardstacks
$('p').highlight(context.cardstacks.getKeywords(), { element: 'span',
  className: 'cardstack-highlight'});
$('.cardstack-highlight').click(function(event){
  var element = $(event.currentTarget);
  context.contentRetriever.insertDataIntoPane(element.text(),
      hoverPane, element);
});


// for getcontenturl:
var url = getVoxContent(query);
if (url) {
  return url;
}
else {
  return getWikipediaContent(query);
}
