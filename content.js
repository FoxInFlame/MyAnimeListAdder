//Content in the app
$("head").append(
  "<link rel='stylesheet' href='http://www.foxinflame.tk/QuickMyAnimeList/source/content.css' type='text/css'>"
);

//Content on website
var username;
var password;
var verified;

var URL_anime;
var anime_name;
var search_result;
var first_result;
var search_result_anime_names = [];
var search_result_anime_ids = [];
var search_result_anime_episodes = [];
var search_result_chosen_anime_episode;

chrome.storage.sync.get({
  username: "Username",
  password: "password123",
  verified: false
}, function(items) {
  username = items.username;
  password = items.password;
  verified = items.verified;
  contentScriptMain();
});

//Main content
String.prototype.contains = function(string) {
  return (this.indexOf(string) != -1);
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function contentScriptMain() {
  if(!window.location.href.contains("episode") || !window.location.href.contains("gogoanime.io")) {
    console.info("[QMAL] QMAL has detected that this page is not an episode, maybe a category or something else?");
    return;
  }
  if(verified === false) {
    $("body").append(
      "<div class='qmal-dialog' id='qmal-dialog-main'>"+
        "<div class='wrapperInside'>" +
          "<div class='dialogContainer'>" +
            "<div class='dialogContent'>" +
              "<div class='dialogContentTitle'>Verify Credentials</div>" +
              "<div class='dialogContentBody'>You have not yet verified your credentials with QMAL. Do so in the options of QMAL. You can then choose to enable in-page QMAL or not.</div>" +
            "</div>" +
            "<div class='dialogActionBar'>" +
              "<a class='qmal-button' id='verify_options_go' href='#'>" +
                "<div class='buttonFlat' id='buttonTwo' fit>GO TO OPTIONS</div>" +
              "</a>"+
            "</div>" +
          "</div>" +
        "</div>" +
        "<div class='overlay'></div>" +
      "</div>"
    );
    $("#verify_options_go").on("click", function(event) {
      window.open(chrome.extension.getURL("options/options_credentials.html"));
      $("#qmal-dialog-main").fadeOut(300);
      return false;
    });
    return;
  }
  if(!$(".anime_video_body")[0]) {
    console.info("[QMAL] QMAL has detected that even though there is 'episode' in the URL, this is not an actual episode website.");
    return;
  }
  if(verified === true) {
    console.log("[QMAL] QMAL has detected that this page is an episode!");
    $("body").append(
      "<div class='qmal-dialog' id='qmal-dialog-main'>"+
        "<div class='wrapperInside'>" +
          "<div class='dialogContainer'>" +
            "<div class='dialogContent'>" +
              "<div class='dialogContentTitle'>Update MyAnimeList?</div>" +
              "<div class='dialogContentBody'>QMAL has detected that this is an anime watching website. You can choose to update the anime status to watching and change the episode count to the current one.</div>" +
            "</div>" +
            "<div class='dialogActionBar'>" +
              "<a class='qmal-button' id='qmal-update-no' href='javascript:void(0)'>" +
                "<div class='buttonFlat' id='buttonOne' fit>DON'T UPDATE</div>" +
              "</a>"+
              "<a class='qmal-button' id='qmal-update-yes' href='javascript:void(0)'>" +
                "<div class='buttonFlat' id='buttonTwo' fit>UPDATE</div>" +
              "</a>"+
            "</div>" +
          "</div>" +
        "</div>" +
        "<div class='overlay'></div>" +
      "</div>" +
      "<div class='qmal-dialog' id='qmal-dialog-updateadd'>"+
        "<div class='wrapperInside'>" +
          "<div class='dialogContainer'>" +
            "<div class='dialogContent'>" +
              "<div class='dialogContentTitle'>Update/Add Information</div>" +
              "<div class='dialogContentBody'><form>" +
                "<div class='input-field' id='qmal-update-list-name-div'>" +
                  "<input type='text' value='Username\'s list' disabled width='100%' id='qmal-update-list-name' name='qmal-update-list-name' style='cursor:pointer'>" +
                  "<label for='qmal-update-list-name' class='active'>List</label>" +
                "</div>" +
                "<div class='input-field'>" +
                  "<input type='text' value='Anime could not be detected' disabled id='qmal-update-anime-name' name='qmal-update-anime-name' style='width:250px;overflow:hidden'>" +
                  "<label for='qmal-update-anime-name' class='active'>Anime Name</label>" +
                  "<a class='qmal-button' id='qmal-update-name-not-this' style='width:202px;margin-bottom:15px;display:inline;' href='javascript:void(0)'><div class='buttonFlat' fit>Not the Correct Anime?</div></a>" +
                "</div>" +
                "<span style='font-size:0.9rem;color:red' id='qmal-update-anime-name-warning'></span>" +
                "<div class='input-field'>" +
                  "<input type='text' value='1' width='50px' id='qmal-update-anime-episodes' name='qmal-update-anime-episodes'>" +
                  "<label for='qmal-update-anime-episodes' class='active'>Episode Count</label>" +
                "</div>" +
                "<span style='font-size:0.9rem;color:red' id='qmal-update-anime-episodes-warning'></span><br>" +
                "<div class='input-field' id='qmal-update-anime-episodes-isCompleted'>" +
                  "<label for='qmal-update-anime-episodes-isCompleted-checkbox'>Set as completed?</label>" +
                  "<input type='checkbox' checked id='qmal-update-anime-isCompleted-checkbox'>" +
                "</div>" +
                "<span style='font-size:0.9rem;color:rgba(0, 0, 0, 0.60)'>* If you want to add more options, please use the popup window instead by clicking on the icon at the top of your browser.</span><br>" +
              "</form></div>" +
            "</div>" +
            "<div class='dialogActionBar'>" +
              "<a class='qmal-button' id='qmal-update-cancel' href='javascript:void(0)'>" +
                "<div class='buttonFlat' id='qmal-update-cancel' fit>CANCEL</div>" +
              "</a>"+
              "<a class='qmal-button' id='qmal-update-update' href='javascript:void(0)'>" +
                "<div class='buttonFlat' id='qmal-update-update' fit>UPDATE</div>" +
              "</a>"+
            "</div>" +
          "</div>" +
        "</div>" +
        "<div class='overlay'></div>" +
      "</div>" +
      "<div class='qmal-dialog' id='qmal-dialog-loading'>"+
        "<div class='wrapperInside'>" +
          "<div class='dialogContainer'>" +
            "<div class='dialogContent'>" +
              "<div class='dialogContentTitle'>Update/Add Information</div>" +
              "<div class='dialogContentBody'>" +
                "<span id='qmal-dialog-loading-span'>Loading...</span>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
        "<div class='overlay'></div>" +
      "</div>"
    );
    $("#qmal-dialog-updateadd").hide();
    $("#qmal-dialog-loading").hide();
    $("#qmal-update-anime-name-warning").hide();
    $("#qmal-update-anime-episodes-warning").hide();
    $("#qmal-update-anime-episodes-isCompleted").hide();
    $("#qmal-update-yes").on("click", function(event) {
      $("#qmal-dialog-main").fadeOut(300);
      $("#qmal-dialog-updateadd").fadeIn(300);
      var error = 0;
      // Try and get Anime Name
      var URL_anime;
      if(window.location.href.contains("gogoanime")) {
        URL_anime = window.location.href.split("/");
        URL_anime = URL_anime[URL_anime.length - 1];
        URL_anime_parts = URL_anime.split("-");
        // Repeat 2 times for removing both "episode" and the number
        URL_anime_parts.splice(-1, 1);
        URL_anime_parts.splice(-1, 1);
        anime_name = URL_anime_parts;
        anime_name = anime_name.join("+").capitalizeFirstLetter();
        URL_anime_parts = URL_anime.split("-");
        anime_episode = URL_anime_parts[URL_anime_parts.length - 1];
        console.info("[QMAL] QMAL has detected that you are watching " + anime_name);
        $("#qmal-update-list-name").val(username + "'s List");
        $("#qmal-update-anime-name").val(anime_name);
        $("#qmal-update-anime-episodes").val(anime_episode);
        $.ajax({
          url: "http://myanimelist.net/api/anime/search.xml?q=" + anime_name,
          contentType: "application/xml",
          async: false,
          dataType: "xml",
          type: "GET",
          username: username,
          password: password,
          error: function(jqXHR, textStatus, errorThrown) {
            console.warn("[QMAL] AJAX Aborted:");
            console.info("       Error Type: " + jqXHR);
            console.info("       Error Status: " + textStatus);
            console.info("       Error HTML: " + errorThrown);
            search_result = "ERROR";
            first_result = "ERROR";
          },
          success: function(data) {
            var x2js = new X2JS();
            console.log("var data = ");
            console.log(data);
            dataJSON = x2js.xml2json(data);
            console.log("var dataJSON = ");
            console.log(dataJSON);
            search_result = dataJSON.anime;
            console.log("var search_reult = ");
            console.log(search_result);
            if($.isArray(search_result.entry)) {
              first_result = dataJSON.anime.entry;
              console.log("No.");
            } else {
              dataJSON.anime.entry["0"] = dataJSON.anime.entry;
              console.log("Yes.");
            }
            console.log("var first_result = ");
            console.log(first_result);
            console.log(first_result.length);
            for(var i = 0; i < first_result.length; i++) {
              search_result_anime_names.push(first_result[i].title);
              search_result_anime_ids.push(first_result[i].id);
              search_result_anime_episodes.push(first_result[i].episodes);
            }
          }
        });
        if(first_result == "ERROR") {
          $("#qmal-update-anime-name").val("Could not find Anime. Try again later.");
          error = 1;
        } else {
          $("#qmal-update-anime-name").val(search_result_anime_ids[0] + " : " + search_result_anime_names[0]);
          search_result_chosen_anime_episode = search_result_anime_episodes[0];
          error = 0;
        }
      }
      
      // Cancel click on second popup
      $("#qmal-update-cancel").on("click", function() {
        $("#qmal-dialog-updateadd").fadeOut(300);
        $("#qmal-dialog-main").fadeIn(300);
        return false;
      });
      
      // Name click, edit credentials
      $("#qmal-update-list-name-div").on("click", function() {
        window.open(chrome.extension.getURL("options/options_credentials.html"));
      });
      var i = 0;
      var clickcount = 0;
      
      // Not this button, change input
      $("#qmal-update-name-not-this").on("click", function() {
        clickcount = clickcount + 1;
        if(clickcount == 5 || clickcount == 10 || clickcount > 20) {
          $("#qmal-update-anime-name-warning").show();
          $("#qmal-update-anime-name-warning").html("If you cannot find your anime, it is probably not in MyAnimeList. Try adding from the popup window.<br>");
        } else {
          $("#qmal-update-anime-name-warning").hide();
          $("#qmal-update-anime-name-warning").html("");
        }
        i = i + 1;
        i = i % search_result_anime_ids.length;
        $("#qmal-update-anime-name").val(search_result_anime_ids[i] + " : " + search_result_anime_names[i]);
        search_result_chosen_anime_episode = search_result_anime_episodes[i];
      });
      
      $("#qmal-update-anime-episodes").on("input", function(e) {
        if(isNaN($(this).val())) {
          // is not NUMBER
          $("#qmal-update-anime-episodes-isCompleted").hide();
          $("#qmal-update-anime-episodes-warning").show();
          $("#qmal-update-anime-episodes-warning").html("Please enter a number. Not alphabet or symbols!<br>");
          error = 1;
        } else if(parseInt($(this).val()) > search_result_chosen_anime_episode) {
          // Is bigger than total episode count
          $("#qmal-update-anime-episodes-isCompleted").hide();
          $("#qmal-update-anime-episodes-warning").show();
          $("#qmal-update-anime-episodes-warning").html("The number of episode for this anime should be less than or equal to " + search_result_chosen_anime_episode + "<br>");
          error = 1;
        } else if(parseInt($(this).val()) == search_result_chosen_anime_episode) {
          // Set as completed?
          $("#qmal-update-anime-episodes-isCompleted").show();
        } else {
          $("#qmal-update-anime-episodes-isCompleted").hide();
          $("#qmal-update-anime-episodes-warning").hide();
          $("#qmal-update-anime-episodes-warning").html("");
          error = 0;
        }
      });
      return false;
    });
    $("#qmal-update-no").on("click", function() {
      $("#qmal-dialog-main").fadeOut(300);
      return false;
    });
    $(".qmal-dialog input[type=text]").on("focus", function() {
      $(this).next().addClass("active");
    });
    $(".qmal-dialog input[type=text]").on("focusout", function() {
      if(this.value === "" && !$(this).attr("placeholder")) {
        $(this).next().removeClass("active");
      }
    });
    
    $("#qmal-update-update").on("click", function() {
      $("#qmal-dialog-updateadd").fadeOut(300);
      $("#qmal-dialog-loading").fadeIn(300);
      var anime_update_status;
      var animeUpdateChosenID = $("#qmal-update-anime-name").val().split(" : ")[0];
      var animeUpdateChosenEpisodes = $("#qmal-update-anime-episodes").val();
      if(animeUpdateChosenEpisodes == search_result_chosen_anime_episode) {
        // It's the last episode! Oh my god! Need to set it as completed now!
      }
      $.ajax({
        url: "http://myanimelist.net/malappinfo.php?u="+username+"&status=all&type=anime",
        type: "GET",
        dataTpe: "xml",
        success: function(data) {
          $("anime", data).each(function(){
            if($("series_animedb_id", this).text() == animeUpdateChosenID) {
              console.log("found it!");
              // It's in the list! And it's in this "each" module
              anime_update_status = "update";
              return false;
            } else {
              // It's not in this "each" module, but it could be in the list!
              anime_update_status = "add";
            }
          });
          console.log(anime_update_status);
          chrome.runtime.sendMessage({
            updateStatus: anime_update_status,
            id: animeUpdateChosenID,
            episodes: animeUpdateChosenEpisodes
          }, function(response) {
            $("#qmal-dialog-loading-span").html("Successfully " + response.answer + "!");
            window.setTimeout(function() {
              $("#qmal-dialog-loading").fadeOut(300);
            }, 1000)
          });
        }
      });
    })
    return;
  }
}