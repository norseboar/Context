// By default, not all Wikimedia links on Wikipedia's mobile page link to other mobile links
// This will change all such links to mobile ones. This allows iframes of mobile Wikipedia 
// pages to provide users with a way to easily navigate to other pages in the iframe (since
// non-mobile pages look bad in such a small frame)
(function($) {
	$("a").each(function(){
		var t = this;
		var hostname = this.hostname;
		var oldHref = $(this).attr('href')
		var slice0 = oldHref.slice(0, 11);
		var slice = oldHref.slice(11, 13);
		if(oldHref.slice(0, 5) === '//en.' && oldHref.slice(5, 7) !== 'm.'){
			var newHref = [oldHref.slice(0, 5), 'm.', oldHref.slice(5)].join('');
			$(this).attr('href', newHref);
		}
	});
})(jQuery);