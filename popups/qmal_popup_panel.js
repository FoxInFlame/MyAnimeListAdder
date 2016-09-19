// [+] =================DOCUMENT READY=================== [+]
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
  chrome.storage.sync.get({
  // ---- Default credentials when none are specified
    username: "Username",
    password: "password123",
    verified: false,
    popup_action_open: 1,
    popup_input_rating: true,
    popup_input_rewatching: true,
    popup_input_tags: true,
    popup_input_storageType: false,
    popup_action_confirm: true,
    popup_theme: 2
  }, function(items) {
    loginUsername = items.username;
    loginPassword = items.password;
    verified = items.verified;
    popup_action_open = items.popup_action_open;
    popup_input_rating = items.popup_input_rating;
    popup_input_rewatching = items.popup_input_rewatching;
    popup_input_tags = items.popup_input_tags;
    popup_input_storageType = items.popup_input_storageType;
    popup_action_confirm = items.popup_action_confirm;
    popup_theme = items.popup_theme;
  });
});

// [+] ===================GRID LISTS===================== [+]
function grid_list_init() {
  var scrollTop; // Store scroll position
  var scrollLeft; // These are used in the "back" action
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
    scrollTop = document.body.scrollTop;
    scrollLeft = document.body.scrollLeft;
    window.scrollTo(0, 0); // NEW! Scroll to top. http://stackoverflow.com/questions/1144805/scroll-to-the-top-of-the-page-using-javascript-jquery
    $(".animeInformation-edit-preloader-wrapper")[0].style.setProperty("display", "block", "important");
    $("#overall-progress-bar").css("width", "33.33%");
    $(".animeInformation #animeInformation_image").attr("src", $(this).attr("src"));
    $(".animeInformation .animeInformation_id").text($(this).parent().data("id"));
    $(".animeInformation .animeInformation_title").text($(this).parent().data("title"));
    $(".animeInformation #animeInformation_type").text($(this).parent().data("type"));
    $(".animeInformation .animeInformation_episodes").text($(this).parent().data("episodes"));
    $(".animeInformation #animeInformation_synopsis").text($(this).parent().data("synopsis"));
    $(".animeInformation #animeInformation_link").attr("href", $(this).parent().data("url"));
    $(".animeInformation .animeInformation_score").text($(this).parent().data("score"));
    $("#animeEditForm-episodes").attr("max", $(this).parent().data("episodes"));
    checkIfInAnimeList($(this).parent().data("id"));
    $(".rateYo-rating").rateYo({
      normalFill: "#e0e0e0",
      starWidth: "25px",
      numStars: 5,
      multiColor: {
        "startColor": "#A22E51",
        "endColor": "#51A22E"
      },
      halfStar: true,
      maxValue: 10
    });
    $(".animeInformation #generalInfo .animeInformation_title").quickfit({
      min: 1,
      max: 30,
      truncate: true,
      width: 420
    });
    $(".animeInformation").css("position", "absolute").css("display", "block").animate({
      opacity: "1",
      height: $(document).height()
    }, 300);
  });
  $(".animeInformation nav .nav-wrapper #back-nav").on("click", function() {
    window.scrollTo(scrollLeft, scrollTop);
    $("#overall-progress-bar").css("width", "0%");
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

// [+] =================UPDATE ANIME===================== [+]
function updateAnimeInList(id, episode, status, score, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags) {
  var errorStatus = 0;
  
  if(score == "0") {
    score = "";
  }
  if(storage_type == "0"){
    storage_type = "";
  }
  if(rewatch_value == "0") {
    rewatch_value = "";
  }
  if(date_start == null) {
    date_start = "";
  }
  if(date_finish == null) {
    date_finish = "";
  }
  if(priority == "0") {
    priority = "";
  }
  if(enable_discussion){
    if(enable_discussion == "0") {
      enable_discussion = "";
    } else if(enable_discussion == "1") {
      enable_discussion = "0";
    } else if(enable_discussion == "2") {
      enable_discussion = "1";
    }
  }
  
  var myXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + episode + "</episode>" +
  "<status>" + status + "</status>" +
  "<score>" + score + "</score>" +
  "<storage_type>" + storage_type + "</storage_type>" +
  "<storage_value>" + storage_value + "</storage_value>" +
  "<times_rewatched>" + times_rewatched + "</times_rewatched>" +
  "<rewatch_value>" + rewatch_value + "</rewatch_value>" +
  "<date_start>" + date_start + "</date_start>" +
  "<date_finish>" + date_finish + "</date_finish>" +
  "<priority>" + priority + "</priority>" +
  "<enable_discussion>" + enable_discussion + "</enable_discussion>" +
  "<enable_rewatching>" + enable_rewatching + "</enable_rewatching>" +
  "<tags>" + tags + "</tags>" +
  "</entry>";
  
  console.log("[UPDATE] Updating Anime " + id + " as status: " + status + " to list....");
  console.log("[UPDATE] Watched Episodes: " + episode);
  
  $.ajax({
    url: "https://myanimelist.net/api/animelist/update/" + id + ".xml",
    type: "GET",
    data: {"data": myXML},
    username: loginUsername,
    password: loginPassword,
    contentType: "application/xml",
    async: false,
    success: function(ajaxData) {
      console.log("[DONE] Anime ID " + id + " has been updated on " + loginUsername + "'s list!");
      console.log("[DONE] Details: Episodes - " + episode);
      console.log("[DONE] Details: Score - " + score);
    },
    error: function(xhr, status, thrownError) {
      errorStatus = xhr.responseText;
      console.log(xhr.status);
      console.error(xhr.responseText + " @ addAnimeInList()");
    }
  });
  return errorStatus;
}

// [+] ==================ADD ANIME======================= [+]
function addAnimeInList(id, episode, status, score, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags) {
  var errorStatus = 0;
  
  if(score == "0") {
    score = "";
  }
  if(storage_type == "0"){
    storage_type = "";
  }
  if(rewatch_value == "0") {
    rewatch_value = "";
  }
  if(date_start == null) {
    date_start = "";
  }
  if(date_finish == null) {
    date_finish = "";
  }
  if(priority == "0") {
    priority = "";
  }
  if(enable_discussion){
    if(enable_discussion == "0") {
      enable_discussion = "";
    } else if(enable_discussion == "1") {
      enable_discussion = "0";
    } else if(enable_discussion == "2") {
      enable_discussion = "1";
    }
  }
  
  var myXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + episode + "</episode>" +
  "<status>" + status + "</status>" +
  "<score>" + score + "</score>" +
  "<storage_type>" + storage_type + "</storage_type>" +
  "<storage_value>" + storage_value + "</storage_value>" +
  "<times_rewatched>" + times_rewatched + "</times_rewatched>" +
  "<rewatch_value>" + rewatch_value + "</rewatch_value>" +
  "<date_start>" + date_start + "</date_start>" +
  "<date_finish>" + date_finish + "</date_finish>" +
  "<priority>" + priority + "</priority>" +
  "<enable_discussion>" + enable_discussion + "</enable_discussion>" +
  "<enable_rewatching>" + enable_rewatching + "</enable_rewatching>" +
  "<tags>" + tags + "</tags>" +
  "</entry>";
  
  console.log("[ADD] Adding Anime " + id + " as status: " + status + " to list.");
  console.log("[ADD] Watched Episodes: " + episode);
  
  $.ajax({
    url: "https://myanimelist.net/api/animelist/add/" + id + ".xml",
    type: "GET",
    data: {"data": myXML},
    username: loginUsername,
    password: loginPassword,
    contentType: "application/xml",
    async: false,
    success: function(ajaxData) {
      console.log("Anime ID " + id + " has been added to " + loginUsername + "'s list!");
    },
    error: function(xhr, status, thrownError) {
      errorStatus = xhr.responseText;
      console.log(xhr.status);
      if(xhr.status == "501") {
        console.log("The Anime is already in the list. Use updateAnimeInList() instead.");
      }
      console.error(xhr.responseText + " @ addAnimeInList()");
    }
  });
  return errorStatus;
};

// [+] =================DELETE ANIME===================== [+]
function deleteAnimeInList(id) {
  // This function will delete without any confirmation. Be aware.
  var errorStatus = 0;
  $.ajax({
    url: "https://myanimelist.net/api/animelist/delete/" + id + ".xml",
    type: "GET",
    username: loginUsername,
    password: loginPassword,
    success: function(ajaxData) {
      console.log("Anime ID " + id + " has been deleted!");
    },
    error: function(xhr, status, thrownError) {
      errorStatus = xhr.responseText;
      console.log(xhr.status);
      console.log(xhr.responseText + "@ deleteAnimeInList()");
    }
  });
  return errorStatus;
};

// [+] =============MONTH STRING TO NUMBER=============== [+]
String.prototype.getMonthFromString = function() {
  var d = Date.parse(this + "1, 2016");
  //Set up a new Date() with Month
  if(!isNaN(d)) {
    return (new Date(d).getMonth() + 1).toString();
  }
  console.error("String is not a valid Month name.");
  return undefined;
}

// [+] ==================CHANGE DATE===================== [+]
String.prototype.changeDatetoMALFormat = function() {
  if(this == "") {
    return;
  }
  dateString_array = this.split("/");
  if(parseInt(dateString_array[1]) > 12) {
    dateString_array[1] = parseInt(dateString_array[1]) % 12;
  }
  date = new Date(dateString_array[0], dateString_array[1], dateString_array[2]);
  if(date.isDateValid === false) {
    console.error("Date is not valid @ String.prototype.changeDatetoMALFormat");
    return;
  } else {
    return ("0" + date.getMonth().toString()).slice(-2) + ("0" + date.getDate()).slice(-2) + date.getFullYear();
  }
}

// [+] ==================REPLACE ALL===================== [+]
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// [+] ============CHECK IF ANIME IS IN LIST============= [+]
var formAnimeStatus;
function checkIfInAnimeList(animeID) {
  $.ajax({
    url: "https://myanimelist.net/malappinfo.php?u="+loginUsername+"&status=all&type=anime",
    type: "GET",
    dataTpe: "xml",
    success: function(data) {
      $("anime", data).each(function(){
        var watchedEpisodes;
        var totalEpisodes;
        if($("series_animedb_id", this).text() == animeID) {
          //It's in the list! And it's in this "each" module
          formAnimeStatus = "Update";
          var my_status = $("my_status", this).text();
          if(my_status == "1") {
            //Watching
            $("#animeInformation_addToList").attr("data-tooltip", "Currently Watching");
          } else if (my_status == "2") {
            //Completed
            $("#animeInformation_addToList").attr("data-tooltip", "Completed");
          } else if (my_status == "3") {
            //On Hold
            $("#animeInformation_addToList").attr("data-tooltip", "Currently On Hold");
          } else if (my_status == "4") {
            //Dropped
            $("#animeInformation_addToList").attr("data-tooltip", "Dropped");
          } else if (my_status == "6") {
            //Plan to watch
            $("#animeInformation_addToList").attr("data-tooltip", "Planned to Watch");
          }
          $("#animeInformation_addToList").tooltip({delay: 50});
          var my_episodes = $("my_watched_episodes", this).text();
          var my_rating = $("my_score", this).text();
          var my_startDate = $("my_start_date", this).text();
          var my_finishDate = $("my_finish_date", this).text();
          var my_tags = $("my_tags", this).text();
          $("#animeEditForm-status").val(my_status).material_select();
          $("#animeEditForm-episodes").val(my_episodes);
          $("#animeEditForm-rating").rateYo("option", "rating", my_rating);
          $(".animeInformation #animeInformation_myScore").attr("data-tooltip", "My Score: " + my_rating).tooltip({delay:50});
          if(my_startDate == "0000-00-00") {
            $("#animeEditForm-startDate").val("");
          } else {
            $("#animeEditForm-startDate").val(my_startDate.replaceAll("-", "/"));
          }
          if(my_finishDate == "0000-00-00") {
            $("#animeEditForm-finishDate").val("");
          } else {
            $("#animeEditForm-finishDate").val(my_finishDate.replaceAll("-", "/"));
          }
          tagListArray = my_tags.split(",");
          var data = new Object({data:[]});
          var index;
          for(index = 0; index < tagListArray.length; index++) {
            data.data.push({
              tag: tagListArray[index]
            });
          };
          data.placeholder = "+ Tags";
          data.secondaryPlaceholder = "Enter tags. Now.";
          tags = data;
          console.log(data);
          $("#animeInformation_addToList").html("<i class=\"material-icons\">edit</i>").removeClass("red").addClass("yellow");
          $("#animeEditForm nav .nav-wrapper span i").text("edit");
          $(".animeInformation #animeInformation_myScore").show();
          $(".animeInformation #animeInformation_deleteFromList").show();
          $(".animeInformation-edit-preloader-wrapper")[0].style.setProperty("display", "none", "important");
          return false;
        } else {
          //It could be in the list, but not in this particular "each"
          formAnimeStatus = "Add";
          $("#animeEditForm-tags div.chip").remove();
          tags = {
            data: [],
            placeholder: "+ Tags",
            secondaryPlaceholder: "Enter tags. Now."
          };
          $("#animeInformation_addToList").html("<i class=\"material-icons\">add</i>").removeClass("yellow").addClass("red");
          $("#animeEditForm-status").val("1").material_select();
          $("#animeEditForm-episodes").val("");
          $("#animeEditForm-startDate").val(""); // Changed from html() to val()
          $("#animeEditForm-finishDate").val("");
          $("#animeInformation_addToList").attr("data-tooltip", "Add to List").tooltip({delay:50});
          $("#animeEditForm-rating").rateYo("option", "rating", 0);
          $("#animeEditForm nav .nav-wrapper span i").text("add");
          $(".animeInformation #animeInformation_myScore").hide();
          $(".animeInformation #animeInformation_deleteFromList").hide();
          $(".animeInformation-edit-preloader-wrapper")[0].style.setProperty("display", "none", "important");
        }
      });
    }
  });
};

// [+] ==================IS DATE VALID=================== [+]
Date.prototype.isDateValid = function() {
  if (Object.prototype.toString.call(this) === "[object Date]") {
    // it is a date
    if (isNaN(this.getTime())) {  // d.valueOf() could also work
      // date is not valid
      return false;
    } else {
      // date is valid
      return true;
    }
  } else {
    // not a date
    return false;
  }
}








// [+] ================================================== [+]
//
//                         MAIN CODE
//
// [+] ================================================== [+]

// [+] Popup button at the top
$("#openWindow").on("click", function() {
   chrome.windows.create({'url': 'https://myanimelist.net/animelist/' + loginUsername, 'type': 'popup', 'height': 650, 'width':1000}, function(window) {
   });
});

// [+] Done Typing -> Render Results
$("#animeNameSearch").donetyping(function() {
  $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "block", "important");
  $("#animeNameSearch_status").text("Searching...");
  $(".grid-list-row .col img").css("pointer-events", "none").addClass("grayscale");
  var query = $(this).val();
   $.ajax({
    url: "https://myanimelist.net/api/anime/search.xml?q=" + query,
    dataType: "xml",
    type: "GET",
    username: loginUsername,
    password: loginPassword,
    error: function(xhr, status, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "none", "important");
      $("#animeNameSearch_status").text(xhr.responseText + ".");
    },
    success: function(data, textStatus, jqXHR) {
      if(data === null || data === undefined) {
        // Empty return
        $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "none", "important");
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

// [+] Done Typing -> Render Results
function animeSearch_formatResults(dataJSON) {
  dataAnimes = dataJSON.anime.entry;
  console.log(dataAnimes);
  var rowcount = 0;
  var html;
  // Make the results empty because we are appending on.
  $("#animeNameSearch_results").html("");
  
  // Only one result?
  if(Object.prototype.toString.call(dataAnimes) !== "[object Array]") {
    html = "<div class='grid-list-row'>" +
    "<div data-title='" + dataAnimes.title + "' data-type='" + dataAnimes.type + "' data-episodes='" + dataAnimes.episodes + "' data-score='" + dataAnimes.score + "' data-url='https://myanimelist.net/anime/" + dataAnimes.id + "' data-id='" + dataAnimes.id + "' data-status='" + dataAnimes.status + "' data-synopsis='" + dataAnimes.synopsis.replaceAll(/<(?:.|\n)[^>]*?>/gm, "").replace(/\"/g,'&#34;').replace(/'/g,"&#39;") + "' class='col s6'>" +
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
    $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "none", "important");
    return;
  }
  
  // Many results!
  var allcount = 0;
  dataAnimes.forEach(displayListItem);
  function displayListItem(item, index) {
    // Add to an HTML string instead of appending because Appending closes tags automatically and making two columns with that is impossible.
    allcount++;
    rowcount++;
    if((index % 2) != 1) {
      html = "<div class='grid-list-row'>";
      html += "<div data-title='" + item.title + "' data-type='" + item.type + "' data-episodes='" + item.episodes + "' data-score='" + item.score + "' data-url='https://myanimelist.net/anime/" + item.id + "' data-id='" + item.id + "' data-status='" + item.status + "' data-synopsis='" + item.synopsis.replaceAll(/<(?:.|\n)[^>]*?>/gm, "").replace(/\"/g,'&#34;').replace(/'/g,"&#39;") + "' class='col s6'>" +
        "<img src='" + item.image + "'>" +
        "<div class='grid-list-text-footer'>" +
          "<span class='grid-list-text-footer-title'>" + item.title + "</span>" +
        "</div>" +
      "</div>";
    } else {
      html += "<div data-title='" + item.title + "' data-type='" + item.type + "' data-episodes='" + item.episodes + "' data-score='" + item.score + "' data-url='https://myanimelist.net/anime/" + item.id + "' data-id='" + item.id + "' data-status='" + item.status + "' data-synopsis='" + item.synopsis.replaceAll(/<(?:.|\n)[^>]*?>/gm, "").replace(/\"/g,'&#34;').replace(/'/g,"&#39;") + "' class='col s6'>" +
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
    $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "none", "important");
  }
  //Initiailizes the Grid List to make sure all events are on.
  $("#animeNameSearch_status").text(allcount + " Results.");
  grid_list_init();
  $("#animeNameSearch_results img").css("pointer-events", "auto").removeClass("grayscale");
}

// [+] Delete Anime Button -> Ask for Confirmation -> Delete
$(".animeInformation #animeInformation_deleteFromList").on("click", function() {
  $("#modal_delete_confirmation").openModal({
    dismissible: false,
    opacity: 0.4
  });
});
$("#modal_delete_confirmation_yes").on("click", function() {
    if(deleteAnimeInList($(".animeInformation .animeInformation_id").text()) !== 0) {
      // Returns 0 if no error
      // Returns a string with information if error
      Materialize.toast(response, 4000);
      return;
    } else {
      Materialize.toast("Deleted anime " + $(".animeInformation .animeInformation_id").text() + " from list.", 4000);
      $("#modal_delete_confirmation").closeModal();
      formAnimeStatus = "Add";
      $("#animeInformation_addToList").html("<i class=\"material-icons\">add</i>").removeClass("yellow").addClass("red");
      $("#animeEditForm-status").val("").material_select();
      $("#animeEditForm-episodes").val("");
      $("#animeInformation_addToList").attr("data-tooltip", "Add to List").tooltip({delay:50});
      $("#animeEditForm-rating").rateYo("option", "rating", 0);
      $("#animeEditForm-tags .chips").remove();
      $("#animeEditForm nav .nav-wrapper span i").text("add");
      $(".animeInformation #animeInformation_myScore").hide();
      $(".animeInformation #animeInformation_deleteFromList").hide();
      $(".animeInformation-edit-preloader-wrapper")[0].style.setProperty("display", "none", "important");
      $("#animeEditForm-fieldset2").animate({
        marginTop: "550px"
      }, 300, function() {
        $("#animeEditForm-fieldset1").animate({
          marginTop: "50px"
        });
      });
    }
  });
  
// [+] Add to List Button Click
$("#animeInformation_addToList").click(function() {
  $(this).tooltip("remove");
  $("#animeEditForm-tags").material_chip({
    data: tags.data,
    placeholder: tags.placeholder,
    secondaryPlaceholder: tags.secondaryPlaceholder
  });
  if($(this).attr("data-display-add") != "0") {
    $("#animeEditForm-fieldset2").animate({
      marginTop: "550px"
    }, 300, function() {
      $("#animeEditForm-fieldset1").animate({
        marginTop: "50px"
      });
    });
    $("#overall-progress-bar").css("width", "33.33%");
    $("#addAnimeContainer").fadeOut(400);
    $("#animeInformation_addBackground").fadeIn(400);
    $("#qmal_popup_mainContent").css("overflow", "auto");
    $(".animeInformation #animeInformation_addToList").css("top", "400px").css("position", "absolute");
    $("#animeInformation_addBackground").animate({
      top: "95px",
      right: "35px",
      width: "20px",
      borderRadius: "4px",
      height: "20px",
      opacity: "0"
    }, {duration: 300, queue: false}, $.bez([0.4, 0, 0.2, 1]));
    window.setTimeout(function() {
      $("#animeInformation_addToList").animate({
        top: "90px",
        right: "20px"
      }, {duration: 150}, $.bez([0.4, 0, 0.2, 1])).attr("data-position", "bottom").attr("data-tooltip", "Add to List").tooltip();
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
  $("#overall-progress-bar").css("width", "66.66%");
  $("#qmal_popup_mainContent").css("width", "500px").css("height", "600px");
  $("#animeEditForm").css("position","fixed").css("width", "100%");
  $(".animeInformation #animeInformation_addToList").css("top", "170px").css("position", "fixed"); // 80 header + 70 original absoulte height
  $("#animeInformation_addBackground .preloader-wrapper").show();
  $("#animeInformation_addBackground").animate({
    width: "100%",
    height: "100%",
    top: "-80px",
    opacity: "1",
    right: "0px",
    borderRadius: "0px"
  }, {duration: 250, queue: false}, $.bez([0.4, 0, 0.2, 1]));
  window.setTimeout(function() {
    $("#animeInformation_addToList").animate({
      top: "480px",
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
      $("#animeInformation_addBackground .preloader-wrapper").hide();
    });
  }, 250);
});

// [+] Episode Count Number / Disable depending on Status
$("#animeEditForm-status").on("change", function() {
  var chosenStatus = $(this).val();
  if(chosenStatus == "1") {
    // Watching
    $("#animeEditForm-episodes").removeAttr("disabled");
  } else if(chosenStatus == "2") {
    // Completed
    $("#animeEditForm-episodes").removeAttr("disabled");
    $("#animeEditForm-episodes").val($("#animeEditForm-episodes").attr("max"));
  } else if(chosenStatus == "3") {
    // On Hold
    $("#animeEditForm-episodes").removeAttr("disabled");
  } else if(chosenStatus == "4") {
    // Dropped
    $("#animeEditForm-episodes").removeAttr("disabled");
  } else if(chosenStatus == "6") {
    // Plan to Watch
    $("#animeEditForm-episodes").val("0");
    $("#animeEditForm-episodes").attr("disabled", "disabled");
  }
})

// [+] Stage 1 -> Next
$("#animeEditForm-fieldset1-next").click(function() {
  $("#overall-progress-bar").css("width", "100%");
  if((parseInt($("#animeEditForm-episodes").val()) > parseInt($("#animeEditForm-episodes").attr("max")) || parseInt($("#animeEditForm-episodes").val()) < 0 ) && parseInt($("#animeEditForm-episodes").attr("max")) != 0) {
    $("#animeEditForm-fieldset1-next").attr("disabled", "dsiabled").text("Incorrect Episode Count!");
    $("#overall-progress-bar").css("width", "66.66%");
    window.setTimeout(function() {
      $("#animeEditForm-fieldset1-next").removeAttr("disabled").text("Next");
    }, 3000)
    return;
  }
  $("#animeEditForm-fieldset1").animate({
    marginTop: "-550px"
  }, 300, function() {
    $("#animeEditForm-fieldset2").animate({
      marginTop: "300px"
    });
  });
});

// [+] Stage 2 -> Previous
$("#animeEditForm-fieldset2-previous").click(function() {
  $("#overall-progress-bar").css("width", "66.66%");
  $("#animeEditForm-fieldset2").animate({
    marginTop: "550px"
  }, 300, function() {
    $("#animeEditForm-fieldset1").animate({
      marginTop: "50px"
    });
  });
});

// [+] Stage 2 -> Next -> Proccess and Submit
$("#animeEditForm-fieldset2-next").click(function() {
  var id;
  var episodesWatched;
  var status;
  var rating;
  var storage_type;
  var storage_value;
  var times_rewatched;
  var rewatch_value;
  var date_start;
  var date_finish;
  var priority;
  var enable_discussion;
  var enable_rewatching;
  var tags;
  
  id = $(".animeInformation .animeInformation_id").text();
  episodesWatched = $("#animeEditForm-episodes").val();
  status = $("#animeEditForm-status").val();
  rating = $("#animeEditForm-rating").rateYo("option", "rating");
  storage_type = "";
  storage_value = "";
  times_rewatched = "";
  rewatch_value = "";
  date_start = $("#animeEditForm-startDate").val().changeDatetoMALFormat();
  console.log(date_start);
  date_finish = $("#animeEditForm-finishDate").val().changeDatetoMALFormat();
  priority = "";
  enable_discussion = "";
  enable_rewatching = "";
  var tags_array = [];
  tags_materialChips = $("#animeEditForm-tags").material_chip("data");
  var x = 0;
  while(tags_materialChips.length > x) {
    tags_array.push(tags_materialChips[x].tag);
    x++;
  }
  tags = tags_array.join(", ");
  
  var response;
  if(formAnimeStatus == "Update") {
    response = updateAnimeInList(id, episodesWatched, status, rating, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags);
  } else {
    response = addAnimeInList(id, episodesWatched, status, rating, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags);
  }
  if(response !== 0) {
    // Returns 0 if no error
    // Returns a string with information if error
    Materialize.toast(response, 4000);
    return;
  } else {
    if(formAnimeStatus == "Update") {
      Materialize.toast("Updated anime " + id + " in list.", 4000);
    } else {
      Materialize.toast("Added anime " + id + " to list.", 4000);
    }
  }
  
  
  $("#animeInformation_addToList").html("<i class=\"material-icons\">edit</i>").removeClass("red").addClass("yellow");
  $("#animeEditForm nav .nav-wrapper span i").text("edit");
  $(".animeInformation #animeInformation_myScore").show();
  $(".animeInformation #animeInformation_deleteFromList").show();
  $(".animeInformation #animeInformation_myScore").attr("data-tooltip", "My Score: " + rating).tooltip({delay:50});
  formAnimeStatus = "Update";
  $("#animeEditForm-fieldset2").animate({
    marginTop: "550px"
  }, 300, function() {
    $("#animeEditForm-fieldset1").animate({
      marginTop: "50px"
    })
  });
  
  // Fade out container
  $("#overall-progress-bar").css("width", "33.33%");
  $("#addAnimeContainer").fadeOut(400);
  $("#animeInformation_addBackground").fadeIn(400);
  $("#qmal_popup_mainContent").css("overflow", "auto");
  $(".animeInformation #animeInformation_addToList").css("top", "400px").css("position", "absolute");
  $("#animeInformation_addBackground").animate({
    top: "95px",
    height: "20px",
    opacity: "0"
  }, {duration: 300, queue: false}, $.bez([0.4, 0, 0.2, 1]));
  window.setTimeout(function() {
    $("#animeInformation_addToList").animate({
      top: "90px",
      right: "20px"
    }, {duration: 150}, $.bez([0.4, 0, 0.2, 1])).attr("data-position", "bottom");
    if(status == "1") {
      //Watching
      $("#animeInformation_addToList").attr("data-tooltip", "Currently Watching");
    } else if (status == "2") {
      //Completed
      $("#animeInformation_addToList").attr("data-tooltip", "Completed");
    } else if (status == "3") {
      //On Hold
      $("#animeInformation_addToList").attr("data-tooltip", "Currently On Hold");
    } else if (status == "4") {
      //Dropped
      $("#animeInformation_addToList").attr("data-tooltip", "Dropped");
    } else if (status == "6") {
      //Plan to watch
      $("#animeInformation_addToList").attr("data-tooltip", "Planned to Watch");
    }
    $("#animeInformation_addToList").tooltip({delay: 50});
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
  $("#animeInformation_addToList").attr("data-display-add", "0");
});