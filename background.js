var number = 0;
var loginUsername;
var loginPassword;
var verified;
var badge_interval;
var badge_color;
var badge_count;
var badge_text;

var count_watching = 0;
var count_completed = 0;
var count_onhold = 0;
var count_dropped = 0;
var count_planned = 0;
var count_total = 0;

var initial = 1;

chrome.runtime.onInstalled.addListener(function() {
  getChromeStorage(function() {
    chrome.alarms.create("updateBadge", {
      when: Date.now() + 1000
    });
  });
});
chrome.runtime.onStartup.addListener(function() {
  getChromeStorage(function() {
    chrome.alarms.create("updateBadge", {
      when: Date.now() + 1000
    });
  });
});
chrome.alarms.onAlarm.addListener(function(alarm) {
  if(alarm.name === "updateBadge") {
    updateBadge();
  }
});

function twitter_post(status) {
  chrome.storage.sync.get({
    "twitter_oauth_token": "",
    "twitter_oauth_token_secret": "",
    "twitter_screen_name": ""
  }, function(data) {
    if(data.twitter_oauth_token === "" || data.twitter_oauth_token_secret === "") {
      return;
    }
    $.ajax({
      url: "http://www.foxinflame.tk/QuickMyAnimeList/source/twitter.php?from=" + chrome.runtime.id,
      method: "GET",
      type: "data/json",
      success: function(consumerdata) {
        var codebird = new Codebird;
        var consumer_key = consumerdata.consumer_key;
        var consumer_secret = consumerdata.consumer_secret;
        codebird.setConsumerKey(consumer_key, consumer_secret);
        codebird.setToken(data.twitter_oauth_token, data.twitter_oauth_token_secret);
        codebird.__call(
          "statuses_update",
          {
            "status": status
          },
          function(reply) {
            console.log("A tweet was posted to " + reply.user.screen_name);
            console.log(reply.text);
            if(reply.truncated) {
              console.log("It was truncated.");
            }
            console.log(reply);
          }
        );
      }
    });
  });
}

// Get badge options, and username/password/verified status
function getChromeStorage(callback) {
  chrome.storage.sync.get({
    // ---- Default credentials when none are specified
    username: "Username",
    password: "password123",
    verified: false,
    badge_enable: false,
    badge_interval: "300",
    badge_color: "#5be825",
    badge_count: "1"
  }, function(items) {
    loginUsername = items.username;
    loginPassword = items.password;
    verified = items.verified;
    badge_enable = items.badge_enable;
    badge_interval = items.badge_interval;
    badge_color = items.badge_color;
    badge_count = items.badge_count;
    initial = 0;
    if(callback) {
      callback();
    }
  });
}
function updateBadge() {
  getChromeStorage(function() {
    if(verified === false) {
      chrome.browserAction.setIcon({
        path: "icon_disabled.png"
      });
      chrome.browserAction.setBadgeBackgroundColor({
        //color: "#FF0000"
        color: "#949494"
      });
      chrome.browserAction.setBadgeText({
        text: ". . ."
      });
      chrome.alarms.create("updateBadge", {
        when: Date.now() + 1000
      });
      return;
    } else {
      chrome.browserAction.setIcon({
        path: "icon.png"
      });
    }
  
    if(badge_enable === false) {
      chrome.browserAction.setBadgeText({
        text: ""
      });
      chrome.alarms.create("updateBadge", {
        when: Date.now() + 1000
      });
      return;
    }
    
    $.ajax({
      url: "https://myanimelist.net/malappinfo.php?u="+loginUsername+"&status=all&type=anime",
      type: "GET",
      dataTpe: "xml",
      async: false, // Important -> Sets to 0 if not because it goes over the AJAX
      success: function(data) {
        count_watching = 0;
        count_completed = 0;
        count_onhold = 0;
        count_dropped = 0;
        count_planned = 0;
        count_total = 0;
        $("myinfo", data).each(function() {
          count_watching = $("user_watching", this).text();
          count_completed = $("user_completed", this).text();
          count_onhold = $("user_onhold", this).text();
          count_dropped = $("user_dropped", this).text();
          count_planned = $("user_plantowatch", this).text();
        });
        count_total = parseInt(count_watching) + parseInt(count_completed) + parseInt(count_onhold) + parseInt(count_dropped) + parseInt(count_planned);
      }
    });
    if(badge_count == 1) {
      badge_count = count_watching;
      badge_text = "Animes Watching";
    } else if(badge_count == 2) {
      badge_count = count_completed;
      badge_text = "Animes Completed";
    } else if(badge_count == 3) {
      badge_count = count_onhold;
      badge_text = "Animes On Hold";
    } else if(badge_count == 4) {
      badge_count = count_dropped;
      badge_text = "Dropped Animes";
    } else if(badge_count == 6) {
      badge_count = count_planned;
      badge_text = "Animes Planned to Watch";
    } else if(badge_count == 7) {
      badge_count = count_total.toString();
      badge_text = "Total Animes In List";
    }
    chrome.browserAction.setBadgeBackgroundColor({
      color: badge_color
    });
    chrome.browserAction.setBadgeText({
      text: badge_count.toString()
    });
    chrome.browserAction.setTitle({
      title: badge_count.toString() + " " + badge_text
    });
    chrome.alarms.create("updateBadge", {
      when: Date.now() + (badge_interval * 1000)
    });
    badge_timer = window.setTimeout(updateBadge, badge_interval * 1000);
    return;
  });
}

var animeId_panel;
var animeTitle_panel;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var response;
  var windowStatus = false;
  if(request.subject == "openPanel") {
    animeId_panel = request.animeid;
    animeTitle_panel = request.animetitle;
    chrome.windows.create({
      url: "popups/qmal_popup_panel.html",
      height: 600,
      width: 500,
      type: "popup"
    });
    return;
  }
  if(request.subject == "panelInitialized") {
    sendResponse({
      id: animeId_panel,
      title: animeTitle_panel
    });
    animeId_panel = "";
    animeTitle_panel = "";
  }
  if(request.subject == "twitter-post") {
    twitter_post(request.body);
  }
  if(request.updateStatus == "add") {
    response = addAnimeInList({
      id: request.id,
      episodes: request.episodes,
      status: "1",
      startDate: request.startDate,
      finishDate: request.finishDate
    });
  }
  if(request.updateStatus == "update") {
    response = updateAnimeInList({
      id: request.id,
      episodes: request.episodes,
      status: request.status,
      startDate: request.startDate,
      finishDate: request.finishDate
    });
  }
  sendResponse({
    answer: response
  });
});

// ---- Update anime function
function updateAnimeInList(details) {
  
  var editXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + details.episodes + "</episode>" +
  "<status>" + details.status + "</status>";
  if(details.startDate) {
    editXML += "<date_start>" + details.startDate + "</date_start>";
  }
  if(details.finishDate) {
    editXML += "<date_finish>" + details.finishDate + "</date_finish>";
  }
  editXML += "</entry>";
  
  console.log("[UPDATE] Updating Anime " + details.id + " as status: " + details.status + " to list....");
  console.log("[UPDATE] Watched Episodes: " + details.episodes);

  $.ajax({
    url: "https://myanimelist.net/api/animelist/update/" + details.id + ".xml",
    type: "GET",
    data: {"data": editXML},
    username: loginUsername,
    password: loginPassword,
    contentType: "application/xml",
    async: false,
    success: function(ajaxData) {
      console.log("[DONE] Anime ID " + details.id + " has been updated on " + loginUsername + "'s list!");
      error = "Updated";
    },
    error: function(xhr, status, thrownError) {
      if(xhr.status == "0") {
        console.log("The Anime is already in the list or doesn't exist!! I think.");
      }
      error = xhr.responseText;
    }
  });
  
  return error;
}

// ---- Add anime function
function addAnimeInList(details) {
  
  var addXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + details.episodes + "</episode>" +
  "<status>" + details.status + "</status>";
  if(details.startDate) {
    addXML += "<date_start>" + details.startDate + "</date_start>";
  }
  if(details.finishDate) {
    addXML += "<date_finish>" + details.finishDate + "</date_finish>";
  }
  addXML += "</entry>";
  
  console.log("[ADD] Adding Anime " + details.id + " as status: " + details.status + " to list.");
  console.log("[ADD] Watched Episodes: " + details.episodes);
  
  $.ajax({
    url: "https://myanimelist.net/api/animelist/add/" + details.id + ".xml",
    type: "GET",
    data: {"data": addXML},
    username: loginUsername,
    password: loginPassword,
    contentType: "application/xml",
    async: false,
    success: function(ajaxData) {
      console.log("Anime ID " + details.id + " has been added to " + loginUsername + "'s list!");
      error = "Added";
    },
    error: function(xhr, status, thrownError) {
      if(xhr.status == "501") {
        console.log("The Anime is already in the list.");
      }
      error = xhr.responseText;
    }
  })
  return error;
};