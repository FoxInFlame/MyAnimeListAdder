var number = 0;
var username;
var password;
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

getChromeStorage();
window.setTimeout(updateBadge, 1000);
window.setTimeout(updateBadge, 3000);

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
    return "Badge Set : Not Verified";
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
    return "Badge Set : Not Enabled";
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
      $("anime", data).each(function() {
        if($("my_status", this).text() == "1") {
          count_watching++;
        } else if($("my_status", this).text() == "2") {
          count_completed++;
        } else if($("my_status", this).text() == "3") {
          count_onhold++;
        } else if($("my_status", this).text() == "4") {
          count_dropped++;
        } else if($("my_status", this).text() == "6") {
          count_planned++;
        }
        count_total++;
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
  window.setTimeout(function() {
  	updateBadge();
  }, badge_interval * 1000);
  return "Badge Set : " + badge_count.toString() + " " + badge_text + " in color #" + badge_color;
}