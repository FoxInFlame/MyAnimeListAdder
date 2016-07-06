// Variables and basic initializations and functions
var loginUsername;
var loginPassword;

var popup_action_open,
    popup_input_rating,
    popup_input_rewatching,
    popup_input_tags,
    popup_input_storageType,
    popup_action_confirm;


function insertCSS(cssLink) {
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssLink;
  link.media = "all";
  head.appendChild(link);
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
    popup_action_confirm: true
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
    if(verified === false) {
      $("body").html("You have not verified your credentials. Do so in the options.");
      return false;
    }
    if(popup_action_open == 1) {
      //QuickMAL Popup
      insertCSS("libraries/MaterialBootstrap/mdb.min.css");
      insertCSS("libraries/RateYo/jquery.rateyo.min.css");
      insertCSS("libraries/Select2/select2.min.css");
      $("#qmal_popup_mainContent").load("popups/qmal_popup.html #qmal_popup_mainContentLoad");
      $.getScript("popups/qmal_popup.js").fail(function( jqxhr, settings, exception ) {
        console.log("$.getScript returned an error! Details:");
        console.log(jqxhr);
        console.log(settings);
        console.log(exception);
      });
    } else if(popup_action_open == 2) {
      //List embed in Popup
      $.getScript("popups/list_popup.js").fail(function( jqxhr, settings, exception ) {
        console.log("$.getScript returned an error! Details:");
        console.log(jqxhr);
        console.log(settings);
        console.log(exception);
      });;
    } else if(popup_action_open == 3) {
      //QuickMAL List in Popup
      $("#qmal_popup_mainContent").load("popups/qmallist_popup.html #qmal_popup_mainContentLoad");
      $.getScript("popups/qmallist_popup.js").fail(function( jqxhr, settings, exception ) {
        console.log("$.getScript returned an error! Details:");
        console.log(jqxhr);
        console.log(settings);
        console.log(exception);
      });;
    } else if(popup_action_open == 4) {
      //List in new tab
      window.open("http://myanimelist.net/animelist/" + loginUsername);
    } else if(popup_action_open == 5) {
      //Homepage in new tab
      window.open("http://myanimelist.net");
    }
  });
});