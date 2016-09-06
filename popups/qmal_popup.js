
var formAnimeStatus;
var formAnimeUpdateData = new Object({});
var submit = new Object({});

var fieldsetNumber;
var fieldsetTotal;

var animeid;

// -- Toggle variables
var information_synopsis_visibility;
var anime_stage3_advancedInputs_visibility;
var anime_stage4_confirmMore_visibility;

// Hide many stuff and change variables and check credentials.
$("#preview").hide();
$("#anime_stageFinal_done_overlay, #anime_stageFinal_done").hide();
$("#anime_delete_confirm_overlay, #anime_delete_confirm").hide();
$("#anime_delete_done_overlay, #anime_delete_done").hide();
$("#status").hide();
$("#stage1_delete").hide();
$("#information, #information_synopsis").hide();
information_synopsis_visibility = 0;
$("#anime_stage3_advancedInputs").hide();
anime_stage3_advancedInputs_visibility = 0;
document.getElementById("animeName").focus();
select2_init();

var marginHeightAnimeDelete = $("#anime_delete_confirm").height() + ($("#anime_delete_confirm").height())/2;
$("#anime_delete_confirm").css("margin", "-" + marginHeightAnimeDelete + "px 0 0 -225px");
var marginHeightAnimeFinal = $("#anime_stageFinal_done").height() + ($("#anime_stageFinal_done").height())/2;
$("#anime_stageFinal_done").css("margin", "-" + marginHeightAnimeFinal + "px 0 0 -225px");
var marginHeightAnimeDeleteDone = $("#anime_delete_done").height() + ($("#anime_delete_done").height())/2;
console.log(marginHeightAnimeDeleteDone + ";height:" + $("#anime_delete_done").height() + ";height/2:" + ($("#anime_delete_done").height())/2);
$("#anime_delete_done").css("margin", "0 0 0 -225px");
$("#anime_delete_done").css("top", "-300px");

// -- Next and Back buttons
fieldsetNumber = 1;
fieldsetTotal = $("fieldset").length;
$(".next").on("click", function() {
  //On the first slide
  if(fieldsetNumber == 1) {
    if(!$("#animeName").val()){
      $("#stage1_warning").show();
      $("#stage1_warning").html("Anime has not been selected!");
      window.setTimeout(function() {
        $("#stage1_warning").fadeOut(500);
      }, 5000);
      return false;
    }
    if(popup_input_rating === false) {
      $("#anime_stage2_rating_wrapper").hide();
    }
    if(popup_input_rewatching === false) {
      $("#anime_stage2_rewatching_wrapper").hide();
    }
  } else if(fieldsetNumber == 2){
    var anime_stage2_episodeInput = parseInt($("#anime_stage2_episodeInput").val());
    var animeTotalEpisodes = parseInt(animeEpisodes[animeid]);
    if(anime_stage2_episodeInput > animeTotalEpisodes){
      $("#stage2_warning").show();
      $("#stage2_warning").html("Episode count over " + animeTotalEpisodes + "!");
      window.setTimeout(function() {
        $("#stage2_warning").fadeOut(500);
      }, 5000);
      return;
    }
    if(!$("#anime_stage2_episodeInput")) {
      $("#stage2_warning").show();
      $("#stage2_warning").html("Episode count empty!");
      window.setTimeout(function() {
        $("#stage2_warning").fadeOut(500);
      }, 5000);
      return;
    }
    if(popup_input_tags === false) {
      $("#anime_stage3_tags_wrapper").hide();
    }
    if(popup_input_storageType === false) {
      $("#anime_stage3_storageType_wrapper").hide();
    }
  }
  
  var current_fieldset = $(this).parent();
  var next_fieldset = $(this).parent().next("fieldset");
  if(next_fieldset.length === 0) {
    $("#mainForm").submit();
    //Submit form because there's no more fieldsets
  } else {
    current_fieldset.fadeOut(500, function() {
      next_fieldset.fadeIn(500);
      fieldsetNumber++;
      $("#anime_form_progress").css("width", (fieldsetNumber/fieldsetTotal)*100 + "%");
    });
  }
});

$(".previous").on("click", function() {
  var current_fieldset = $(this).parent();
  var previous_fieldset = $(this).parent().prev("fieldset");
  if(previous_fieldset.length === 0) {
    return false;
    //Do nothing because there's nothing before
  } else {
    current_fieldset.fadeOut(500, function() {
      previous_fieldset.fadeIn(500);
      fieldsetNumber--;
      $("#anime_form_progress").css("width", (fieldsetNumber/fieldsetTotal)*100 + "%");
    });
  }
});

// -- Popup button at the top
$("#openPopup").on("click", function() {
   chrome.windows.create({'url': 'http://myanimelist.net/animelist/' + loginUsername, 'type': 'popup', 'height': 650, 'width':1000}, function(window) {
   });
});


// -- Functions that help out a lot.
// ---- [Show More] [Show less] buttons
function toggleShowHide(subject, visibilityVariable, showText, hideText) {
  $("#" + subject + "_toggle").on("click", function() {
    if(window[visibilityVariable] == 1) {
      //Shown - Hide it now
      window[visibilityVariable] = 0;
      document.getElementById(subject + "_toggle").innerHTML = showText;
      $("#" + subject).hide();
    } else {
      // Hidden - Show it now
      window[visibilityVariable] = 1;
      document.getElementById(subject + "_toggle").innerHTML = hideText;
      $("#" + subject).show();
    }
    return false;
  });
}

// ---- Update anime function
function updateAnimeInList(id, episode, status, score, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags) {
  
  var variables = ["id", "episodes", "status", "score", "storage_type", "storage_value", "times_rewatched", "rewatch_value", "date_start", "date_finish", "priority", "enable_discussion", "enable_rewatching", "tags"];
  
  var submitVars = {}; //Creates an object
  for(var i = 0; i < variables.length; i++) {
    submitVars[variables[i]] = submit[variables[i]];
    if(submitVars[variables[i]] == "0" || submitVars[variables[i]] == null) {
      submitVars[variables[i]] = "";
    }
  }
  
  var editXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + submitVars.episodes + "</episode>" +
  "<status>" + submitVars.status + "</status>" +
  "<score>" + submitVars.score + "</score>" +
  "<storage_type>" + submitVars.storage_type + "</storage_type>" +
  "<storage_value>" + submitVars.storage_value + "</storage_value>" +
  "<times_rewatched>" + submitVars.times_rewatched + "</times_rewatched>" +
  "<rewatch_value>" + submitVars.rewatch_value + "</rewatch_value>" +
  "<date_start>" + submitVars.date_start + "</date_start>" +
  "<date_finish>" + submitVars.date_finish + "</date_finish>" +
  "<priority>" + submitVars.priority + "</priority>" +
  "<enable_discussion>" + submitVars.enable_discussion + "</enable_discussion>" +
  "<enable_rewatching>" + submitVars.enable_rewatching + "</enable_rewatching>" +
  "<tags>" + submitVars.tags + "</tags>" +
  "</entry>";
  
  console.log("[UPDATE] Updating Anime " + id + " as status: " + status + " to list....");
  console.log("[UPDATE] Watched Episodes: " + episode);
  
  $.ajax({
    url: "http://myanimelist.net/api/animelist/update/" + id + ".xml",
    type: "GET",
    data: {"data": editXML},
    username: loginUsername,
    password: loginPassword,
    contentType: "application/xml",
    async: false,
    success: function(ajaxData) {
      console.log("[DONE] Anime ID " + id + " has been updated on " + loginUsername + "'s list!");
      console.log("[DONE] Details: Episodes - " + submitVars.episodes);
      console.log("[DONE] Details: Score - " + submitVars.score);
    },
    error: function(xhr, status, thrownError) {
      console.log(xhr.status);
      if(xhr.status == "0") {
        console.log("The Anime is already in the list or doesn't exist!! I think.");
      }
      console.log(xhr.responseText);
    }
  });
}

// ---- Add anime function
function addAnimeInList(id, episode, status, score, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags) {
  
  var variables = ["id", "episode", "status", "score", "storage_type", "storage_value", "times_rewatched", "rewatch_value", "date_start", "date_finish", "priority", "enable_discussion", "enable_rewatching", "tags"];
  
  var submitVars = new Object;
  for(var i = 0; i < variables.length; i++) {
    submitVars[variables[i]] = submit[variables[i]];
    if(variables[i] == "score" && submitVars[variables[i]] == "0") {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "storage_type" && submitVars[variables[i]] == "0"){
      submitVars[variables[i]] = "";
    } else if(variables[i] == "rewatch_value" && submitVars[variables[i]] == "0") {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "date_start" && submitVars[variables[i]] == null) {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "date_finish" && submitVars[variables[i]] == null) {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "priority" && submitVars[variables[i]] == "0") {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "enable_discussion"){
      if(submitVars[variables[i]] == "0") {
        submitVars[variables[i]] = "";
      } else if(submitVars[variables[i]] == "1") {
        submitVars[variables[i]] = "0";
      } else if(submitVars[variables[i]] == "2") {
        submitVars[variables[i]] = "1";
      }
    }
  }
  
  var myXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + submitVars["episode"] + "</episode>" +
  "<status>" + submitVars["status"] + "</status>" +
  "<score>" + submitVars["score"] + "</score>" +
  "<storage_type>" + submitVars["storage_type"] + "</storage_type>" +
  "<storage_value>" + submitVars["storage_value"] + "</storage_value>" +
  "<times_rewatched>" + submitVars["times_rewatched"] + "</times_rewatched>" +
  "<rewatch_value>" + submitVars["rewatch_value"] + "</rewatch_value>" +
  "<date_start>" + submitVars["date_start"] + "</date_start>" +
  "<date_finish>" + submitVars["date_finish"] + "</date_finish>" +
  "<priority>" + submitVars["priority"] + "</priority>" +
  "<enable_discussion>" + submitVars["enable_discussion"] + "</enable_discussion>" +
  "<enable_rewatching>" + submitVars["enable_rewatching"] + "</enable_rewatching>" +
  "<tags>" + submitVars["tags"] + "</tags>" +
  "</entry>";
  
  console.log("[ADD] Adding Anime " + id + " as status: " + status + " to list.");
  console.log("[ADD] Watched Episodes: " + episode);
  
  $.ajax({
    url: "http://myanimelist.net/api/animelist/add/" + id + ".xml",
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
      console.log(xhr.status);
      if(xhr.status == "501") {
        console.log("The Anime is already in the list.");
      }
      console.log(xhr.responseText);
    }
  })
};

// ---- Delete anime function
function deleteAnimeInList(id) {
  // This function will delete without any confirmation. Be aware.
  $.ajax({
    url: "http://myanimelist.net/api/animelist/delete/" + id + ".xml",
    type: "GET",
    username: loginUsername,
    password: loginPassword,
    success: function(ajaxData) {
      console.log("Anime ID " + id + " has been deleted!");
    },
    error: function(xhr, status, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  })
}

// ---- Trigger multiple events using a function something.triggerAll("submit next click etc")
(function($) {
    $.fn.extend({
        triggerAll: function (events, params) {
            var el = this, i, evts = events.split(' ');
            for (i = 0; i < evts.length; i += 1) {
                el.trigger(evts[i], params);
            }
            return el;
        }
    });
})(jQuery);

// ---- Close any dialog that's open
$("#anime_delete_cancel").on("click", function() {
  $("#anime_delete_confirm").addClass("animated bounceOut");
});

$(".anime_stageFinal_done_close").on("click", function() {
  window.close();
})

$("#anime_stageFinal_done_another").on("click", function() {
  window.location.reload();
})

// First Fieldset

var animeNamesInList = {},
    animeEnglishNames = {},
    animeSynonyms = {},
    animeEpisodes = {},
    animeSynopsis = {},
    chosenAnimeInList;

var select2InputBox;
function select2_init() {
  select2InputBox = $("#animeName").select2({
    ajax: {
      url: "http://myanimelist.net/api/anime/search.xml",
      dataType: "xml",
      type: "GET",
      username: loginUsername,
      password: loginPassword,
      delay: 250,
      data: function (params) {
        return {
          q: params.term
        }
      },
      processResults: function (data, params) {
        var x2js = new X2JS();
        dataXML = x2js.xml2json(data);
        return {
          results: dataXML["anime"]["entry"]
        }
      },
      cache: true
    },
    escapeMarkup: function(markup) {return markup},
    minimumInputLength: 1,
    templateResult: formatAnimeResult,
    templateSelection: formatAnimeSelection
  }).maximizeSelect2Height();
}

// -- When searched in Select2 run this function
function formatAnimeResult(anime) {
  if(anime.loading) return anime.text;
  
  var animeId = anime.id;
  animeNamesInList[animeId] = anime.title
  animeEnglishNames[animeId] = anime.english;
  if(animeEnglishNames[animeId] === "" || animeEnglishNames[animeId] === null) {
    animeEnglishNames[animeId] = animeNamesInList[animeId];
  }
  animeSynonyms[animeId] = anime.synonyms;
  animeEpisodes[animeId] = anime.episodes;
  animeSynopsis[animeId] = anime.synopsis;
  
  var animeResultMarkup = "<div class='select2-result-anime clearfix'>" +
  "<div class='select2-result-anime__cover'><img src='" + anime.image + "'/></div>" +
  "<div class='select2-result-anime__meta'>" +
    "<div class='select2-result-anime__title'>" + anime.title + "</div>" +
    "<div class='select2-result-anime__communityScore'>MAL Community Score : " + anime.score + "</div>" +
    "<div class='select2-result-anime__moreMeta'>" +
      "<div class='select2-result-anime__type'>" + anime.type + "</div>" +
      "<div class='select2-result-anime__status'><i>" + anime.status + "</i></div>" +
      "<div class='select2-result-anime__episodes'>" + anime.episodes + " Episodes</div>" +
    "</div>" +
  "</div></div>";
  
  return animeResultMarkup;
}

// -- When selected in Select2 run this function
function formatAnimeSelection(anime) {
  return (anime.id + " : " + anime.title) || anime.text;
}

// -- Function to display the status and image for the selected anime
$("#animeName").on("select2:select", function() {
  //Cover Preview
  $("#preview").show();
  animeid = document.getElementById("animeName").value;
  $(".previewCover").attr("id", "more" + animeid);
  var coverImageSource = $(".previewCover").css("background-image");
  coverImageSource = coverImageSource.replace(/[()\"]/g, "");
  coverImageSource = coverImageSource.slice(3);
  $("#previewCoverSize").attr("src", coverImageSource);
  
  //Hide the Synopsis
  information_synopsis_visibility = 0;
  document.getElementById("information_synopsis_toggle").innerHTML = "[Show Synopsis]";
  $("#information_synopsis").hide();
  
  //Informations
  $("#information").show();
  document.getElementById("information_originalTitle").innerHTML = animeNamesInList[animeid];
  document.getElementById("information_englishTitle").innerHTML = animeEnglishNames[animeid];
  document.getElementById("information_synonyms").innerHTML = animeSynonyms[animeid];
  document.getElementById("information_synopsis").innerHTML = animeSynopsis[animeid];
  
  //Change percentage
  $("#anime_form_progress").css("width", "25%");
  
  //Check the User's MAL List
  $("#status").show();
  $.ajax({
    url: "http://myanimelist.net/malappinfo.php?u="+loginUsername+"&status=all&type=anime",
    type: "GET",
    dataTpe: "xml",
    success: function(data) {
      $("anime", data).each(function(){
        var watchedEpisodes;
        var totalEpisodes;
        if($("series_animedb_id", this).text() == animeid) {
          //It's in the list! And it's in this "each" module
          formAnimeStatus = "update";
          var series_status = $("my_status", this).text();
          if(series_status == "1") {
            //Watching
            $("#status_status").html("Currently Watching");
          } else if (series_status == "2") {
            //Completed
            $("#status_status").html("Completed");
          } else if (series_status == "3") {
            //On Hold
            $("#status_status").html("Currently On Hold");
          } else if (series_status == "4") {
            //Dropped
            $("#status_status").html("Dropped");
          } else if (series_status == "6") {
            //Plan to watch
            $("#status_status").html("Planned to Watch");
          }
          watchedEpisodes = $("my_watched_episodes", this).text();
          totalEpisodes = $("series_episodes", this).text();
          formAnimeUpdateData["status"] = series_status;
          formAnimeUpdateData["episodes"] = watchedEpisodes;
          formAnimeUpdateData["enable_rewatching"] = $("my_rewatching", this).text();
          formAnimeUpdateData["start_date"] = $("my_start_date", this).text();
          formAnimeUpdateData["finish_date"] = $("my_finish_date", this).text();
          formAnimeUpdateData["score"] = $("my_score", this).text();
          formAnimeUpdateData["tags"] = $("my_tags", this).text();
          $("#status_episodecount").show();
          $("#status_episodecount").html(watchedEpisodes + " / " + totalEpisodes);
          $("#status").show();
          $("#stage1_next").html("Edit");
          $("#stage1_delete").show();
          return false;
        } else {
          //It could be in the list, but not in this particular "each"
          formAnimeStatus = "add";
          $("#status").hide();
          $("#stage1_delete").hide();
          $("#stage1_next").html("Next");
        }
      });
    }
  });
});

toggleShowHide("information_synopsis", "information_synopsis_visibility", "[Show Synopsis]", "[Hide Synopsis]");

// -- Delete button
$("#stage1_delete").on("click", function() {
  $("#anime_delete_confirm").show();
  $("#anime_delete_confirm_overlay").show();
  $("#anime_delete_confirm").addClass("animated bounceIn");
})

$("#anime_delete_delete").on("click", function() {
  $("#anime_delete_confirm").addClass("animated bounceOut");
  deleteAnimeInList(animeid);
  window.setTimeout(function() {
    $("#anime_delete_done").show();
    $("#anime_delete_done_overlay").show();
    $("#anime_delete_done").addClass("animated bounceIn");
    $("#anime_delete_done_b").html(animeNamesInList[animeid]);
    window.setTimeout(function() {
      $("#anime_delete_done").addClass("animated bounceOut");
      window.setTimeout(function() {
        window.location.reload();
      }, 500)
    }, 3000)
  }, 1000);
})


// Second Fieldset

$("#stage1_next").on("click", function(event) {
  $("#anime_stage2_totalEpisodes").html(animeEpisodes[animeid]);
  $("#anime_stage2_episodeInput").attr("max", animeEpisodes[animeid]);
  $("#anime_stage2_episodeInput").attr("min", "0");
  $("#anime_stage2_episodeInput").show();
  secondSlide_animeStatus_selector();
  $("#anime_stage2_rating").rateYo({
    starWidth: "40px",
    numStars: 10,
    fullStar: true,
    maxValue: 10
  })
  if(formAnimeStatus == "update") {
    $("#anime_stage2_status").val(formAnimeUpdateData["status"]);
    $("#anime_stage2_episodeInput").val(formAnimeUpdateData["episodes"]);
    secondSlide_animeStatus_selector();
    $("#anime_stage2_rating").rateYo("rating", formAnimeUpdateData["score"]);
    if(formAnimeUpdateData["enable_rewatching"] == "1") {
      $("#anime_stage2_enableRewatching").prop("checked", true);
      $("#anime_stage2_episodeInput").prop("disabled", false);
    } else {
      $("#anime_stage2_enableRewatching").prop("checked", false);
    }
  }
})

$("#anime_stage2_enableRewatching").change(function() {
  if(this.checked) {
    $("#anime_stage2_episodeInput").prop("disabled", false);
  } else {
    if($("#anime_stage2_status").val() == "2" || $("#anime_stage2_status").val() == "6") {
      $("#anime_stage2_episodeInput").prop("disabled", true);
    } else {
      $("#anime_stage2_episodeInput").prop("disabled", false);
    }
  }
});

var secondSlide_animeStatus = document.getElementById("anime_stage2_status");
secondSlide_animeStatus.oninput = secondSlide_animeStatus_selector;
secondSlide_animeStatus.onpropertychange = secondSlide_animeStatus.oninput;

function secondSlide_animeStatus_selector() {
  var selectedStatus = $("#anime_stage2_status").val();
  if(selectedStatus == 1) {
    //Watching - Show episode count input
    $("#anime_stage2_episodeInput").prop("disabled", false);
  } else if(selectedStatus == 2) {
    //Completed - Show full episode count
    $("#anime_stage2_episodeInput").prop("disabled", true);
    $("#anime_stage2_episodeInput").val(animeEpisodes[animeid]);
  } else if(selectedStatus == 3) {
    //On Hold - Show episode count input
    $("#anime_stage2_episodeInput").prop("disabled", false);
  } else if(selectedStatus == 4) {
    //Dropped - Show episode count input
    $("#anime_stage2_episodeInput").prop("disabled", false);
  } else if(selectedStatus == 6) {
    //Plan to Watch - Show empty episode count
    $("#anime_stage2_episodeInput").prop("disabled", true);
    $("#anime_stage2_episodeInput").val("0");
  }
}

// Third Fieldset

$("#stage2_next").on("click", function(e) {
  if(formAnimeStatus == "update") {
    $("#anime_stage3_tags").html(formAnimeUpdateData["tags"]);
  }
  if(popup_input_tags === false) {
    $("#stage3_next").click();
    e.stopImmediatePropagation();
    return false;
  }
})

toggleShowHide("anime_stage3_advancedInputs", "anime_stage3_advancedInputs_visibility", "More Options", "Less Options!");


// Fourth Fieldset - The confirmation and submittion

$("#stage3_next").on("click", function() {
  submit["id"] = animeid;
  submit["title"] = animeNamesInList[animeid];
  submit["episodes"] = $("#anime_stage2_episodeInput").val();
  submit["status"] = $("#anime_stage2_status").val();
  submit["score"] = $("#anime_stage2_rating").rateYo("rating");
  submit["storage_type"] = $("#anime_stage3_storageType").val();
  submit["storage_value"] = "";
  submit["times_rewatched"] = "";
  submit["rewatch_value"] = "";
  submit["date_start"] = "";
  submit["date_finish"] = "";
  submit["priority"] = "";
  submit["enable_discussion"] = "";
  if($("#anime_stage2_enableRewatching").is(":checked")) {
    submit["enable_rewatching"] = "1";
  } else {
    submit["enable_rewatching"] = "0";
  }
  submit["tags"] = $("#anime_stage3_tags").val();
  $("#anime_stage4_normalInfo").html("<b>Action : </b>" + formAnimeStatus +
  "<br><b>Anime Title : </b>" + submit["title"] +
  "<br><b>Anime Status : </b>" + submit["status"] +
  "<br><b>Watched Episodes : </b>" + submit["episodes"] + "/" + animeEpisodes[animeid] +
  "<br><b>Your Rating : </b>" + submit["score"]);
  $("#anime_stage4_moreInfo").html("<br><b>Storage Type : </b>" + submit["storage_type"] +
  "<br><b>Storage Value : </b>" + submit["storage_value"] +
  "<br><b>Times Rewatched : </b>" + submit["times_rewatched"] +
  "<br><b>Rewatch Value : </b>" + submit["rewatch_value"] +
  "<br><b>Date Start : </b>" + submit["date_start"] +
  "<br><b>Date Finish : </b>" + submit["date_finish"] +
  "<br><b>Priority : </b>" + submit["priority"] +
  "<br><b>Enable Discussion? : </b>" + submit["enable_discussion"] +
  "<br><b>Enable Rewatching? : </b>" + submit["enable_rewatching"] +
  "<br><b>Tags : </b>" + submit["tags"]);
  $("#anime_stage4_moreInfo").hide();
  anime_stage4_confirmMore_visibility = 0;
});

toggleShowHide("anime_stage4_moreInfo", "anime_stage4_confirmMore_visibility", "More Info", "Less Info");

$("#mainForm").on("submit", function() {
  if(formAnimeStatus == "add") {
    addAnimeInList(submit["id"], submit["episodes"], submit["status"], submit["score"], submit["storage_type"], submit["storage_value"], submit["times_rewatched"], submit["rewatch_value"], submit["date_start"], submit["date_finish"], submit["priority"], submit["enable_discussion"], submit["enable_rewatching"], submit["tags"]);
  } else if(formAnimeStatus == "update") {
    updateAnimeInList(submit["id"], submit["episodes"], submit["status"], submit["score"], submit["storage_type"], submit["storage_value"], submit["times_rewatched"], submit["rewatch_value"], submit["date_start"], submit["date_finish"], submit["priority"], submit["enable_discussion"], submit["enable_rewatching"],  submit["tags"]);
  }
  chrome.extension.getBackgroundPage().updateBadge();
  $("#anime_stageFinal_done").show();
  $("#anime_stageFinal_done_overlay").show();
  $("#anime_stageFinal_done").addClass("animated bounceIn");
  return false;
});

$("#anime_delete_confirm").on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
  if($("#anime_delete_confirm").css("opacity") == "0") {
    //Just got hidden
    $("#anime_delete_confirm").removeClass("animated bounceOut");
    $("#anime_delete_confirm").hide();
    $("#anime_delete_confirm_overlay").hide();
  } else {
    //Just got visible
    $("#anime_delete_confirm").removeClass("animated bounceIn");
  }
})

$("#anime_stageFinal_done").on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
  if($("#anime_stageFinal_done").css("opacity") == "0") {
    //Just got hidden
    $("#anime_stageFinal_done").removeClass("animated bounceOut");
    $("#anime_stageFinal_done").hide();
    $("#anime_stageFinal_done_overlay").hide();
  } else {
    //Just got visible
    $("#anime_stageFinal_done").removeClass("animated bounceIn");
  }
})

$("#anime_delete_done").on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
  if($("#anime_delete_done").css("opacity") == "0") {
    //Just got hidden
    $("#anime_delete_done").removeClass("animated bounceOut");
    $("#anime_delete_done").hide();
    $("#anime_delete_done_overlay").hide();
  } else {
    //Just got visible
    $("#anime_delete_done").removeClass("animated bounceIn");
  }
})