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

getChromeStorage();

var badge_timer = window.setTimeout(updateBadge, 1000);

// Get badge options, and username/password/verified status
function getChromeStorage() {
  chrome.storage.sync.get({
    // ---- Default credentials when none are specified
    username: "Username",
    password: "password123",
    verified: false,
    badge_enable: false,
    badge_interval: "5",
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
  });
}

function updateBadge() {
  getChromeStorage();
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
    window.setTimeout(updateBadge, badge_interval * 1000);
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
    window.setTimeout(updateBadge, badge_interval * 1000);
    return;
  }
  
  $.ajax({
    url: "http://myanimelist.net/malappinfo.php?u="+loginUsername+"&status=all&type=anime",
    type: "GET",
    dataTpe: "xml",
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
    badge_count = count_total;
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
  badge_timer = window.setTimeout(updateBadge, badge_interval * 1000);
  return;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var response;
    if(request.updateStatus == "add") {
      response = addAnimeInList(request.id, request.episodes, "1");
    } else if(request.updateStatus == "update") {
      response = updateAnimeInList(request.id, request.episodes, "1");
    }
    sendResponse({
      answer: response
    });
  }
);
// ---- Update anime function
function updateAnimeInList(id, episode, status) {
  
  var editXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + episode + "</episode>" +
  "<status>" + status + "</status>" +
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
function addAnimeInList(id, episode, status) {
  
  var myXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + episode + "</episode>" +
  "<status>" + status + "</status>" +
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