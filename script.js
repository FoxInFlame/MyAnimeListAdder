// Variables and basic initializations and functions
var loginUsername;
var loginPassword;

var popup_action_open,
    popup_input_rating,
    popup_input_rewatching,
    popup_input_tags,
    popup_input_storageType,
    popup_action_confirm,
    popup_theme;

function insertJS(rootjsLink) {
  $.getScript(rootjsLink).fail(function( jqxhr, settings, exception ) {
    console.log("$.getScript returned an error with " + rootjsLink + "! Details:");
    console.log(jqxhr);
    console.log(settings);
    console.log(exception);
  });
}
function enableCSS(cssLink) {
  var linkElement = $("link[href='" + cssLink + "']");
  if(linkElement.length !== 0) {
    linkElement.removeAttr("disabled");
    return;
  }
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssLink;
  link.media = "all";
  head.appendChild(link);
}
function disableCSS(cssLink) {
  $("link[href='" + cssLink + "']").attr("disabled", "disabled");
}
// -- Document Ready Function
$(document).ready(function() {
  // -- Get the usernames stored on Chrome Settings
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
    if(verified === false) {
      $("body").html("You have not verified your credentials. Do so in the options.");
      return false;
    }
    if(popup_action_open == 1) {
      if(popup_theme == 1) {
        enableCSS("libraries/Bootstrap/bootstrap.min.css");
        enableCSS("libraries/MaterialBootstrap/mdb.min.css");
        enableCSS("libraries/RateYo/jquery.rateyo.min.css");
        enableCSS("libraries/Select2/select2.min.css");
        $("#qmal_popup_mainContent").load("popups/qmal_popup_1.2.1.html #qmal_popup_mainContentLoad");
        insertJS("libraries/Select2/select2.full.min.js");
        insertJS("popups/qmal_popup_1.2.1.js");
        return false;
      } else if(popup_theme == 2) {
        //QuickMAL Popup
        disableCSS("libraries/Bootstrap/bootstrap.min.css");
        disableCSS("styles.css");
        enableCSS("https://f3a7a1b1655de4833e3bed3b1779c5a9d85839f8.googledrive.com/host/0BxjwQr0BBXs-aDYxM2JlaFM2bnM");
        enableCSS("popups/qmal_popup_MaterializeCSS.css");
        enableCSS("libraries/Google/MaterialIcons.css");
        enableCSS("libraries/MaterializeCSS/materialize.min.css");
        enableCSS("libraries/RateYo/jquery.rateyo.min.css");
        enableCSS("libraries/Select2/select2.min.css");
        $("#qmal_popup_mainContent").load("popups/qmal_popup.html #qmal_popup_mainContentLoad");
        insertJS("libraries/Bez/jquery.bez.min.js");
        insertJS("libraries/QuickFit/jquery.quickfit.js");
        insertJS("popups/qmal_popup.js");
      }
    } else if(popup_action_open == 2) {
      //List embed in Popup
      insertJS("popups/list_popup.js");
    } else if(popup_action_open == 3) {
      //QuickMAL List in Popup
      $("#qmal_popup_mainContent").load("popups/qmallist_popup.html #qmal_popup_mainContentLoad");
      insertJS("popups/qmallist_popup.js");
    } else if(popup_action_open == 4) {
      //List in new tab
      window.open("http://myanimelist.net/animelist/" + loginUsername);
    } else if(popup_action_open == 5) {
      //Homepage in new tab
      window.open("http://myanimelist.net");
    }
  });
});