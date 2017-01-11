// Variables and basic initializations and functions
var loginUsername,
    loginPassword,
    popup_action_open,
    popup_theme,
    popup_mcss_options = {},
    popup_input_rating,
    popup_input_rewatching,
    popup_input_tags,
    popup_input_storageType,
    popup_action_confirm;
    


function insertJS(jsLink) {
  $.getScript(jsLink).fail(function(jqxhr, settings, exception) {
    console.log("$.getScript returned an error with " + jsLink + "! Details:");
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
    user_username: "ExampleAccoun",
    user_password: "Password123",
    user_verified: false,
    popup_action_open: 1,
    popup_input_rating: true,
    popup_input_rewatching: true,
    popup_input_tags: true,
    popup_input_storageType: false,
    popup_action_confirm: true,
    popup_theme: 2,
    popup_mcss_options: {
      dynamic_colors: true,
      show_details: false
    }
  }, function(items) {
    loginUsername = items.user_username;
    loginPassword = items.user_password;
    verified = items.user_verified;
    popup_action_open = items.popup_action_open;
    popup_input_rating = items.popup_input_rating;
    popup_input_rewatching = items.popup_input_rewatching;
    popup_input_tags = items.popup_input_tags;
    popup_input_storageType = items.popup_input_storageType;
    popup_action_confirm = items.popup_action_confirm;
    popup_theme = items.popup_theme;
    popup_mcss_options = items.popup_mcss_options;
    if(verified !== true) {
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
        enableCSS("popups/qmal_popup_MaterializeCSS.css");
        enableCSS("libraries/Google/MaterialIcons.css");
        enableCSS("libraries/MaterializeCSS/materialize.min.css");
        enableCSS("libraries/RateYo/jquery.rateyo.min.css");
        enableCSS("libraries/Select2/select2.min.css");
        $("#qmal_popup_mainContent").load("popups/qmal_popup.html #qmal_popup_mainContentLoad");
        insertJS("libraries/Bez/jquery.bez.min.js");
        insertJS("libraries/QuickFit/jquery.quickfit.js");
        insertJS("libraries/ColorThief/color-thief.min.js");
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
      window.open("https://myanimelist.net/animelist/" + loginUsername);
    } else if(popup_action_open == 5) {
      //Homepage in new tab
      window.open("https://myanimelist.net");
    } else if(popup_action_open == 6) {
      //QuickMAL Popup in panel
      window.close();
      chrome.windows.create({'url': 'popups/qmal_popup_panel.html', 'height':600, 'width':500, 'type':'panel'}, function(window) {
        console.log(window.id);
      });
    }
  });
});