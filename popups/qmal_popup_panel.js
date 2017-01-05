var currentStatus = "none";
var showOneOnly = false;

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
  
  chrome.runtime.sendMessage({
    subject: "panelInitialized",
  }, function(response) {
    if(response.id) {
      // ID is set! Show only this anime.
      showOneOnly = true;
      renderShowOneOnly(response.id, response.title);
    }
  });
  
  chrome.storage.sync.get({
  // ---- Default credentials when none are specified
    username: "Username",
    password: "password123",
    verified: false,
    popup_action_open: 1,
    popup_action_confirm: true,
    popup_theme: 2,
    popup_mcss_options: {
      dynamic_colors: true,
      show_details: false
    }
  }, function(items) {
    loginUsername = items.username;
    loginPassword = items.password;
    verified = items.verified;
    popup_action_open = items.popup_action_open;
    popup_action_confirm = items.popup_action_confirm;
    popup_theme = items.popup_theme;
    popup_mcss_options = items.popup_mcss_options;
  });
});

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function renderShowOneOnly(id, title) {
  $(".animeInformation").show().css("opacity", "1");
  $(".animeInformation > nav").hide();
  
  $.ajax({
    url: "http://www.matomari.tk/api/0.3/anime/info/" + id + ".json?timestamp=" + new Date(),
    dataType: "json",
    type: "GET",
    username: loginUsername,
    password: loginPassword,
    error: function(xhr, status, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      $(".animeInformation #generalInfo .animeInformation-title").text(xhr.responseText + ".");
    },
    success: function(data, textStatus, jqXHR) {
      if(data === null || data === undefined || data.error == "Anime with specified id was not found.") {
        // Empty return
        $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "none", "important");
        $(".animeInformation #generalInfo .animeInformation-title").text("Not Found.");
        return;
      }
      showOnlyOne_formatResult(data);
    },
    cache: false
  });
}

function showOnlyOne_formatResult(data) {
  $(".animeInformation #animeInformation_image").attr("src", data.image_url);
  $(".animeInformation .animeInformation_id").text(data.id);
  $(".animeInformation .animeInformation_title").text(data.title);
  $(".animeInformation #animeInformation_type").text(data.type);
  if(data.episodes === null) {
    $(".animeInformation .animeInformation_episodes").text("N/A");
  } else {
     $(".animeInformation .animeInformation_episodes").text(data.episodes);
  }
  $(".animeInformation #animeInformation_synopsis").text(data.synopsis);
  $(".animeInformation #animeInformation_link").attr("href", "https://myanimelist.net/anime/" + data.id);
  if(data.members_score === null) {
    $(".animeInformation .animeInformation_score").text("N/A");
  } else {
    $(".animeInformation .animeInformation_score").text(data.members_score);
  }
  $("#animeEditForm-episodes").attr("max", data.episodes);
  checkIfInAnimeList(data.id);
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
    width: 380
  });
}

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
    $(".animeInformation #animeInformation_addToList").css("background", "#2e51a2");
    $(".moreinfo .moreinfo_label_content").html("Loading...");
    $(".animeInformation #animeInformation_addToList .material-icons").text("hourglass_empty");
    scrollTop = document.body.scrollTop;
    scrollLeft = document.body.scrollLeft;
    window.scrollTo(0, 0); // Scroll to top. http://stackoverflow.com/questions/1144805/scroll-to-the-top-of-the-page-using-javascript-jquery
    $("#mainForm_tmp #animeNameSearch_results").hide();
    $("#qmal_popup_mainContent").css("width", "500px").css("height", "600px");
    $(".animeInformation-edit-preloader-wrapper")[0].style.setProperty("display", "block", "important");
    var selected_imageSource = $(this).attr("src"),
        selected_id = $(this).parent().attr("data-id"),
        selected_title = $(this).parent().attr("data-title"),
        selected_type = $(this).parent().attr("data-type"),
        selected_episodes = $(this).parent().attr("data-episodes"),
        selected_synopsis = $(this).parent().attr("data-synopsis"),
        selected_url = $(this).parent().attr("data-url"),
        selected_score = $(this).parent().attr("data-score");
        selected_color_dominant = $(this).parent().attr("data-color-dominant").split(",");
        selected_color_dominant_hex = rgbToHex(parseInt(selected_color_dominant[0]), parseInt(selected_color_dominant[1]), parseInt(selected_color_dominant[2]));
        selected_color_palette1 = $(this).parent().attr("data-color-palette1").split(",");
        selected_color_palette1_hex = rgbToHex(parseInt(selected_color_palette1[0]), parseInt(selected_color_palette1[1]), parseInt(selected_color_palette1[2]));
        selected_color_palette2 = $(this).parent().attr("data-color-palette2").split(",");
        selected_color_palette2_hex = rgbToHex(parseInt(selected_color_palette2[0]), parseInt(selected_color_palette2[1]), parseInt(selected_color_palette2[2]));
        selected_color_palette3 = $(this).parent().attr("data-color-palette3").split(",");
        selected_color_palette3_hex = rgbToHex(parseInt(selected_color_palette3[0]), parseInt(selected_color_palette3[1]), parseInt(selected_color_palette3[2]));
        selected_color_palette4 = $(this).parent().attr("data-color-palette4").split(",");
        selected_color_palette4_hex = rgbToHex(parseInt(selected_color_palette4[0]), parseInt(selected_color_palette4[1]), parseInt(selected_color_palette4[2]));
    $("html").css("background", selected_color_dominant_hex);
    $(".animeInformation #animeInformation_image").attr("src", selected_imageSource);
    $(".animeInformation .animeInformation_id").text(selected_id);
    $(".animeInformation .animeInformation_title").text(selected_title);
    $(".animeInformation #animeInformation_type").text(selected_type);
    if(selected_episodes == "0") {
      $(".animeInformation .animeInformation_episodes").text("N/A");
    } else {
      $(".animeInformation .animeInformation_episodes").text(selected_episodes);
    }
    if(selected_score == "0.00") {
      $(".animeInformation .animeInformation_score").text("N/A");
    } else {
      $(".animeInformation .animeInformation_score").text(selected_score);
    }
    $("#animeEditForm-episodes").attr("max", selected_episodes);
    $(".animeInformation #animeInformation_synopsis").text(selected_synopsis);
    $(".animeInformation #animeInformation_link").attr("href", selected_url);
    checkIfInAnimeList(selected_id);
    $(".rateYo-rating").rateYo({
      normalFill: "#e0e0e0",
      starWidth: "25px",
      numStars: 5,
      multiColor: {
        "startColor": "#a22e51", // Variations from #2e51a2 tri-color palette
        "endColor": "#51a22e"
      },
      halfStar: true,
      maxValue: 10
    });
    $(".animeInformation #generalInfo .animeInformation_title").quickfit({
      min: 1,
      max: 30,
      truncate: true,
      width: 380
    });
    $(".animeInformation").css("position", "absolute").css("display", "block").animate({
      opacity: "1",
      height: $(document).height() - 50 // 50px for the nav bar
    }, 300);
  });
  $(".animeInformation nav .nav-wrapper #back-nav").on("click", function() {
    $("html").css("background", "#ffffff");
    $("#mainForm_tmp #animeNameSearch_results").show();
    window.scrollTo(scrollLeft, scrollTop);
    $("#qmal_popup_mainContent").css("width", "500px").css("height", "600px");
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
  date = new Date(dateString_array[0], (dateString_array[1] - 1), dateString_array[2]);
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

// [+] ===========REMOVE DUPLICATE IN ARRAY============== [+]
Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j]) {
        a.splice(j--, 1);
        Materialize.toast("You already have the tag '" + a[i] + "'!", 1500);
      }
    }
  }
  return a;
};


// [+] ============CHECK IF ANIME IS IN LIST============= [+]
var formAnimeStatus;
function checkIfInAnimeList(animeID) {
  if(popup_mcss_options.show_details === true) {
    $.ajax({
      url: "http://www.matomari.tk/api/0.4/methods/anime.info.ID.php?id=" + animeID,
      method: "GET",
      dataType: "json",
      error: function(jqXHR, textStatus) {
        $(".moreinfo_label_content").html("N/A : " + jqXHR.status);
      },
      success: function(data) {
        $(".moreinfo .duration").html(data.duration.toString() + " minutes");
        $(".moreinfo .source").html(data.source);
        $(".moreinfo .genres").html(data.genres.join(", "));
        $(".moreinfo .rank").html("#" + data.rank.toString());
        $(".moreinfo .popularity").html("#" + data.popularity.toString());
        $(".moreinfo .members").html(data.members_count.toString());
      }
    });
  } else {
    $(".moreinfo").hide();
  }
  $.ajax({
    url: "https://myanimelist.net/malappinfo.php?u="+loginUsername+"&status=all&type=anime",
    type: "GET",
    dataTpe: "xml",
    async: true,
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
            $("#animeInformation_addToList").attr("data-tooltip", "Watching: Ep " + $("my_watched_episodes", this).text());
            currentStatus = "watching";
          } else if (my_status == "2") {
            //Completed
            $("#animeInformation_addToList").attr("data-tooltip", "Completed");
            currentStatus = "completed";
          } else if (my_status == "3") {
            //On Hold
            $("#animeInformation_addToList").attr("data-tooltip", "On Hold");
            currentStatus = "onhold";
          } else if (my_status == "4") {
            //Dropped
            $("#animeInformation_addToList").attr("data-tooltip", "Dropped");
            currentStatus = "dropped";
          } else if (my_status == "6") {
            //Plan to watch
            $("#animeInformation_addToList").attr("data-tooltip", "Planned to Watch");
            currentStatus = "ptw";
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
          if(tagListArray.length == 1 && tagListArray[0] == "") {
            // No Tags set
            data.data = "";
          } else {
            var index;
            for(index = 0; index < tagListArray.length; index++) {
              data.data.push({
                tag: tagListArray[index]
              });
            };
          }
          data.placeholder = "+ Tags";
          data.secondaryPlaceholder = "Enter tags.";
          tags = data;
          $("#animeInformation_addToList").html("<i class=\"material-icons\">edit</i>").css("background", "#2e8ba2");
          $("#animeEditForm nav .nav-wrapper span i").text("edit");
          $(".animeInformation #animeInformation_myScore").show();
          $(".animeInformation #animeInformation_deleteFromList").show();
          $(".animeInformation-edit-preloader-wrapper")[0].style.setProperty("display", "none", "important");
          return false;
        } else {
          //It could be in the list, but not in this particular "each"
          formAnimeStatus = "Add";
        }
      });
      if(formAnimeStatus == "Add") {
        currentStatus = "none";
        $("#animeEditForm-tags div.chip").remove();
        tags = {
          data: [],
          placeholder: "+ Tags",
          secondaryPlaceholder: "Enter tags."
        };
        $("#animeInformation_addToList").html("<i class=\"material-icons\">add</i>").css("background", "#51a22e");
        $("#animeEditForm-status").val("none").material_select();
        $("#animeEditForm-episodes").val("0");
        $("#animeEditForm-startDate").val(""); // Changed from html() to val()
        $("#animeEditForm-finishDate").val("");
        $("#animeInformation_addToList").attr("data-tooltip", "Add to List").tooltip({delay:50});
        $("#animeEditForm-rating").rateYo("option", "rating", 0);
        $("#animeEditForm nav .nav-wrapper span i").text("add");
        $(".animeInformation #animeInformation_myScore").hide();
        $(".animeInformation #animeInformation_deleteFromList").hide();
        $(".animeInformation-edit-preloader-wrapper")[0].style.setProperty("display", "none", "important");
      }
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

$("#openSettings").on("click", function() {
  chrome.tabs.create({
    url: "../options/options.html"
  });
});

// [+] Done Typing -> Render Results
$("#animeNameSearch").donetyping(function() {
  $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "block", "important");
  $("#animeNameSearch_status").text("Searching...");
  $(".grid-list-row .col img").css("pointer-events", "none").addClass("grayscale");
  var query = $(this).val();
  if(query == "") {
    $("#animeNameSearch_status").text("Start Typing to Search.");
    $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "none", "important");
    $("#animeNameSearch_results").html("");
    return;
  }
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
  var rowcount = 0;
  var html;
  // Make the results empty because we are appending on.
  $("#animeNameSearch_results").html("");
  
  // Only one result?
  if(Object.prototype.toString.call(dataAnimes) !== "[object Array]") {
    if(popup_mcss_options.dynamic_colors === true) {
      $.ajax({
        url: "http://www.foxinflame.tk/dev/dominantColor/getColors.php?palette=4&url=" + dataAnimes.image,
        method: "GET",
        success: function(data) {
          // Making it easier to insert later on
          var dominantColor = data.dominant.join(); // instead of adding one by one with comma
          var paletteColor1 = data.palette[0].join();
          var paletteColor2 = data.palette[1].join();
          var paletteColor3 = data.palette[2].join();
          var paletteColor4 = data.palette[3].join();
          html = "<div class='grid-list-row'>" +
            "<div data-title=\"" + dataAnimes.title + "\" data-type=\"" + dataAnimes.type + "\" data-episodes=\"" + dataAnimes.episodes + "\" data-score=\"" + dataAnimes.score + "\" data-url=\"https://myanimelist.net/anime/" + dataAnimes.id + "\" data-id=\"" + dataAnimes.id + "\" data-status=\"" + dataAnimes.status + "\" data-synopsis=\"" + dataAnimes.synopsis.replaceAll(/<(?:.|\n)[^>]*?>/gm, "").replace(/\"/g,'&#34;').replace(/'/g,"&#39;") + "\" data-color-dominant=\"" + dominantColor + "\" data-color-palette1=\"" + paletteColor1 + "\" data-color-palette2=\"" + paletteColor2 + "\" data-color-palette3=\"" + paletteColor3 + "\" data-color-palette4=\"" + paletteColor4 + "\" class=\"col s6\">" +
              "<img class=\"grayscale\" style=\"pointer-events:none\" src='" + dataAnimes.image + "'>" +
              "<div class=\"grid-list-text-footer\" style=\"background:rgb(" + dominantColor + ")\">" +
                "<span class=\"grid-list-text-footer-title\">" + dataAnimes.title + "</span>" +
              "</div>" +
            "</div>" +
          "</div>";
          $("#animeNameSearch_results").append(html);
          $("#animeNameSearch_status").text("1 Result.");
          grid_list_init();
          $("#animeNameSearch_results img").css("pointer-events", "auto").removeClass("grayscale");
          $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "none", "important");
        }
      });
      return;
    } else {
      var dominantColor = paletteColor1 = paletteColor2 = paletteColor3 = paletteColor4 = "46,81,162";
      html = "<div class='grid-list-row'>" +
        "<div data-title=\"" + dataAnimes.title + "\" data-type=\"" + dataAnimes.type + "\" data-episodes=\"" + dataAnimes.episodes + "\" data-score=\"" + dataAnimes.score + "\" data-url=\"https://myanimelist.net/anime/" + dataAnimes.id + "\" data-id=\"" + dataAnimes.id + "\" data-status=\"" + dataAnimes.status + "\" data-synopsis=\"" + dataAnimes.synopsis.replaceAll(/<(?:.|\n)[^>]*?>/gm, "").replace(/\"/g,'&#34;').replace(/'/g,"&#39;") + "\" data-color-dominant=\"" + dominantColor + "\" data-color-palette1=\"" + paletteColor1 + "\" data-color-palette2=\"" + paletteColor2 + "\" data-color-palette3=\"" + paletteColor3 + "\" data-color-palette4=\"" + paletteColor4 + "\" class=\"col s6\">" +
          "<img class=\"grayscale\" style=\"pointer-events:none\" src='" + dataAnimes.image + "'>" +
          "<div class=\"grid-list-text-footer\" style=\"background:rgb(" + dominantColor + ")\">" +
            "<span class=\"grid-list-text-footer-title\">" + dataAnimes.title + "</span>" +
          "</div>" +
        "</div>" +
      "</div>";
      $("#animeNameSearch_results").append(html);
      $("#animeNameSearch_status").text("1 Result.");
      grid_list_init();
      $("#animeNameSearch_results img").css("pointer-events", "auto").removeClass("grayscale");
      $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "none", "important");
    }
  }
  
  // Many results!
  var allcount = 0;
  var counter = dataAnimes.length;
  dataAnimes.forEach(displayListItem);
  function displayListItem(item, index) {
    // Add to an HTML string instead of appending because Appending closes tags automatically and making two columns with that is impossible.
    if(popup_mcss_options.dynamic_colors === true) {
      $.ajax({
        // Query to my server to get the dominant colors and the color palette, because using pure JS is hard af.
        url: "http://www.foxinflame.tk/dev/dominantColor/getColors.php?palette=4&url=" + item.image,
        method: "GET",
        success: function(data) {
          counter -= 1;
          allcount++;
          rowcount++;
          // Making it easier to insert later on
          var dominantColor = data.dominant.join(); // instead of adding one by one with comma
          var paletteColor1 = data.palette[0].join();
          var paletteColor2 = data.palette[1].join();
          var paletteColor3 = data.palette[2].join();
          var paletteColor4 = data.palette[3].join();
          if((allcount % 2) == 1) {
            html = "<div class=\"grid-list-row\">";
            html += "<div data-title=\"" + item.title + "\" data-type=\"" + item.type + "\" data-episodes=\"" + item.episodes + "\" data-score=\"" + item.score + "\" data-url=\"https://myanimelist.net/anime/" + item.id + "\" data-id=\"" + item.id + "\" data-status=\"" + item.status + "\" data-synopsis=\"" + item.synopsis.replaceAll(/<(?:.|\n)[^>]*?>/gm, "").replace(/\"/g,'&#34;').replace(/'/g,"&#39;") + "\" data-color-dominant=\"" + dominantColor + "\" data-color-palette1=\"" + paletteColor1 + "\" data-color-palette2=\"" + paletteColor2 + "\" data-color-palette3=\"" + paletteColor3 + "\" data-color-palette4=\"" + paletteColor4 + "\" class=\"col s6\">" +
              "<img class=\"grayscale\" style=\"pointer-events:none\" src=\"" + item.image + "\">" +
              "<div class=\"grid-list-text-footer\" style=\"background:rgb(" + dominantColor + ")\">" +
                "<span class=\"grid-list-text-footer-title\">" + item.title + "</span>" +
              "</div>" +
            "</div>";
          } else {
            html += "<div data-title=\"" + item.title + "\" data-type=\"" + item.type + "\" data-episodes=\"" + item.episodes + "\" data-score=\"" + item.score + "\" data-url=\"https://myanimelist.net/anime/" + item.id + "\" data-id=\"" + item.id + "\" data-status=\"" + item.status + "\" data-synopsis=\"" + item.synopsis.replaceAll(/<(?:.|\n)[^>]*?>/gm, "").replace(/\"/g,'&#34;').replace(/'/g,"&#39;") + "\" data-color-dominant=\"" + dominantColor + "\" data-color-palette1=\"" + paletteColor1 + "\" data-color-palette2=\"" + paletteColor2 + "\" data-color-palette3=\"" + paletteColor3 + "\" data-color-palette4=\"" + paletteColor4 + "\" class=\"col s6\">" +
              "<img class=\"grayscale\" style=\"pointer-events:none\" src=\"" + item.image + "\">" +
              "<div class=\"grid-list-text-footer\" style=\"background:rgb(" + dominantColor + ")\">" +
                "<span class=\"grid-list-text-footer-title\">" + item.title + "</span>" +
              "</div>" +
            "</div>";
            html += "</div>";
            // If we use html() here instead of append() then it won't work because the rows need to pile on with the same search.
            $("#animeNameSearch_results").append(html);
           rowcount = 0;
          }
          if(counter === 0) {
            complete();
          }
        }
      });
    } else {
      counter -= 1;
      allcount++;
      rowcount++;
      var dominantColor = paletteColor1 = paletteColor2 = paletteColor3 = paletteColor4 = "46,81,162";
      if((allcount % 2) == 1) {
        html = "<div class=\"grid-list-row\">";
        html += "<div data-title=\"" + item.title + "\" data-type=\"" + item.type + "\" data-episodes=\"" + item.episodes + "\" data-score=\"" + item.score + "\" data-url=\"https://myanimelist.net/anime/" + item.id + "\" data-id=\"" + item.id + "\" data-status=\"" + item.status + "\" data-synopsis=\"" + item.synopsis.replaceAll(/<(?:.|\n)[^>]*?>/gm, "").replace(/\"/g,'&#34;').replace(/'/g,"&#39;") + "\" data-color-dominant=\"" + dominantColor + "\" data-color-palette1=\"" + paletteColor1 + "\" data-color-palette2=\"" + paletteColor2 + "\" data-color-palette3=\"" + paletteColor3 + "\" data-color-palette4=\"" + paletteColor4 + "\" class=\"col s6\">" +
          "<img class=\"grayscale\" style=\"pointer-events:none\" src=\"" + item.image + "\">" +
          "<div class=\"grid-list-text-footer\" style=\"background:rgb(" + dominantColor + ")\">" +
            "<span class=\"grid-list-text-footer-title\">" + item.title + "</span>" +
          "</div>" +
        "</div>";
      } else {
        html += "<div data-title=\"" + item.title + "\" data-type=\"" + item.type + "\" data-episodes=\"" + item.episodes + "\" data-score=\"" + item.score + "\" data-url=\"https://myanimelist.net/anime/" + item.id + "\" data-id=\"" + item.id + "\" data-status=\"" + item.status + "\" data-synopsis=\"" + item.synopsis.replaceAll(/<(?:.|\n)[^>]*?>/gm, "").replace(/\"/g,'&#34;').replace(/'/g,"&#39;") + "\" data-color-dominant=\"" + dominantColor + "\" data-color-palette1=\"" + paletteColor1 + "\" data-color-palette2=\"" + paletteColor2 + "\" data-color-palette3=\"" + paletteColor3 + "\" data-color-palette4=\"" + paletteColor4 + "\" class=\"col s6\">" +
          "<img class=\"grayscale\" style=\"pointer-events:none\" src=\"" + item.image + "\">" +
          "<div class=\"grid-list-text-footer\" style=\"background:rgb(" + dominantColor + ")\">" +
            "<span class=\"grid-list-text-footer-title\">" + item.title + "</span>" +
          "</div>" +
        "</div>";
        html += "</div>";
        // If we use html() here instead of append() then it won't work because the rows need to pile on with the same search.
        $("#animeNameSearch_results").append(html);
       rowcount = 0;
      }
      if(counter === 0) {
        complete();
      }
    }
  }
  function complete() {
    //Initiailizes the Grid List to make sure all events are on.
    $("#animeNameSearch_status").text(allcount + " Results.");
    grid_list_init();
    $(".animeInformation-loading-bar-wrapper")[0].style.setProperty("display", "none", "important");
    $("#animeNameSearch_results img").css("pointer-events", "auto").removeClass("grayscale");
  }
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
    currentStatus = "none";
    $("#animeInformation_addToList").html("<i class=\"material-icons\">add</i>").css("background", "#51a22e");
    $("#animeEditForm-status").val("").material_select();
    $("#animeEditForm-episodes").val("");
    $("#animeInformation_addToList").attr("data-tooltip", "Add to List").tooltip({delay:50});
    $("#animeEditForm-rating").rateYo("option", "rating", 0);
    $("#animeEditForm-tags .chip").remove();
    $("#animeEditForm nav .nav-wrapper span i").text("add");
    $("#animeInformation_deleteFromList, #animeInformation_myScore").fadeOut(150);
    $(".animeInformation-edit-preloader-wrapper")[0].style.setProperty("display", "none", "important");
  }
});
  
// [+] Add to List Button Click
$("#animeInformation_addToList").on("click", function() {
  $(this).tooltip("remove");
  $("#animeEditForm-tags").material_chip({
    data: tags.data,
    placeholder: tags.placeholder,
    secondaryPlaceholder: tags.secondaryPlaceholder
  });
  $("#animeInformation_deleteFromList, #animeInformation_myScore, #animeInformation_link, .animeInformation>nav").fadeOut(100);
  $("#qmal_popup_mainContent").css("width", "500px").css("height", "600px");
  $("#animeEditForm").css("width", "100%");
  $("#animeEditForm #animeEditForm-back").fadeIn(100);
  $("#animeEditForm #animeEditForm-next").fadeIn(100);
  $(".animeInformation #animeInformation_image-wrapper").animate({
    height: "550px"
  }, {duration: 250, queue: false}, $.bez([0.4, 0, 0.2, 1]));
  window.setTimeout(function() {
    $("#addAnimeContainer").fadeIn(400);
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

// [+] Next Button
$("#animeEditForm #animeEditForm-next").on("click", function() {
  // [+] Stage 1 -> Stage 2
  console.log($(this).attr("data-action"));
  if($(this).attr("data-action") == "page2") {
    if((parseInt($("#animeEditForm-episodes").val()) > parseInt($("#animeEditForm-episodes").attr("max")) || parseInt($("#animeEditForm-episodes").val()) < 0) && parseInt($("#animeEditForm-episodes").attr("max")) !== 0) {
      Materialize.toast("Incorrect Episode count!", 3000);
      return;
    }
    if($("#animeEditForm-status").val() == null) {
      Materialize.toast("Empty status is not allowed!", 3000);
      return;
    }
    console.log("animating fieldset 2 into view");
    $("#animeEditForm-fieldset1").animate({
      marginTop: "-500px"
    });
    $(this).attr("data-action", "submit").css("background", "#51a22e").html("<i class=\"material-icons\">send</i>");
    $("#animeEditForm #animeEditForm-back").attr("data-action", "page1").html("<i class=\"material-icons\">arrow_back</i>");
    return;
  }
  // [+] Stage 2 -> Submit
  if($(this).attr("data-action") == "submit") {
    submitEditForm();
    return;
  }
});

// [+] Back Button
$("#animeEditForm #animeEditForm-back").on("click", function() {
  // [+] Stage 1 -> Close
  if($(this).attr("data-action") == "close") {
    $("#animeEditForm-fieldset1").animate({
      marginTop: "40px"
    });
    $("#addAnimeContainer").fadeOut(400);
    $("#animeInformation_link").fadeIn(100);
    if(!showOneOnly) {
      $(".animeInformation>nav").fadeIn(100);
    }
    $("#animeEditForm #animeEditForm-back").attr("data-action", "close").fadeOut(100);
    $("#animeEditForm #animeEditForm-next").attr("data-action", "page2").fadeOut(100);
    $(".animeInformation #animeInformation_image-wrapper").animate({
      height: "120px"
    }, {duration: 250, queue: false}, $.bez([0.4, 0, 0.2, 1]));
    if(formAnimeStatus == "Update") {
      $("#animeInformation_deleteFromList, #animeInformation_myScore, #animeInformation_link, .animeInformation>nav").fadeIn(100);
      switch($("#animeEditForm-status").val()) {
        case "1":
          //Watching
          $("#animeInformation_addToList").attr("data-tooltip", "Watching: Ep " + $("#animeEditForm-episodes").val());
          break;
        case "2":
          $("#animeInformation_addToList").attr("data-tooltip", "Completed");
          break;
        case "3":
          $("#animeInformation_addToList").attr("data-tooltip", "On Hold");
          break;
        case "4":
          $("#animeInformation_addToList").attr("data-tooltip", "Dropped");
          break;
        case "6":
          $("#animeInformation_addToList").attr("data-tooltip", "Planned to Watch");
          break;
      }
      $("#animeInformation_addToList").tooltip({delay: 50});
    }
    return;
  }
  // [+] Stage 2 -> Stage 1
  if($(this).attr("data-action") == "page1") {
    $("#animeEditForm #animeEditForm-back").attr("data-action", "close");
    $("#animeEditForm #animeEditForm-next").attr("data-action", "page2");
    $("#animeEditForm-fieldset1").animate({
      marginTop: "40px"
    });
    $(this).attr("data-action", "close").html("<i class=\"material-icons\">close</i>");
    $("#animeEditForm-next").attr("data-action", "page2").css("background", "#2e51a2").html("<i class=\"material-icons\">arrow_forward</i>");
    return;
  }
});

// [+] Stage 2 -> Autofill Genres
$("#animeEditForm-fieldset2-tags-autoFill").click(function() {
  var toastID = Materialize.toast("Please wait....");
  $.ajax({
    url: "http://www.matomari.tk/api/0.3/anime/info/" + $(".animeInformation .animeInformation_id").text() + ".json",
    method: "GET",
    success: function(data) {
      function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
          if (list[i] === obj) {
            return true;
          }
        }
        return false;
      }
      var x = 0;
      var tags_materialChips = $("#animeEditForm-tags").material_chip("data");
      var tags_array = [];
      var tags_array_fin = [];
      while(tags_materialChips.length > x) {
        tags_array.push(tags_materialChips[x].tag.trim());
        x++;
      }
      Materialize.toastRemove();
      tags_array = tags_array.concat(data.genres).unique();
      for(var i=0; i<tags_array.length;i++) {
        var tmp = {
          tag: tags_array[i]
        }
        tags_array_fin.push(tmp);
      }
      $("#animeEditForm-tags").material_chip({
        data: tags_array_fin,
        placeholder: tags.placeholder,
        secondaryPlaceholder: tags.secondaryPlaceholder
      });
    },
    error: function(jqXHR, textStatus, thrownError) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(thrownError);
    }
  });
});

// [+] Stage 2 -> Next -> Proccess and Submit
function submitEditForm() {
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
  tags_str = tags_array.join(", ");
  
  var response;
  if(formAnimeStatus == "Update") {
    response = updateAnimeInList(id, episodesWatched, status, rating, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags_str);
  } else {
    response = addAnimeInList(id, episodesWatched, status, rating, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags_str);
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
  
  $("#animeInformation_addToList").html("<i class=\"material-icons\">edit</i>").css("background", "#2e8ba2");
  $("#animeEditForm nav .nav-wrapper span i").text("edit");
  $("#animeInformation_deleteFromList, #animeInformation_myScore, #animeInformation_link, .animeInformation>nav").fadeIn(100);
  $(".animeInformation #animeInformation_myScore").attr("data-tooltip", "My Score: " + rating).tooltip({delay:50});
  formAnimeStatus = "Update";
  $("#animeEditForm-fieldset1").animate({
    marginTop: "40px"
  });
  $("#addAnimeContainer").fadeOut(400);
  $("#animeInformation_link, .animeInformation>nav").fadeIn(100);
  $("#animeEditForm #animeEditForm-back").attr("data-action", "close").fadeOut(100);
  $("#animeEditForm #animeEditForm-next").attr("data-action", "page2").css("background", "#2e51a2").html("<i class=\"material-icons\">arrow_forward</i>").fadeOut(100);
  $(".animeInformation #animeInformation_image-wrapper").animate({
    height: "120px"
  }, {duration: 250, queue: false}, $.bez([0.4, 0, 0.2, 1]));
  window.setTimeout(function() {
    if(status == "1") {
      //Watching
      $("#animeInformation_addToList").attr("data-tooltip", "Watching: Ep " + episodesWatched);
    } else if (status == "2") {
      //Completed
      $("#animeInformation_addToList").attr("data-tooltip", "Completed");
    } else if (status == "3") {
      //On Hold
      $("#animeInformation_addToList").attr("data-tooltip", "On Hold");
    } else if (status == "4") {
      //Dropped
      $("#animeInformation_addToList").attr("data-tooltip", "Dropped");
    } else if (status == "6") {
      //Plan to watch
      $("#animeInformation_addToList").attr("data-tooltip", "Planned to Watch");
    }
    $("#animeInformation_addToList").tooltip({delay: 50});
  }, 50);
  $("#animeEditForm-back").attr("data-action", "close");
  $("#animeEditForm-next").attr("data-action", "page1");
};