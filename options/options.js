$(document).ready(function() {
  $("select").material_select();
  $("#options_help_badge_interval").hide();
});

document.addEventListener('DOMContentLoaded', function() {
  var filename = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
    if(filename == "options_credentials.html") {
      restore_options_credentials();
    } else if(filename == "options_badge.html") {
      restore_options_badge();
    } else {
      restore_options();
    }
  });
document.getElementById('save').addEventListener('click', function() {
  var filename = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
  if(filename == "options_credentials.html") {
    save_options_credentials();
  } else if(filename == "options_badge.html") {
    save_options_badge();
  } else {
    save_options();
  }
});


$(document).ajaxError(function(event, jqxhr, settings, exception) {
  if (jqxhr.status== 401) {
    var filename = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
    if(filename == "options_credentials.html") {
      var status = document.getElementById("save");
      status.innerHTML = "Inputted credentials are not valid.";
      status.disabled = true;
      status.classList.add("red");
        chrome.storage.sync.set({
        verified: false
      });
      var verifiedBoxes = document.getElementsByClassName("verified");
      var verifiedBoxesLength = verifiedBoxes.length;
      for(var i=0; i < verifiedBoxesLength; i++){
        verifiedBoxes[i].checked = false;
      }
      chrome.extension.getBackgroundPage().updateBadge();
      setTimeout(function() {
        status.innerHTML = 'Save<i class="material-icons right">send</i>';
        status.disabled = false;
        status.classList.remove("red");
        chrome.extension.getBackgroundPage().updateBadge();
      }, 3000);
    }
  }
});

function restore_options_credentials() {
  chrome.storage.sync.get({
    username: "Username",
    password: "password123",
    verified: false
  }, function(items) {
    document.getElementById("username").value = items.username;
    document.getElementById("password").value = items.password;
    var verifiedBoxes = document.getElementsByClassName("verified");
    var verifiedBoxesLength = verifiedBoxes.length;
    for(var i=0; i < verifiedBoxesLength; i++){
      verifiedBoxes[i].checked = items.verified;
    }
  });
}
function save_options_credentials() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  chrome.storage.sync.set({
    username: username,
    password: password
  }, function() {
    $.ajax({
      url: "http://myanimelist.net/api/account/verify_credentials.xml",
      type: "GET",
      dataType: "xml",
      username: username,
      password: password,
      success: function(data) {
        var status = document.getElementById("save");
        status.innerHTML = 'Credentials Saved!';
        status.disabled = true;
        status.classList.add("orange");
        chrome.storage.sync.set({
          verified: true
        });
        var verifiedBoxes = document.getElementsByClassName("verified");
        var verifiedBoxesLength = verifiedBoxes.length;
        for(var i=0; i < verifiedBoxesLength; i++){
          verifiedBoxes[i].checked = true;
        }
        chrome.extension.getBackgroundPage().updateBadge();
        setTimeout(function() {
          status.innerHTML = 'Save<i class="material-icons right">send</i>';
          status.disabled = false;
          status.classList.remove("orange");
          chrome.extension.getBackgroundPage().updateBadge();
        }, 3000);
      }
    });
  });
}

function hexToRGB(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function restore_options_badge() {
  $("#badge_color").ColorPicker({
    onSubmit: function(hsb, hex, rgb, el) {
      $(el).val(hex);
      $(el).ColorPickerHide();
    },
    onBeforeShow: function () {
      $(this).ColorPickerSetColor(this.value);
    },
    onChange: function (hsb, hex, rgb) {
      document.getElementById("badge_color").value = "#" + hex;
      $("#badge_color").css("background-color", "#" + hex);
      $("#badge_enable").change();
      var badge_color_rgb = hexToRGB("#" + hex);
      if((badge_color_rgb.r * 0.299 + badge_color_rgb.g * 0.587 + badge_color_rgb.b * 0.114) > 186) {
        $("#badge_color").css("color", "#000000");
      } else {
        $("#badge_color").css("color", "#ffffff");
      }
    }
  }).on("keyup", function(){
    $(this).ColorPickerSetColor(this.value);
    $("#badge_color").css("background-color", this.value);
    var badge_color_rgb = hexToRGB("#" + hex);
    if((badge_color_rgb.r * 0.299 + badge_color_rgb.g * 0.587 + badge_color_rgb.b * 0.114) > 186) {
      $("#badge_color").css("color", "#000000");
    } else {
      $("#badge_color").css("color", "#ffffff");
    }
  });
  chrome.storage.sync.get({
    badge_enable: false,
    badge_color: "#ff8a65",
    badge_interval: "10",
    badge_count: "1"
  }, function(items) {
    document.getElementById("badge_enable").checked = items.badge_enable;
    document.getElementById("badge_color").value = items.badge_color;
    document.getElementById("badge_color").style.backgroundColor = items.badge_color;
    document.getElementById("badge_interval").value = items.badge_interval;
    document.getElementById("badge_count").value = parseInt(items.badge_count);
    $("#badge_count").material_select();
  });
}
function save_options_badge() {
  var badge_enable = document.getElementById("badge_enable").checked;
  var badge_color = document.getElementById("badge_color").value;
  var badge_interval = document.getElementById("badge_interval").value;
  var badge_count = document.getElementById("badge_count").value.toString();
  chrome.storage.sync.set({
    badge_enable: badge_enable,
    badge_color: badge_color,
    badge_interval: badge_interval,
    badge_count: badge_count
  }, function() {
    var status = document.getElementById("save");
    status.innerHTML = 'Badge Options Saved.';
    status.classList.add("orange");
    status.disabled = true;
    chrome.extension.getBackgroundPage().updateBadge();
    setTimeout(function() {
      status.innerHTML = 'Save<i class="material-icons right">send</i>';
      status.disabled = false;
      status.classList.remove("orange");
      chrome.extension.getBackgroundPage().updateBadge();
    }, 3000);
  });
}

$("#options_help_badge_interval_toggle").on("click", function() {
  $("#options_help_badge_interval").toggle();
});