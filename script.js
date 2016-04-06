var animeNameInput = document.getElementById("animeInput");
animeNameInput.oninput = predictAnime;
animeNameInput.onpropertychange = animeNameInput.oninput;

var loginUsername;
var loginPassword;

var animeNamesInList = {};
var animeEnglishNames = {};
var animeSynonyms = {};
var chosenAnimeInList;

function predictAnime() {
  var animeNameInput = document.getElementById("animeInput").value.replace(" ", "+");
  if(animeNameInput === "" || animeNameInput === null) {
    document.getElementById("animeName").innerHTML = "<option disabled selected>Choose an Anime</option>";
    return false;
  }
  chrome.storage.sync.get({
    username: "Username",
    password: "password123"
  }, function(items) {
    loginUsername = items.username;
    loginPassword = items.password;
  });
  $.ajax({
    url: "http://myanimelist.net/api/anime/search.xml?q=" + animeNameInput,
    type: "GET",
    dataType: "xml",
    username: loginUsername,
    password: loginPassword,
    success: function(data) {
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
          animeSynonyms[animeId] =$("synonyms", this).text();
          animeHTML = document.getElementById("animeName").innerHTML;
          animeHTML = animeHTML+"<option>"+animeId+" : "+animeNamesInList[animeId]+"</option>";
          document.getElementById("animeName").innerHTML = animeHTML;
          count++;
        }
      });
    }
  });
}

$(document).ready(function() {
  $("#preview").hide();
  $("#status").hide();
  $("#information").hide();
});

var animeName = document.getElementById("animeName");
animeName.oninput = selectAnime;
animeName.onpropertychange = animeName.oninput;

function selectAnime() {
  //Cover Preview
  $("#preview").show();
  var animeid = document.getElementById("animeName").value.split(":")[0];
  animeid = animeid.slice(0, -1);
  $(".previewCover").attr("id", "more" + animeid);
  var coverImageSource = $(".previewCover").css("background-image");
  coverImageSource = coverImageSource.replace(/[()\"]/g, "");
  coverImageSource = coverImageSource.slice(3);
  $("#previewCoverSize").attr("src", coverImageSource);
  
  //Informations
  $("#information").show();
  document.getElementById("information_originalTitle").innerHTML = animeNamesInList[animeid];
  document.getElementById("information_englishTitle").innerHTML = animeEnglishNames[animeid];
  document.getElementById("information_synonyms").innerHTML = animeSynonyms[animeid];
  
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
          $("#submit_add").html("Already in list!");
          $("#submit_add").prop("disabled", true);
          return false;
        } else {
          //It could be in the list, but not in this particular "each"
          $("#status_status").html("Not in list!");
          $("#status_episodecount").hide();
          $("#submit_add").html("Submit");
          $("#submit_add").prop("disabled", false);
        }
      });
    }
  });
}