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
  if(!window.location.href.contains("episode")) {
    console.log("[QMAL] QMAL has detected that this page is not an episode, maybe a category or something else?");
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
              "<a class='qmal-button' id='qmal-update-no' href='#'>" +
                "<div class='buttonFlat' id='buttonOne' fit>DON'T UPDATE</div>" +
              "</a>"+
              "<a class='qmal-button' id='qmal-update-yes' href='#'>" +
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
                "<div class='input-field'>" +
                  "<input type='text' value='Your Username' disabled width='100%' id='qmal-update-list-name' name='qmal-update-list-name' style='cursor:pointer'>" +
                  "<label for='qmal-update-list-name' class='active'>Username</label>" +
                "</div>" +
                "<div class='input-field'>" +
                  "<input type='text' value='Anime could not be detected' disabled id='qmal-update-anime-name' name='qmal-update-anime-name' style='width:250px;overflow:hidden'>" +
                  "<label for='qmal-update-anime-name' class='active'>Anime Name</label>" +
                  "<a class='qmal-button' id='qmal-update-name-not-this' style='width:202px;margin-bottom:15px;display:inline;' href='#'><div class='buttonFlat' fit>Not the Correct Anime?</div></a>" +
                "</div>" +
                "<div class='input-field'>" +
                  "<input type='text' value='1' width='50px' id='qmal-update-anime-episodes' name='qmal-update-anime-episodes'>" +
                  "<label for='qmal-update-anime-episodes' class='active'>Episode Count</label>" +
                "</div>" +
              "</form></div>" +
            "</div>" +
            "<div class='dialogActionBar'>" +
              "<a class='qmal-button' id='qmal-update-cancel' href='#'>" +
                "<div class='buttonFlat' id='qmal-update-cancel' fit>CANCEL</div>" +
              "</a>"+
              "<a class='qmal-button' id='qmal-update-update' href='#'>" +
                "<div class='buttonFlat' id='qmal-update-update' fit>UPDATE</div>" +
              "</a>"+
            "</div>" +
          "</div>" +
        "</div>" +
        "<div class='overlay'></div>" +
      "</div>"
    );
    $("#qmal-dialog-updateadd").hide();
  
    $("#qmal-update-yes").on("click", function(event) {
      $("#qmal-dialog-main").fadeOut(300);
      $("#qmal-dialog-updateadd").fadeIn(300);
      // Try and get Anime Name
      var URL_anime;
      if(window.location.href.contains("gogoanime")) {
        URL_anime = window.location.href.split("/");
        URL_anime = URL_anime[URL_anime.length - 1];
        URL_anime_parts = URL_anime.split("-");
        //Repeat 2 times for removing both "episode" and the number
        URL_anime_parts.splice(-1, 1);
        URL_anime_parts.splice(-1, 1);
        anime_name = URL_anime_parts;
        anime_name = anime_name.join("+").capitalizeFirstLetter();
        console.log("[QMAL] QMAL has detected that you are watching " + anime_name);
        $("#qmal-update-list-name").val(username + "'s List");
        $("#qmal-update-anime-name").val(anime_name);
        $.ajax({
          url: "http://myanimelist.net/api/anime/search.xml?q=" + anime_name,
          contentType: "application/xml",
          async: false,
          dataType: "xml",
          type: "GET",
          username: username,
          password: password,
          error: function(jqXHR, textStatus, errorThrown) {
            console.log("[QMAL] AJAX Aborted:");
            console.log("       Error Type: " + jqXHR);
            console.log("       Error Status: " + textStatus);
            console.log("       Error HTML: " + errorThrown);
            search_result = "ERROR";
            first_result = "ERROR";
          },
          success: function(data) {
            search_result = data.getElementsByTagName("anime")[0];
            first_result = search_result.getElementsByTagName("entry")[0];
          }
        });
        if(first_result == "ERROR") {
          $("#qmal-update-anime-name").val("Could not find Anime. Try again later.");
        } else {
          $("#qmal-update-anime-name").val(first_result.getElementsByTagName("title")[0].innerHTML);
        }
      }
      return false;
    });
    $("#qmal-update-no").on("click", function() {
      $("#qmal-dialog-main").fadeOut(300);
      return false;
    });
    $(".qmal-dialog input[type=text]").on("focus", function() {
      $("input[type=text] + label").addClass("active");
    });
    $(".qmal-dialog input[type=text]").on("focusout", function() {
      if(this.value === "" && !$(this).attr("placeholder")) {
        $(".qmal-dialog input[type=text] + label").removeClass("active");
      }
    });
    
    //Second popup
    $("#qmal-update-cancel").on("click", function() {
      $("#qmal-dialog-updateadd").fadeOut(300);
      $("#qmal-dialog-main").fadeIn(300);
      return false;
    });
    $("#qmal-update-list-name").on("click", function() {
      window.open(chrome.extension.getURL("options/options_credentials.html"));
    });
    return;
  }
}