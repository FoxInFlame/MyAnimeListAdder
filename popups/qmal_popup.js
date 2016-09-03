$(document).ready(function() {
  $("#animeNameSearch").focus();
  $(".tooltipped").tooltip({delay: 50});
  $("select").material_select();
  $(window).keydown(function(event) {
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
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
    $(".animeInformation .animeInformation_title").text($(this).parent().data("title"));
    $(".animeInformation #animeInformation_type").text($(this).parent().data("type"));
    $(".animeInformation #animeInformation_episodes").text($(this).parent().data("episodes"));
    $(".animeInformation #animeInformation_synopsis").text($(this).parent().data("synopsis"));
    $(".animeInformation #animeInformation_link").attr("href", $(this).parent().data("url"));
    $(".animeInformation #animeInformation_score").attr("data-tooltip", "MAL Rating: " + $(this).parent().data("score")).tooltip({delay: 50});
    $(".animeInformation #generalInfo .animeInformation_title").quickfit({
      min: 1,
      max: 30,
      truncate: true,
      width: 420
    });
    console.log($(this).parent().data("score"));
    $(".animeInformation").css("position", "fixed").css("display", "block").animate({
      opacity: "1",
      height: "100%"
    }, 300);
  });
  $(".animeInformation nav .nav-wrapper #back-nav").on("click", function() {
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

// [+] Popup button at the top
$("#openWindow").on("click", function() {
   chrome.windows.create({'url': 'http://myanimelist.net/animelist/' + loginUsername, 'type': 'popup', 'height': 650, 'width':1000}, function(window) {
   });
});

$("#animeNameSearch").donetyping(function() {
  $("#animeNameSearch_status").text("Searching...");
  $(".grid-list-row .col img").css("pointer-events", "none").addClass("grayscale");
  var query = $(this).val();
  $.ajax({
    url: "http://myanimelist.net/api/anime/search.xml?q=" + query,
    dataType: "xml",
    type: "GET",
    username: loginUsername,
    password: loginPassword,
    error: function(xhr, status, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      $("#animeNameSearch_status").text(xhr.responseText + ".");
    },
    success: function(data, textStatus, jqXHR) {
      if(data === null || data === undefined) {
        // Empty return
        $("#animeNameSearch_status").text("No Results.");
        return;
      }
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
    $("#animeNameSearch_results img").css("pointer-events", "auto").removeClass("grayscale");
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
  $("#animeNameSearch_results img").css("pointer-events", "auto").removeClass("grayscale");
}

$("#animeInformation_addToList").click(function() {
  $(this).tooltip("remove");
  if($(this).attr("data-display-add") != "0") {
    $("#addAnimeContainer").fadeOut(400);
    $("#animeInformation_addBackground").fadeIn(400);
    $("#qmal_popup_mainContent").css("overflow", "auto");
    $("#animeInformation_addBackground").animate({
      top: "95px",
      height: "20px",
      opacity: "0"
    }, {duration: 300, queue: false}, $.bez([0.4, 0, 0.2, 1]));
    window.setTimeout(function() {
      $("#animeInformation_addToList").animate({
        top: "90px",
        right: "20px"
      }, {duration: 150}, $.bez([0.4, 0, 0.2, 1])).attr("data-position", "bottom").attr("data-tooltip", "Add to List").tooltip();
      $("#animeInformation_addBackground").animate({
        width: "20px",
        borderRadius: "4px",
        right: "35px"
      }, {duration: 300, queue: false}, $.bez([0.4, 0, 0.2, 1]));
      $("#animeInformation_addToList i").animate({
        borderSpacing: 0
      }, {
        duration: 150,
        queue: false,
        step: function(now, fx) {
          $(this).css("-webkit-transform", "rotate(" + now + "deg)");
        }
      });
    }, 50);
    $(this).attr("data-display-add", "0");
    return;
  }
  $("#qmal_popup_mainContent").css("width", "500px").css("height", "600px").css("overflow","hidden");
  $("#animeInformation_addBackground").animate({
    width: "100%",
    opacity: "1",
    right: "0",
    borderRadius: "0px"
  }, {duration: 250, queue: false}, $.bez([0.4, 0, 0.2, 1]));
  window.setTimeout(function() {
    $("#animeInformation_addBackground").animate({
      top: "0",
      height: "100%"
    }, {duration: 250, queue: false}, $.bez([0.4, 0, 0.2, 1]));
    $("#animeInformation_addToList").animate({
      top: "430px",
      right: "20px"
    }, {duration: 150}, $.bez([0.4, 0, 0.2, 1])).attr("data-position", "top").attr("data-tooltip", "Cancel").tooltip().attr("data-display-add", "1");
    $("#animeInformation_addToList i").animate({
      borderSpacing: -135
    }, {
      duration: 150,
      queue: false,
      step: function(now, fx) {
        $(this).css("-webkit-transform", "rotate(" + now + "deg)");
      }
    }, $.bez([0.4, 0, 0.2, 1]));
  }, 50);
  window.setTimeout(function() {
    $("#addAnimeContainer").fadeIn(400, function() {
      $("#animeInformation_addBackground").fadeOut(400);
    });
  }, 250);
});