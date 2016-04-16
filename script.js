var animeNameInput = document.getElementById("animeInput");
animeNameInput.oninput = predictAnime;
animeNameInput.onpropertychange = animeNameInput.oninput;

var loginUsername;
var loginPassword;

chrome.storage.sync.get({
    username: "Username",
    password: "password123"
  }, function(items) {
    loginUsername = items.username;
    loginPassword = items.password;
  });


// --- First Slide ---

var animeNamesInList = {},
    animeEnglishNames = {},
    animeSynonyms = {},
    animeEpisodes = {},
    animeSynopsis = {},
    chosenAnimeInList;

function predictAnime() {
  var animeNameInput = document.getElementById("animeInput").value.replace(" ", "+");
  if(animeNameInput === "" || animeNameInput === null) {
    document.getElementById("animeName").innerHTML = "<option disabled selected>Choose an Anime</option>";
    return false;
  }
  $.ajax({
    url: "http://myanimelist.net/api/anime/search.xml?q=" + animeNameInput,
    type: "GET",
    dataType: "xml",
    username: loginUsername,
    password: loginPassword,
    success: function(data) {
      var animeId;
      var count = 1;
      document.getElementById("animeName").innerHTML = "<option disabled selected>Choose an Anime</option>";
      $("entry", data).each(function(){
        if(count < 21){
          animeId = $("id", this).text();
          animeNamesInList[animeId] = $("title", this).text();
          animeEnglishNames[animeId] = $("english", this).text();
          if(animeEnglishNames[animeId] === "" || animeEnglishNames[animeId] === null) {
            animeEnglishNames[animeId] = animeNamesInList[animeId];
          }
          animeSynonyms[animeId] = $("synonyms", this).text();
          animeEpisodes[animeId] = $("episodes", this).text();
          animeSynopsis[animeId] = $("synopsis", this).text();
          
          animeHTML = document.getElementById("animeName").innerHTML;
          animeHTML = animeHTML+"<option>"+animeId+" : "+animeNamesInList[animeId]+"</option>";
          document.getElementById("animeName").innerHTML = animeHTML;
          count++;
        }
      });
    }
  });
}

var information_synopsis_visibility;

$(document).ready(function() {
  $("#preview").hide();
  $("#status").hide();
  $("#information").hide();
  $("#information_synopsis").hide();
  information_synopsis_visibility = 0;
  document.getElementById("animeInput").focus();
  chrome.storage.sync.get({
    verified: false
  }, function(items) {
    if(items.verified === false) {
      $("body").html("You have not verified your credentials. Do so in the options.");
    }
  });
});

var animeName = document.getElementById("animeName");
animeName.oninput = selectAnime;
animeName.onpropertychange = animeName.oninput;

var animeid;

function selectAnime() {
  //Cover Preview
  $("#preview").show();
  animeid = document.getElementById("animeName").value.split(":")[0];
  animeid = animeid.slice(0, -1);
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
          console.log("The chosen anime is in the list.");
          //It's in the list! And it's in this "each" module
          var series_status = $("my_status", this).text();
          console.log("Status in List: " + series_status);
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
          $("#status_episodecount").show();
          $("#status_episodecount").html(watchedEpisodes + " / " + totalEpisodes);
          $("#status").show();
          $("#stage1_next").html("Already in list!");
          $("#stage1_next").prop("disabled", true);
          return false;
        } else {
          //It could be in the list, but not in this particular "each"
          $("#status").hide();
          $("#stage1_next").html("Next");
          $("#stage1_next").prop("disabled", false);
        }
      });
    }
  });
}

$("#openPopup").on("click", function() {
   chrome.windows.create({'url': 'http://myanimelist.net/animelist/' + loginUsername, 'type': 'popup', 'height': 500}, function(window) {
   });
});

//Fading Forms
$(".next").on("click", function() {
  var current_fieldset = $(this).parent();
  var next_fieldset = $(this).parent().next("fieldset");
  if(next_fieldset.length === 0) {
    $("#mainForm").submit();
    //Submit form because there's no more fieldsets
  } else {
    current_fieldset.fadeOut(500, function() {
      next_fieldset.fadeIn(500);
    });
  }
});

$("#mainForm").submit(function() {
  var id = animeid;
  addAnimeInList(id, "1", "6", "7");
})

function addAnimeInList(id, episode, status, score, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, comments, tags) {
  
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
  "<comments>" + comments + "</comments>" +
  "<tags>" + comments + "</tags>" +
  "</entry>";
  
  console.log("[ADD] Adding Anime " + id + " as status: " + status + " to list.");
  console.log("[ADD] Watched Episodes: " + episode);
  
  $.ajax({
    url: "http://myanimelist.net/api/animelist/add/" + id + ".xml?data=" + myXML,
    type: "POST",
    username: loginUsername,
    password: loginPassword,
    contentType: "application/x-www-form-urlencoded",
    success: function(ajaxData) {
      console.log("Anime ID " + id + " has been added to " + loginUsername + "'s list!");
    },
    error: function(xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      if(xhr.status == "0") {
        console.log("The Anime is already in the list or doesn't exist!! I think.");
      }
      console.log(thrownError);
    }
  })
};

$("#information_synopsis_toggle").on("click", function() {
  if(information_synopsis_visibility == 1) {
    //Shown - Hide it now
    information_synopsis_visibility = 0;
    document.getElementById("information_synopsis_toggle").innerHTML = "[Show Synopsis]";
    $("#information_synopsis").hide();
  } else {
    //Hidden - Show it now
    information_synopsis_visibility = 1;
    document.getElementById("information_synopsis_toggle").innerHTML = "[Hide Synopsis]"
    $("#information_synopsis").show();
  }
  return false;
});


// --- Second Slide ---

var secondSlide_animeStatus = document.getElementById("anime_stage2_status");
secondSlide_animeStatus.oninput = secondSlide_animeStatus_selector;
secondSlide_animeStatus.onpropertychange = secondSlide_animeStatus.oninput;

function secondSlide_animeStatus_selector() {
  var selectedStatus = secondSlide_animeStatus.value;
  console.log(selectedStatus);
  $("#anime_stage2_episodeInput").show();
  if(selectedStatus == 1) {
    //Watching - Show episode count input
    
  } else if(selectedStatus == 2) {
    //Completed - Show full episode count
  } else if(selectedStatus == 3) {
    //On Hold - Show episode count input
  } else if(selectedStatus == 4) {
    //Dropped - Show episode count input
  } else if(selectedStatus == 6) {
    //Plan to Watch - Show empty episode count
  }
}