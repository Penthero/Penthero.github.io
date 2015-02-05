//queue that contains all that youtube need to get
var queue = [];
// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
	getTrendyYoutube();
}

//does the youtube search on what whattrend.com currently says are trending
function getTrendyYoutube() {
	var trendKey = "002c204be34c1d74c935aafdb1a5c2b69831ae0c";
	var trendAPI = "http://api.whatthetrend.com/api/v2/trends.json?callback=?";

	$.getJSON( trendAPI, {
	key: trendKey,
	format: "jsonp"
	})
  
	.done(function( data ) {
		for(var i = 0; i < data.trends.length; ++i) {
			console.log(data.trends[i].query);
			queue.push(data.trends[i].query)
		}
		search(queue[queue.length-1]);
		
	});
	
	
}

// Search for a specified string and embeds the youtube video
function search(query) {
	var q = query;
	var request = gapi.client.youtube.search.list({
		q: q,
		part: 'snippet'
	});

	request.execute(function(response) {
		var query = queue.pop();
		var items = response.items;
		var div = document.createElement("div");
		var h2 = document.createElement("h2");
		h2.innerHTML = query;
		div.className = "videoRow";
		$(div).append(h2);
		for(var i = 0; i < items.length && i < 3; ++i) {
			div.innerHTML += '<iframe width="420" height="315" src="http://www.youtube.com/embed/'+items[i].id.videoId+'"></iframe>';
		}
		if(items.length > 0)
			$('#search-container').append(div);
		
		if(queue.length)
			search(queue[queue.length-1]);
	});
}