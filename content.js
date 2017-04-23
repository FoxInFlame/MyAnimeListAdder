//Content on website
var username;
var password;
var verified;

var URL_anime;
var anime_name;
var search_result;
var first_result;
var result_multiple;
var search_result_anime_names = [];
var search_result_anime_ids = [];
var search_result_anime_episodes = [];
var search_result_anime_url = [];
var search_result_chosen_anime_episode;

var isTop;

String.prototype.replaceAll = function(find, replace) {
  return this.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

// escape metacharacters that can be passed in "find" in replaceAll()
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var update_later = false;

// -- Document Ready Function
$(document).ready(function() {
  // -- Get the usernames stored on Chrome Settings
  console.log("In-page QMAL Initialized!");
  chrome.storage.sync.get({
  // ---- Default credentials when none are specified
    user_username: "ExampleAccount",
    user_password: "Password123",
    user_verified: false,
    inpage_sites: ["gogoanime.io", "kissanime.ru", "crunchyroll.com", "myanimelist.net"],
    inpage_enable: true
  }, function(items) {
    username = items.user_username;
    password = items.user_password;
    verified = items.user_verified;
    inpage_enable = items.inpage_enable;
    inpage_sites = items.inpage_sites;
    inpage_sites.forEach(function(index) {
      if(window.location.href.contains(index)) {
        var location = window.location.href;
        if(location.contains("myanimelist")) {
          if(location.contains("/anime/") || location.contains("/anime.php?id=")) {
            contentScriptMAL_description();
            return;
          }
          if(location.contains("/animelist/")) {
            contentScriptMAL_animelist();
            return;
          }
        }
        $("head").append("<link rel='stylesheet' href='//www.foxinflame.tk/QuickMyAnimeList/source/content.css' type='text/css'>");
        loadStatus();
        if(location.contains("gogoanime.io")) contentScriptGoGoAnime();
        if(location.contains("crunchyroll.com")) contentScriptCrunchyroll();
        if(location.contains("kissanime")) contentScriptKissAnime();
      }
    });
  });
});

function loadStatus() {
  $.ajax({
    url: "https://www.foxinflame.tk/QuickMyAnimeList/source/news.json",
    method: "GET",
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log("Couldn't grab QMAL news: " + textStatus + " : " + errorThrown);
    },
    success: function(data) {
      sortStyleStatus(data);
    }
  });
}

// To copmare arbitary numbers http://stackoverflow.com/questions/7717109/how-can-i-compare-arbitrary-version-numbers
function cmpVersion(a, b) {
    var i, cmp, len, re = /(\.0)+[^\.]*$/;
    a = (a + '').replace(re, '').split('.');
    b = (b + '').replace(re, '').split('.');
    len = Math.min(a.length, b.length);
    for( i = 0; i < len; i++ ) {
        cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
        if( cmp !== 0 ) {
            return cmp;
        }
    }
    return a.length - b.length;
}
function greaterVersion(a, b, c) {
  if(c) {
    return cmpVersion(a, b) >= 0;
  } else {
    return cmpVersion(a, b) > 0;
  }
}
function smallerVersion(a, b, c) {
  if(c) {
    return cmpVersion(a, b) <= 0;
  } else {
    return cmpVersion(a, b) < 0;
  }
}

function sortStyleStatus(data) {
  var messages = data.messages;
  var count = 0;
  messages.forEach(function(data) {
    count++;
    if(!data.priority) data.priority = 1;
    if(!data.style) data.style = "critical";
    if(undefined === data.dismissable) data.dismissable = true;
    if(!data.message) data.message = "Message not specified!";
    $("body").prepend("<div class='qmal-status-alert' id='qmal-status-alert-" + count + "'><span class='qmal-status-alert-span'>" + data.message + "</a></div>");
    element = $("#qmal-status-alert-" + count);
    if(!element) return; // You know, the usual returning.
    
    // Okay, let's sort this.
    if(data.condition) {
      // Condition is specified. At this point only accept version conditions
      conditionVersion = data.condition.substring(14);
      if(conditionVersion == chrome.runtime.getManifest().version) {
        // Condition Fulfilled.
      } else {
        // Condition not Fulfilled.
        $(element).remove();
        return;
      }
    }
    
    // Priorities / z-indexes
    var priority = 10 - parseInt(data.priority);
    $(element).css("z-index", "100" + priority.toString());
    
    // Dismissables
    if(data.dismissable === true) {
      $(element).on("click", function() {
        $(this).fadeOut(300);
      });
    } else {
      $(element).addClass("qmal-status-alert-cannot-dismiss").attr("data-content", "Cannot Dismiss!");
    }
    
    // Style
    $(element).children().addClass(data.style);
  });
}

//Main content
String.prototype.contains = function(string) {
  return (this.indexOf(string) != -1);
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getFormattedDate(date) {
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return month + day + year;
}

function contentScriptMAL_description() {
  $("#profileRows").before("<div class=\"pt0\" id=\"profileRows\" style=\"padding:0\">" +
  "<a href=\"javascript:void(0);\" style=\"border-bottom:none\"><span id=\"openInQMAL\">Open in QMAL</span></a>" +
  "</div>");
  $("#openInQMAL").on("click", function() {
    var animeid;
    var title = $(".page-common #myanimelist .wrapper #contentWrapper .h1 span").html();
    if(window.location.href.contains("/anime/")) animeid = window.location.href.split("/")[4];
    if(window.location.href.contains("/anime.php?id=")) animeid = getParameterByName("id");
    chrome.runtime.sendMessage({
      subject: "openPanel",
      animeid: animeid,
      animetitle: title.trim()
    }, function(response) {});
  });
}

function contentScriptMAL_animelist() {
  var more = $("#list_surround div[id^=more]");
  var style;
  if(more.length === 0) {
    more = $("#list-container tbody.list-item");
    style = "modern";
  } else {
    style = "classic";
  }
  if(style == "classic") {
    $(more).each(function() {
      var moreid = $(this).attr("id").substring(4);
      $(this).prev().find("tr td:contains('More') small a:first-of-type").after(" - <a href=\"javascript:void(0);\" class=\"openInQMAL\" data-id=\"" + moreid + "\">QMAL</a>");
    });
  }
  if(style == "modern") {
    $(more).each(function() {
      var moreid = $(this).find("tr.more-info").attr("id").substring(5);
      $(this).find("tr.list-table-data td.title div.add-edit-more .add").after(" - <span><a href=\"javascript:void(0);\" class=\"openInQMAL\" data-id=\"" + moreid + "\">QMAL</a></span>")
    });
  }
  $(".openInQMAL").on("click", function() {
    var animeid = $(this).data("id");
    chrome.runtime.sendMessage({
      subject: "openPanel",
      animeid: animeid
    }, function(response) {});
  });
}


var dialog_counter = 0;

var QMALdialog = function(option, value, status, time, extra) {
  if(option instanceof jQuery) {
    if(!value && !status && !time && !extra) {
      // If first parameter is a jQuery object, return if that is visible.
      return option.is(":visible");
    } else {
      if(option.find(".qmal-dialog-text").length == 0) throw new Error("Element must be a QMAL dialog element!");
      // Edit the existing dialog
      var dom;
      var action = "";
      if(value !== null) {
        if(value.indexOf(" {$$} ") !== -1) {
          // Contains a set id!
          option.attr("id", value.split(" {$$} ")[0]);
          value = value.split(" {$$} ")[1];
        }
        if(value.indexOf(" [$$] ") !== -1) {
          if(value.split(" [$$] ")[0] == "[null]") {
            option.find(".qmal-dialog-title").remove();
          } else {
            // Contains a title!
            if(option.find(".qmal-dialog-title").length == 0) { // Title didn't exist in previous dialog
              option.find(".qmal-dialog-body").before("<div class='qmal-dialog-title'>" + value.split(" [$$] ")[0] + "</div>");
            } else { // Title did exist in previous dialog, just edit it
              option.find(".qmal-dialog-title").html(value.split(" [$$] ")[0]);
            }
          }
          if(value.split(" [$$] ")[1] != "") { // If body not empty
            // Edit the body
            option.find(".qmal-dialog-body").html(value.split(" [$$] ")[1]);
          }
        } else {
          option.find(".qmal-dialog-body").html(value);
        }
      }
      if(status) {
        if(status.constructor === Array) {
          // The third parameter is an array! => Which means it has some action buttons!
          /*
          [
            {
              "link" => "#",
              "id" => "verify_options_go",
              "text" => "Options"
            }
          ]
          */
          
          if(option.find(".qmal-dialog-actions").length == 0) {
            option.find(".qmal-dialog-text").after("<div class='qmal-dialog-actions'></div>");
          }
          for(var i = 0; i < status.length; i++) {
            if(!status[i].link || !status[i].id || !status[i].text) continue;
            option.find(".qmal-dialog-actions").append("<a class='qmal-dialog-button' id='" + status[i].id + "' href='" + status[i].link + "'>" + status[i].text + "</a>");
          }
          if(time) {
            status = time;
          }
          if(extra) {
            time = extra;
          }
          time = extra;
        } else {
          // Third parameter is normal status - remove current one and replace
          option.attr("class", option.attr("class").replace(/-info/g, "-" + status).replace(/-loading/g, "-" + status).replace(/-warning/g, "-" + status));
        }
      }
      if(option.find(".qmal-dialog-icon").length !== 0) {
        if(status == "info") {
          option.find(".qmal-dialog-icon img")[0].src = chrome.runtime.getURL("images/inpage_icon_info.png");
        } else if(status == "loading") {
          option.find(".qmal-dialog-icon img")[0].src = chrome.runtime.getURL("images/inpage_icon_loading.svg");
        }
      }
      if(!option.is(":visible")) {
        // Show if it's not visible
        QMALdialog("show", option, function() {
          if(time){
            window.setTimeout(function() {
              QMALdialog("hide", option, function() {
               option.remove();
              });
            }, time);
          }
        });
      }
    }
  } else if(option == "show") {
    // If first parameter is "show", take the second variable and show that. Third variable is the optional callback.
    if(!value.hasClass("animated")) value.addClass("animated");
    value.show().addClass("fadeInRight").on("webkitAnimationEnd oanimationEnd msAnimationEnd animationend", function() {
      $(value).off().removeClass("fadeInRight animated");
      var callback = status;
      if(callback) callback();
    });
    return value;
  } else if(option == "hide") {
    // If first parameter is "hide", take the second variable and hide that. Third variable is the optional callback.
    if(!value.hasClass("animated")) value.addClass("animated");
    value.addClass("fadeOutUp").on("webkitAnimationEnd oanimationEnd msAnimationEnd animationend", function() {
      $(value).hide().off().removeClass("fadeOutUp animated");
      var callback = status;
      if(callback) callback();
    });
    return value;
  } else if(option == "count") {
    // If first parameter is "count", return the amount of dialogs visible. (not including hidden ones)
    return $("#qmal-dialogs .qmal-dialog-material:visible").length;
  } else if(option == "dialog") {
    // If first parameter is "dialog", the second parameter is the text. The third will either be an Array (with links), or will be skipped. Fourth is the status, and fifth is the time. Last is an extra incase Arary is specified.
    var nativecounter = dialog_counter;
    dialog_counter++;
    if($("#qmal-dialogs").length === 0) $("body").append("<div id='qmal-dialogs'></div>");
    var dom; // Text part of DOM
    var action = ""; // Action part of DOM
    var id = ""; // ID of the dialog
    var icon_dom = ""; // Icon part of DOM
    
    if(value.indexOf(" {$$} ") !== -1) { // I just chose a combination that would probably never be used in the text
      // Contains a set id!
      id = " id='" + value.split(" {$$} ")[0] + "'";
      value = value.split(" {$$} ")[1];
    }
    if(value.indexOf(" [$$] ") !== -1) { // Another combination
      // Contains a title!
      dom = "<div class='qmal-dialog-title'>" + value.split(" [$$] ")[0] + "</div>" + "<div class='qmal-dialog-body'>" + value.split(" [$$] ")[1] + "</div>";
    } else {
      dom = "<div class='qmal-dialog-body'>" + value + "</div>"
    }
    if(status && status.constructor === Array) {
      // The third parameter is an array! => Which means it has some action buttons!
      action = "<div class='qmal-dialog-actions'>";
      for(var i = 0; i < status.length; i++) {
        if(!status[i].link || !status[i].id || !status[i].text) continue;
        action += "<a class='qmal-dialog-button' id='" + status[i].id + "' href='" + status[i].link + "'>" + status[i].text + "</a>";
      }
      action += "</div>";
      // If the time (status) is defined set the third parameter to status
      if(time) {
        status = time;
      }
      // If the extra (time) is defined set the fourth parameter to time
      if(extra) {
        time = extra;
      }
    }
    if(status == "info") {
      icon_dom = "<div class='qmal-dialog-icon'>" +
                   "<img src='" + chrome.runtime.getURL("images/inpage_icon_info.png") + "'>" +
                 "</div>";
    } else if(status == "loading") {
      icon_dom = "<div class='qmal-dialog-icon'>" +
                   "<img src='" + chrome.runtime.getURL("images/inpage_icon_loading.svg") + "'>" +
                 "</div>";
    }
    if(window.location.href.contains("gogoanime.io")) status += " qmal-dialog-gogoanime";
    if(window.location.href.contains("crunchyroll.com")) status += " qmal-dialog-crunchyroll";
    if(window.location.href.contains("kissanime.ru")) status += " qmal-dialog-kissanime";
    $("#qmal-dialogs").append("<div" + id + " class='qmal-dialog-material qmal-dialog-" + status + "' data-qmal-dialog-id='" + nativecounter.toString() + "'>"+
      "<div class='qmal-dialog-container'>" +
        icon_dom +
        "<div class='qmal-dialog-text'>" +
          dom +
        "</div>" +
        action +
      "</div>" +
    "</div>");
    QMALdialog("show", $("[data-qmal-dialog-id='" + nativecounter.toString() + "']"), function() {
      if(time){
        window.setTimeout(function() {
          QMALdialog("hide", $("[data-qmal-dialog-id='" + nativecounter.toString() + "']"), function() {
           $("[data-qmal-dialog-id='" + nativecounter.toString() + "']").remove();
          });
        }, time);
      }
    });
    return $("[data-qmal-dialog-id='" + nativecounter + "']".toString());
  } else {
    throw new Error("'option' needs to be a valid value!");
  }
}

/*
=====================================================
-----------------------------------------------------
=====================KISSANIME=======================
-----------------------------------------------------
=====================================================
*/

function lookUpPersonalDetails(id, callback) {
  $.ajax({
    url: "https://www.matomari.tk/api/0.4/methods/user.list.anime.ID.php?id=" + id,
    async: true,
    dataType: "json",
    type: "GET",
    cache: true,
    username: username,
    password: password,
    error: function(jqXHR) {
      if(jqXHR.status == 404) {
        // Doesn't exist in list
        callback(false);
      }
    },
    success: function(data) {
      // Does exist in list
      callback(data);
    }
  })
}

function contentScriptKissAnime() {
  $("body").append("<div id='qmal-dialogs'></div>");
  if((!window.location.href.contains("/Episode") && !window.location.href.contains("/Movie") && !window.location.href.contains("/OVA")) ||  !window.location.href.contains("kissanime.ru")) {
    // Check if it's anime main page
    var splitLocation = window.location.href.split("/");
    if(splitLocation.length == 5 || (splitLocation.length == 6 && splitLocation[5] == "") && splitLocation[4] == "Anime") {
      // Detect anime and display information in your list regarding that:
      var detecting = QMALdialog("dialog", "Detecting... [$$] Detecting anime from page DOM...", "loading");
      var anime_name = $("#container .bigBarContainer .barContent .bigChar").text().replace(" (Sub)", "").replace(" (Dub)", "");
      if(anime_name == "") {
        QMALdialog(detecting, "Error [$$] QMAL could not detect the anime from the page.", "warning", 7500);
        return;
      } else {
        QMALdialog(detecting, "Searching... [$$] Detected " + anime_name + ". Searching...", "loading");
      }
      var search_result_data;
      $.ajax({
        url: "https://www.matomari.tk/api/0.3/anime/search/" + anime_name + ".json",
        async: true,
        dataType: "json",
        type: "GET",
        cache: true,
        error: function(jqXHR, textStatus, errorThrown) {
          QMALdialog("dialog", "AJAX Error (" + jqXHR.status + ") [$$] Check the console for more information.", "critical");
          console.error("[QMAL@KissAnime] AJAX Aborted:", jqXHR);
          console.info("Error Status: " + textStatus);
          console.info("Error HTML: " + errorThrown);
        },
        success: function(data) {
          QMALdialog("hide", detecting); // Hide "searching..." dialog
          if(data.error) {
            QMALdialog("dialog", "AJAX Error (200) [$$] " + data.error);
            return;
          } else if(data.results.length == 0) {
            // 0 results
            QMALdialog("dialog", "Search yielded no matching results, unfortunately.", "warning", "7500");
            return;
          }
          search_result_data = data;
        }
      }).complete(function() {
        var select_box = "";
        console.log(search_result_data);
        for(var i = 0; i < search_result_data.results.length; i++) {
          select_box += "<option value=" + search_result_data.results[i].id + ">" + search_result_data.results[i].title + "</option>";
        }
        select_box = "<div class='qmal-dialog-select-wrapper'><select id='qmal-dialog-choose-select'>" + select_box + "</select></div>";
        var is_in_list = false;
        // Only one result
        lookUpPersonalDetails(search_result_data.results[0].id, function(details) {
          console.log(details);
          if(!details) {
            // Not in list
            QMALdialog("dialog", "qmal-dialog-choose {$$} " + select_box + "<br>This anime is not in your list. <a href=''>Add it now</a>.", "info");
          } else {
            var verb = "are watching this anime";
            switch(details.status) {
              case 1:
                verb = "are watching this anime";
                break;
              case 2:
                verb = "have completed this anime";
                break;
              case 3:
                verb = "have this anime on hold";
                break;
              case 4:
                verb = "have dropped this anime";
                break;
              case 6:
                verb = "are planning to watch this anime";
                break;
              default:
              verb = "are watching it";
            }
            if(details.score == "") details.score = "0";
            var choose_dialog = QMALdialog("dialog", "qmal-dialog-choose {$$} " + select_box + "<br><div id='qmal-dialog-choose-info'></div>", "info");
            $('#qmal-dialog-choose-info').html("You <b>" + verb + "</b>. You have watched <span style='color:#ffb63c'><b>" + details.episodes + "</b> episodes</span>, and have rated it <span style='color:#ffb63c'>" + details.score + "</span>/10 so far.");
            $('#qmal-dialog-choose-select').on('change', function() {
              QMALdialog($('#qmal-dialog-choose'), null, "loading");
              lookUpPersonalDetails(this.value, function(otherdetails) {
                QMALdialog($('#qmal-dialog-choose'), null, "info");
                if(!otherdetails) {
                  $('#qmal-dialog-choose-info').html("This anime is not in your list. <a href=''>Add it now</a>.");
                } else {
                  verb = "are watching this anime";
                  switch(otherdetails.status) {
                    case 1:
                      verb = "are watching this anime";
                      break;
                    case 2:
                      verb = "have completed this anime";
                      break;
                    case 3:
                      verb = "have this anime on hold";
                      break;
                    case 4:
                      verb = "have dropped this anime";
                      break;
                    case 6:
                      verb = "are planning to watch this anime";
                      break;
                    default:
                    verb = "are watching it";
                  }
                  if(otherdetails.score == "") otherdetails.score = "0";
                  $('#qmal-dialog-choose-info').html("You <b>" + verb + "</b>. You have watched <span style='color:#ffb63c'><b>" + otherdetails.episodes + "</b> episodes</span>, and have rated it <span style='color:#ffb63c'>" + otherdetails.score + "</span>/10 so far.");
                }
              })
              return false;
            });
          }
        });
      });
    }
    return;
  }
  if(verified === false) {
    QMALdialog("dialog", "Verify Credentials [$$] You have not yet verified your credentials with QMAL. <br>You really should, really. It's for your own good.", [
      {
        "id": "verify_options_go",
        "link": "#",
        "text": "Options"
      }
    ], "warning");
    $("#verify_options_go").on("click", function(event) {
      window.open(chrome.extension.getURL("options/options_credentials.html"));
      return false;
    });
    return;
  }
  if(window.location.href.contains("kissanime") && !$("#containerRoot #container div#divContentVideo")[0]) {
    // There is an episode in the URL, but no video container - might be 5 second loading screen
    // QMALdialog("dialog", "Well then. [$$] Even though there is 'episode' in the URL, it doesn't look like it's an actual watching page. Sucks.", "warning", 10000);
    return;
  }
  if(verified === true) {
    $("#qmal-dialogs").append(
      "<div class='qmal-dialog-material qmal-dialog-kissanime qmal-dialog-info' id='qmal-dialog-main' style='display:none'>" +
        "<div class='qmal-dialog-container'>" +
          "<div class='qmal-dialog-icon'>" +
            "<img src='http://i.imgur.com/I1Ipr8q.png'>" +
          "</div>" +
          "<div class='qmal-dialog-text'>" +
            "<div class='qmal-dialog-title'>Update MyAnimeList?</div>" +
            "<div class='qmal-dialog-body'>QMAL has detected that you are <span id='qmal-detected-verb'>watching</span>:" +
              "<div class='qmal-dialog-select-wrapper qmal-select'><select id='qmal-detected-anime-name'></select></div>" +
              "You can choose to <span id='qmal-detected-action-verb'>add this anime to your list</span> and change the episode count <span style='color:#ffb63c'><span id='qmal-detected-original-episode'></span> to the current one (<b><span id='qmal-detected-episode-text'></span></b>)</span>.</div>" +
          "</div>" +
          "<div class='qmal-dialog-actions'>" +
            "<a class='qmal-dialog-button' id='qmal-update-no' href='javascript:void(0);'>Don't Update</a>" +
            "<a class='qmal-dialog-button' id='qmal-update-later' href='javascript:void(0);'>Remind me Later</a>" +
            "<a class='qmal-dialog-button' id='qmal-update-yes' href='javascript:void(0);'>Update Now</a>" +
          "</div>" +
        "</div>" +
      "</div>" +
      "<div class='qmal-dialog-material qmal-dialog-kissanime qmal-dialog-info' id='qmal-dialog-updateadd' style='display:none'>" +
        "<div class='qmal-dialog-container'>" +
          "<div class='qmal-dialog-text'>" +
            "<div class='qmal-dialog-title'>Edit Information in <a class='qmal-update-list-name' target='_blank' href='" + chrome.extension.getURL("options/options_credentials.html") + "'>" + username + "</a>'s List</div>" +
            "<div class='qmal-dialog-body'><form>" +
              "<div class='input-field'>" +
                "Anime Name: <span id='qmal-update-anime-name'><!--<select id='qmal-update-anime-name'></select>-->" +
              "</div>" +
              "<span style='font-size:0.9rem;color:red;display:inline-block;margin-bottom:16px' id='qmal-update-anime-name-warning'></span>" +
              "<div class='input-field'>" +
                "<input type='text' value='1' width='50px' id='qmal-update-anime-episodes' name='qmal-update-anime-episodes'>" +
                "<label for='qmal-update-anime-episodes' class='active'>Episode Count</label>" +
              "</div>" +
              "<span style='font-size:0.9rem;color:red' id='qmal-update-anime-episodes-warning'></span><br>" +
              "<div class='input-field' id='qmal-update-anime-episodes-isCompleted'>" +
                "<label for='qmal-update-anime-episodes-isCompleted-checkbox'>Set as completed?</label>" +
                "<input type='checkbox' checked id='qmal-update-anime-isCompleted-checkbox'>" +
              "</div>" +
              "<span style='font-size:0.9rem;color:rgba(0, 0, 0, 0.60)'>* If you want to add more options, please use the popup window instead by clicking on the icon at the top of your browser.<br>**By clicking on Update, QMAL will automatically set the status of this anime to Watching, even if it's somewhere else in your list.</span><br>" +
            "</form></div>" +
          "</div>" +
          "<div class='qmal-dialog-actions'>" +
            "<a class='qmal-dialog-button' id='qmal-update-cancel' href='javascript:void(0);'>Cancel</a>" +
            "<a class='qmal-dialog-button' id='qmal-update-update' href='javascript:void(0);'>Update</a>" +
          "</div>" +
        "</div>" +
      "</div>" +
      "<!--<div class='qmal-dialog-material qmal-dialog-kissanime qmal-dialog-success' id='qmal-dialog-loading' style='display:none'>"+
        "<div class='qmal-dialog-container'>" +
          "<div class='qmal-dialog-text'>" +
            "<div class='qmal-dialog-title'>Update/Add Information</div>" +
            "<div class='qmal-dialog-body'>" +
              "<span id='qmal-dialog-loading-span'>Loading...</span>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>-->"
    );
    var error = 0;
    // Try and get Anime Name
    var URL_anime;
    var anime_name;
    var anime_episode;
    if(window.location.href.contains("kissanime")) {
      // Detect the anime and the episode
      var anime_name_element;
      anime_name_element = $("#containerRoot #headnav #navsubbar p a").text().split("\n")[2];
      anime_name = anime_name_element.replace(" (Sub)", "").replace(" (Dub)", "").trim().replaceAll(" ", "+");
      
      URL_anime = window.location.href.split("/");
      URL_anime = URL_anime[URL_anime.length - 1]; // Last item
      if(window.location.href.contains("/Movie")) {
        anime_episode = "1";
      } else if(window.location.href.contains("/Episode")) {
        URL_anime_parts1 = URL_anime.split("?")[0];
        anime_episode = parseInt(URL_anime_parts1.split("-")[1], 10);
        if(isNaN(anime_episode)) anime_episode = "1";
      } else if(window.location.href.contains("/OVA")) {
        anime_episode = "1";
      }
      var detecting = QMALdialog("dialog", "qmal-dialog-loading-detected {$$} QMAL has detected that you are watching " + anime_name + "! Searching...", "loading");
      
      var search_result_data;
      var chosen_search_result;
      // Get correct anime and total count from API.
      $.ajax({
        url: "https://www.matomari.tk/api/0.3/anime/search/" + anime_name + ".json",
        async: true,
        dataType: "json",
        type: "GET",
        cache: true,
        error: function(jqXHR, textStatus, errorThrown) {
          QMALdialog("dialog", "AJAX Error (" + jqXHR.status + ") [$$] Check the console for more information.", "critical");
          console.warn("[QMAL@KissAnime] AJAX Aborted:");
          console.info("                 Error Status: " + textStatus);
          console.info("                 Error HTML: " + errorThrown);
          throw new Error(jqXHR);
        },
        success: function(data) {
          if(data.error) {
            QMALdialog("dialog", "AJAX Error (200) [$$] " + data.error);
            return;
          } else if(data.results.length == 0) {
            // 0 results
            QMALdialog("dialog", "Search yielded no matching results, unfortunately.", "warning", "7500");
            return;
          }
          search_result_data = data;
        }
      }).success(function() {
        var select_box = "";
        console.log(search_result_data);
        chosen_search_result = search_result_data.results[0]; // First one is automatically selected
        for(var i = 0; i < search_result_data.results.length; i++) {
          select_box += "<option data-url='" + search_result_data.results[i].url + "' data-episodes='" + search_result_data.results[i].episodes + "' value='" + search_result_data.results[i].id + "'>" + search_result_data.results[i].type + " - " + search_result_data.results[i].title + "</option>";
        }
        $("#qmal-detected-anime-name").html(select_box); // The one in the main form dialog, the one in the first dialog
        $("#qmal-detected-episode-text").text(anime_episode); // Variable used earlier
        $("#qmal-update-anime-episodes").val(anime_episode); // Can't use text() because it's a <input>
        var is_in_list = false;
        
        // search_result_chosen_anime_episode = search_result_anime_episodes[0];
        
        lookUpPersonalDetails_AnimeEpisode(chosen_search_result.id); // Change text according to first value
        QMALdialog("hide", detecting, function() {
          QMALdialog("show", $("#qmal-dialog-main"));
        });
            
        $("#qmal-detected-anime-name").on("change", function() { // Change text according to selected value, also change 'chosen' variable
          QMALdialog($("#qmal-dialog-main"), null, "loading");
          var elem = this;
          for(var x = 0; x < search_result_data.results.length; x++) {
            if(search_result_data.results[x].id == elem.value) {
              chosen_search_result = search_result_data.results[x];
              lookUpPersonalDetails_AnimeEpisode(search_result_data.results[x].id);
              break;
            }
            continue;
          }
        });
        
        function lookUpPersonalDetails_AnimeEpisode(id) {
          lookUpPersonalDetails(id, function(data) {
            if(data) {
              $("#qmal-detected-original-episode").text("from " + data.episodes);
              var status_string;
              switch(data.status) {
                case 1:
                  status_string = "watching";
                  break;
                case 2:
                  status_string = "completed";
                  break;
                case 3:
                  status_string = "on hold";
                  break;
                case 4:
                  status_string = "dropped";
                  break;
                case 6:
                  status_string = "plan to watch";
                  break;
              }
              $("#qmal-detected-action-verb").text("change the status from '" + status_string + "' to 'watching'");
            } else {
              $("#qmal-detected-original-episode").text("");
              $("#qmal-detected-action-verb").text("add this anime to your list"); // Default value :)
            }
            QMALdialog($("#qmal-dialog-main"), null, "info");
          });
        }
      });
      
    }
    
    $("#qmal-update-anime-name-warning").hide();
    $("#qmal-update-anime-episodes-warning").hide();
    $("#qmal-update-anime-episodes-isCompleted").hide();
    update_later = false;
    $("#qmal-update-later").on("click", function() {
      update_later = true; // Immediately and not in callback because user might try to close before dialog fades away
      QMALdialog("hide", $("#qmal-dialog-main"));
    });
    $("#qmal-update-yes").on("click", function(event) {
      $("#qmal-update-anime-name").html($("#qmal-detected-anime-name :selected").html());
      QMALdialog("hide", $("#qmal-dialog-main"), function() {
        QMALdialog("show", $("#qmal-dialog-updateadd"));
      });
      var error = 0;
      
      // Cancel click on second popup
      $("#qmal-update-cancel").on("click", function() {
        QMALdialog("hide", $("#qmal-dialog-updateadd"), function() {
          QMALdialog("show", $("#qmal-dialog-main"));
        });
        return false;
      });

      var i = 0;
      
      $("#qmal-update-anime-episodes").on("input", function(e) {
        if(isNaN($(this).val())) {
          // is not NUMBER
          $("#qmal-update-anime-episodes-isCompleted").hide();
          $("#qmal-update-anime-episodes-warning").show();
          $("#qmal-update-anime-episodes-warning").html("Please enter a number. Not alphabet or symbols!<br>");
          error = 1;
        } else if(parseInt($(this).val()) > search_result_chosen_anime.episodes) {
          // Is bigger than total episode count
          $("#qmal-update-anime-episodes-isCompleted").hide();
          $("#qmal-update-anime-episodes-warning").show();
          $("#qmal-update-anime-episodes-warning").html("The number of episode for this anime should be less than or equal to " + search_result_chosen_anime.episodes + "<br>");
          error = 1;
        } else if(parseInt($(this).val()) == search_result_chosen_anime.episodes) {
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
      update_later = false;
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
      var updating_dialog;
      QMALdialog("hide", $("#qmal-dialog-updateadd"), function() {
        updating_dialog = QMALdialog("dialog", "qmal-dialog-loading {$$} Add/Update Information [$$] Sending information to MyAnimeList...", "loading");
      });
      var anime_update_status;
      var animeUpdateChosenID = $("#qmal-detected-anime-name").val();
      var animeUpdateChosenEpisodes = $("#qmal-update-anime-episodes").val();
      var animeInformation = {
        id: animeUpdateChosenID,
        episodes: animeUpdateChosenEpisodes
      }
      if(animeUpdateChosenEpisodes == search_result_chosen_anime_episode) {
        // It's the last episode! Oh my god! Need to set it as completed now! mmddyyyy
        animeInformation.finishDate = getFormattedDate(new Date());
        animeInformation.status = "2";
      } else if(animeUpdateChosenEpisodes == "1") {
        // It's the first episode! Set the start date! mmddyyyy
        animeInformation.startDate = getFormattedDate(new Date());
        animeInformation.status = "1";
      }
      $.ajax({
        url: "https://www.matomari.tk/api/0.4/methods/user.list.anime.ID.php?id=" + animeUpdateChosenID,
        username: username,
        password: password,
        type: "GET",
        dataTpe: "json",
        error: function(jqXHR, textStatus, errorThrown) {
          if(jqXHR.status == 404) {
            // Doesn't exist in list
            anime_update_status = "add";
          } else {
            var errorMessage = "";
            if(jqXHR.responseJSON.message) {
              errorMessage = jqXHR.responseJSON.message;
            }
            QMALdialog("dialog", "AJAX Error (" + jqXHR.status + ") [$$] " + errorMessage + "\nCheck the console for more information.", "critical");
            console.warn("[QMAL@KissAnime] AJAX Aborted:");
            console.info(jqXHR);
            console.info("                 Error Status: " + textStatus);
            console.info("                 Error HTML: " + errorThrown);
            throw new Error();
          }
        },
        success: function(data) {
          // Does exist in list
            anime_update_status = "update";
        }
      }).complete(function() {
        animeInformation.updateStatus = anime_update_status;
        chrome.runtime.sendMessage(animeInformation, function(response) {
          update_later = false;
          QMALdialog(updating_dialog, "Information has now successfully been " + response.answer.toLowerCase() + "!", "info");
          chrome.runtime.sendMessage({
            subject: "twitter-post",
            body: "I finished watching episode " + animeInformation.episodes + " on " + $("#qmal-update-anime-name :selected").html() + " #QMAL #Anime"
          }, function(response) {
            if(response.tweeted) {
              QMALdialog("dialog", "Your tweet has been posted!", "success", 4000);
            }
            window.setTimeout(function() {
              QMALdialog("hide", updating_dialog);
            }, 4000);
          });
        });
      });
    });
    
    if($(".video-js#my_video_1").length !== 0) { // If VideoJS was detected (KissAnime player)
      console.log("Detected VideoJS.");
      window.setInterval(checkVideoTime, 10000);
    } else if($("iframe[src*='openload.co']").length !== 0) { // If OpenLoad was detected (OpenLoad player)
      console.log("Detected OpenLoad.");
      isTop = true;
      chrome.runtime.onMessage.addListener(function(details, sender, sendResponse) {
        if(details == "dialog_show") {
          if(update_later === true && !QMALdialog($("#qmal-dialog-main")) && !QMALdialog($("#qmal-dialog-updateadd")) && !QMALdialog($("#qmal-dialog-loading"))) {
            $("#qmal-update-later").hide();
            $("#qmal-detected-verb").text("nearing the end of"); // Change the verb from watching to 'nearing the end of'
            QMALdialog("show", $("#qmal-dialog-main"));
          }
        };
      });
    } else { // If nothing was detected, use the legacy version.
      window.onbeforeunload = function(e) {
        if(update_later === true) {
          $("#qmal-dialog-main").fadeIn(300);
          e.returnValue = "You haven't updated MAL yet...";
          return "You haven't updated MAL yet...";
        }
      }
      return;
    }
    
    
    // Run this function every 10 seconds, if it's the default KissAnime player
    function checkVideoTime() {
      var time = $(".vjs-remaining-time-display").contents().filter(function() {
        return this.nodeType == 3;
      })[0].nodeValue;
      time = parseInt(time.split("-")[1].replaceAll(":", "")); // So 16:12 becomes 1612, 16:10 becomes 1610, 15:59 becomes 1559.
      if(time < 200  && time > 0 && update_later === true && !QMALdialog($("#qmal-dialog-main")) && !QMALdialog($("#qmal-dialog-updateadd")) && !QMALdialog($("#qmal-dialog-loading"))) { // 2 minutes until end of video
        // It also checks if the time is 0, which is what happens before the video loads. Of course, the end of the video will also be skipped, but by then time<200 would've detected it.
        $("#qmal-update-later").hide(); // Hide, no more postponing!
        $("#qmal-detected-verb").text("nearing the end of"); // Change the verb from watching to 'nearing the end of'
        QMALdialog("show", $("#qmal-dialog-main"));
      }
    }
    return;
  }
}