// Saves options to chrome.storage
function save_options() {
  var status = document.getElementById('status');
  status.innerHTML = 'Options Saved!';
  status.style.color = "green";
  setTimeout(function() {
    status.innerHTML = '';
  }, 3000);
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var badge_enable = document.getElementById("badge_enable").checked;
  var badge_color = document.getElementById("badge_color").value;
  var badge_interval = document.getElementById("badge_interval").value;
  var badge_count = document.getElementById("badge_count").value;
  chrome.storage.sync.set({
    username: username,
    password: password,
    badge_enable: badge_enable,
    badge_color: badge_color,
    badge_interval: badge_interval,
    badge_count: badge_count
  }, function() {
    $.ajax({
      url: "http://myanimelist.net/api/account/verify_credentials.xml",
      type: "GET",
      dataType: "xml",
      username: username,
      password: password,
      success: function(data) {
        var status = document.getElementById('credentialStatus');
        status.innerHTML = 'Verified Credentials!';
        status.style.color = "green";
        chrome.storage.sync.set({
          verified: true
        });
        var verifiedBoxes = document.getElementsByClassName("verified");
        var verifiedBoxesLength = verifiedBoxes.length;
        for(var i=0; i < verifiedBoxesLength; i++){
          verifiedBoxes[i].checked = true;
        }
        setTimeout(function() {
          status.innerHTML = '';
        }, 3000);
      },
    });
    // Update status to let user know options were saved.
  });
}

$(document).ajaxError(function(event, jqxhr, settings, exception) {
  if (jqxhr.status== 401) {
    var status = document.getElementById("credentialStatus");
    status.innerHTML = "Inputted credentials are not valid.";
    status.style.color = "red";
    chrome.storage.sync.set({
      verified: false
    });
    var verifiedBoxes = document.getElementsByClassName("verified");
    var verifiedBoxesLength = verifiedBoxes.length;
    for(var i=0; i < verifiedBoxesLength; i++){
      verifiedBoxes[i].checked = false;
    }
    setTimeout(function() {
      status.innerHTML = '';
    }, 3000);
  }
});

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    username: "Username",
    password: "password123",
    verified: false,
    badge_enable: false,
    badge_color: "#ff8a65",
    badge_interval: "5",
    badge_count: "6"
  }, function(items) {
    document.getElementById("username").value = items.username;
    document.getElementById("password").value = items.password;
    document.getElementById("badge_enable").checked = items.badge_enable;
    document.getElementById("badge_color").value = items.badge_color;
    document.getElementById("badge_interval").value = items.badge_interval;
    document.getElementById("badge_count").value = items.badge_count;
    var verifiedBoxes = document.getElementsByClassName("verified");
    var verifiedBoxesLength = verifiedBoxes.length;
    for(var i=0; i < verifiedBoxesLength; i++){
      verifiedBoxes[i].checked = items.verified;
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);