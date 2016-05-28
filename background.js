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
var badge_timer = window.setTimeout(updateBadge, 1000);

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
  badge_timer = window.setTimeout(updateBadge, badge_interval * 1000);
  return;
}

// ---- Update anime function
function updateAnimeInList(id, episode, status, score, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags) {
  
  var variables = ["id", "episodes", "status", "score", "storage_type", "storage_value", "times_rewatched", "rewatch_value", "date_start", "date_finish", "priority", "enable_discussion", "enable_rewatching", "tags"];
  
  var submitVars = {}; //Creates an object
  for(var i = 0; i < variables.length; i++) {
    submitVars[variables[i]] = submit[variables[i]];
    if(submitVars[variables[i]] == "0" || submitVars[variables[i]] == null) {
      submitVars[variables[i]] = "";
    }
  }
  
  var editXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + submitVars.episodes + "</episode>" +
  "<status>" + submitVars.status + "</status>" +
  "<score>" + submitVars.score + "</score>" +
  "<storage_type>" + submitVars.storage_type + "</storage_type>" +
  "<storage_value>" + submitVars.storage_value + "</storage_value>" +
  "<times_rewatched>" + submitVars.times_rewatched + "</times_rewatched>" +
  "<rewatch_value>" + submitVars.rewatch_value + "</rewatch_value>" +
  "<date_start>" + submitVars.date_start + "</date_start>" +
  "<date_finish>" + submitVars.date_finish + "</date_finish>" +
  "<priority>" + submitVars.priority + "</priority>" +
  "<enable_discussion>" + submitVars.enable_discussion + "</enable_discussion>" +
  "<enable_rewatching>" + submitVars.enable_rewatching + "</enable_rewatching>" +
  "<tags>" + submitVars.tags + "</tags>" +
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
      console.log("[DONE] Details: Episodes - " + submitVars.episodes);
      console.log("[DONE] Details: Score - " + submitVars.score);
    },
    error: function(xhr, status, thrownError) {
      console.log(xhr.status);
      if(xhr.status == "0") {
        console.log("The Anime is already in the list or doesn't exist!! I think.");
      }
      console.log(xhr.responseText);
    }
  });
}

// ---- Add anime function
function addAnimeInList(id, episode, status, score, storage_type, storage_value, times_rewatched, rewatch_value, date_start, date_finish, priority, enable_discussion, enable_rewatching, tags) {
  
  var variables = ["id", "episode", "status", "score", "storage_type", "storage_value", "times_rewatched", "rewatch_value", "date_start", "date_finish", "priority", "enable_discussion", "enable_rewatching", "tags"];
  
  var submitVars = new Object;
  for(var i = 0; i < variables.length; i++) {
    submitVars[variables[i]] = submit[variables[i]];
    if(variables[i] == "score" && submitVars[variables[i]] == "0") {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "storage_type" && submitVars[variables[i]] == "0"){
      submitVars[variables[i]] = "";
    } else if(variables[i] == "rewatch_value" && submitVars[variables[i]] == "0") {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "date_start" && submitVars[variables[i]] == null) {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "date_finish" && submitVars[variables[i]] == null) {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "priority" && submitVars[variables[i]] == "0") {
      submitVars[variables[i]] = "";
    } else if(variables[i] == "enable_discussion"){
      if(submitVars[variables[i]] == "0") {
        submitVars[variables[i]] = "";
      } else if(submitVars[variables[i]] == "1") {
        submitVars[variables[i]] = "0";
      } else if(submitVars[variables[i]] == "2") {
        submitVars[variables[i]] = "1";
      }
    }
  }
  
  var myXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<entry>" +
  "<episode>" + submitVars["episode"] + "</episode>" +
  "<status>" + submitVars["status"] + "</status>" +
  "<score>" + submitVars["score"] + "</score>" +
  "<storage_type>" + submitVars["storage_type"] + "</storage_type>" +
  "<storage_value>" + submitVars["storage_value"] + "</storage_value>" +
  "<times_rewatched>" + submitVars["times_rewatched"] + "</times_rewatched>" +
  "<rewatch_value>" + submitVars["rewatch_value"] + "</rewatch_value>" +
  "<date_start>" + submitVars["date_start"] + "</date_start>" +
  "<date_finish>" + submitVars["date_finish"] + "</date_finish>" +
  "<priority>" + submitVars["priority"] + "</priority>" +
  "<enable_discussion>" + submitVars["enable_discussion"] + "</enable_discussion>" +
  "<enable_rewatching>" + submitVars["enable_rewatching"] + "</enable_rewatching>" +
  "<tags>" + submitVars["tags"] + "</tags>" +
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
    },
    error: function(xhr, status, thrownError) {
      console.log(xhr.status);
      if(xhr.status == "501") {
        console.log("The Anime is already in the list.");
      }
      console.log(xhr.responseText);
    }
  })
};

// ---- Delete anime function
function deleteAnimeInList(id) {
  // This function will delete without any confirmation. Be aware.
  $.ajax({
    url: "http://myanimelist.net/api/animelist/delete/" + id + ".xml",
    type: "GET",
    username: loginUsername,
    password: loginPassword,
    success: function(ajaxData) {
      console.log("Anime ID " + id + " has been deleted!");
    },
    error: function(xhr, status, thrownError) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  })
}