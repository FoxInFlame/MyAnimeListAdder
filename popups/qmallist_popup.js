var table_display_status;

var anime_count = 0;

$(function() {
	chrome.storage.sync.get({
  	// ---- Default credentials when none are specified
    badge_count: "1"
  }, function(items) {
  	badge_count = items.badge_count;
  	if(badge_count == 1) {
    	table_display_status = "Animes Watching";
  	} else if(badge_count == 2) {
    	table_display_status = "Completed Animes";
  	} else if(badge_count == 3) {
    	table_display_status = "Animes On Hold";
  	} else if(badge_count == 4) {
    	table_display_status = "Dropped Animes";
  	} else if(badge_count == 6) {
    	table_display_status = "Animes Planned to Watch";
  	} else if(badge_count == 7) {
    	table_display_status = "Total Animes in List";
  	}
  	$.ajax({
    	url: "http://myanimelist.net/malappinfo.php?u="+loginUsername+"&status=all&type=anime",
    	type: "GET",
    	dataTpe: "xml",
    	success: function(data) {
    		$("#table_table tbody").html("");
    	  $("anime", data).each(function() {
    	  	var anime_name = $("series_title", this).text();;
    	  	var anime_episodes = $("my_watched_episodes", this).text() + "/" + $("series_episodes", this).text();
    	  	var anime_rating = $("my_score", this).text() + "/10";
    	    if($("my_status", this).text() == badge_count) {
    	    	$("#table_table tbody").append("<tr>" + 
            "<td>" + anime_name + "</td>" +
            "<td>" + anime_episodes + "</td>" +
            "<td>" + anime_rating + "</td>" +
          	"</tr>");
    	      anime_count++;
    	    }
    	  });
    	  $("h4 #table_display_status").html(table_display_status + " <small>(" + anime_count + ")</small>");
    	}
  	});
  });  
})