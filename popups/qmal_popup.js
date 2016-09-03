$(document).ready(function() {
  $("#animeNameSearch").focus();
  $(".tooltipped").tooltip({delay: 50});
});

// Grid Lists
function grid_list_init() {
  $(".grid-list-row .col img").on("mouseenter", function() {
    $(this).next().animate({
      bottom: "0px"
    }, 225, $.bez([0, 0, 0.2, 1]));
  }).on("mouseleave", function() {
    $(this).next().animate({
      bottom: "-48px"
    }, 195, $.bez([0.4, 0, 1, 1]));
  });
  $(".grid-list-row .col img").on("click", function() {
    $(".animeInformation #animeInformation_image").attr("src", $(this).attr("src"));
    $(".animeInformation #animeInformation_title").text($(this).parent().data("title"));
    $(".animeInformation #animeInformation_type").text($(this).parent().data("type"));
    $(".animeInformation #animeInformation_episodes").text($(this).parent().data("episodes"));
    $(".animeInformation #animeInformation_synopsis").text($(this).parent().data("synopsis"));
    $(".animeInformation #animeInformation_link").attr("href", $(this).parent().data("link"));
    $(".animeInformation #animeInformation_score").attr("data-tooltip", "MAL Rating: " + $(this).parent().data("score")).tooltip({delay: 50});
    console.log($(this).parent().data("score"));
    $(".animeInformation").css("position", "fixed").css("display", "block").animate({
      opacity: "1",
      height: "100%"
    }, 300);
  });
  $(".animeInformation #action-topleft").on("click", function() {
    $(".animeInformation").animate({
      opacity: "0"
    }, 300, function() {
      $(this).css("position", "static").css("display", "none");
    });
  });
}


// [+] ==================DONE TYPING===================== [+]
;(function($){
    $.fn.extend({
        donetyping: function(callback,timeout){
            timeout = timeout || 1e3; // 1 second default timeout
            var timeoutReference,
                doneTyping = function(el){
                    if (!timeoutReference) return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function(i,el){
                var $el = $(el);
                // Chrome Fix (Use keyup over keypress to detect backspace)
                // thank you @palerdot
                $el.is(':input') && $el.on('keyup keypress paste',function(e){
                    // This catches the backspace button in chrome, but also prevents
                    // the event from triggering too preemptively. Without this line,
                    // using tab/shift+tab will make the focused element fire the callback.
                    if (e.type=='keyup' && e.keyCode!=8) return;
                    
                    // Check if timeout has been set. If it has, "reset" the clock and
                    // start over again.
                    if (timeoutReference) clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function(){
                        // if we made it here, our timeout has elapsed. Fire the
                        // callback
                        doneTyping(el);
                    }, timeout);
                }).on('blur',function(){
                    // If we can, fire the event since we're leaving the field
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);






// [+] ================================================== [+]
//                         MAIN CODE
// [+] ================================================== [+]

$("#animeNameSearch").donetyping(function() {
  $("#animeNameSearch_status").text("Searching...");
  var query = $(this).val();
  $.ajax({
    url: "http://myanimelist.net/api/anime/search.xml?q=" + query,
    dataType: "xml",
    type: "GET",
    username: "FoxInFlame",
    password: "Fox_Anime_2002",
    error: function(xhr, status, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    },
    success: function(data, textStatus, jqXHR) {
      var x2js = new X2JS();
      dataJSON = x2js.xml2json(data);
      animeSearch_formatResults(dataJSON);
    },
    cache: true
  });
}, 500);


function animeSearch_formatResults(dataJSON) {
  dataAnimes = dataJSON.anime.entry;
  console.log(dataAnimes);
  var rowcount = 0;
  var html;
  // Make the results empty because we are appending on.
  $("#animeNameSearch_results").html("");
  if(Object.prototype.toString.call(dataAnimes) !== "[object Array]") {
    html = "<div class='grid-list-row'>" +
    "<div data-title='" + dataAnimes.title + "' data-type='" + dataAnimes.type + "' data-episodes='" + dataAnimes.episodes + "' data-score='" + dataAnimes.score + "' data-url='https://myanimelist.net/anime/" + dataAnimes.id + "' data-id='" + dataAnimes.id + "' data-status='" + dataAnimes.status + "' data-synopsis='" + dataAnimes.synopsis.replace(/<(?:.|\n)[^>]*?>/gm, '').replace('\"', '\\"') + "' class='col s6'>" +
      "<img src='" + dataAnimes.image + "'>" +
      "<div class='grid-list-text-footer'>" +
        "<span class='grid-list-text-footer-title'>" + dataAnimes.title + "</span>" +
      "</div>" +
    "</div>" +
    "</div>";
    $("#animeNameSearch_results").append(html);
    $("#animeNameSearch_status").text("1 Result.");
    grid_list_init();
    return;
  }
  var allcount = 0;
  dataAnimes.forEach(displayListItem);
  function displayListItem(item, index) {
    // Add to an HTML string instead of appending because Appending closes tags automatically and making two columns with that is impossible.
    allcount++;
    rowcount++;
    if((index % 2) != 1) {
      html = "<div class='grid-list-row'>";
      html += "<div data-title='" + item.title + "' data-type='" + item.type + "' data-episodes='" + item.episodes + "' data-score='" + item.score + "' data-url='https://myanimelist.net/anime/" + item.id + "' data-id='" + item.id + "' data-status='" + item.status + "' data-synopsis='" + item.synopsis.replace(/<(?:.|\n)[^>]*?>/gm, '').replace('\"', '\\"') + "' class='col s6'>" +
        "<img src='" + item.image + "'>" +
        "<div class='grid-list-text-footer'>" +
          "<span class='grid-list-text-footer-title'>" + item.title + "</span>" +
        "</div>" +
      "</div>";
    } else {
      html += "<div data-title='" + item.title + "' data-type='" + item.type + "' data-episodes='" + item.episodes + "' data-score='" + item.score + "' data-url='https://myanimelist.net/anime/" + item.id + "' data-id='" + item.id + "' data-status='" + item.status + "' data-synopsis='" + item.synopsis.replace(/<(?:.|\n)[^>]*?>/gm, '').replace('\"', '\\"') + "' class='col s6'>" +
        "<img class='waves-effect' src='" + item.image + "'>" +
        "<div class='grid-list-text-footer'>" +
          "<span class='grid-list-text-footer-title'>" + item.title + "</span>" +
        "</div>" +
      "</div>";
      html += "</div>";
      // If we use html() here instead of append() then it won't work because the rows need to pile on with the same search.
      $("#animeNameSearch_results").append(html);
      rowcount = 0;
    }
  }
  //Initiailizes the Grid List to make sure all events are on.
  $("#animeNameSearch_status").text(allcount + " Results.");
  grid_list_init();
}