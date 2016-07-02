document.addEventListener('DOMContentLoaded', function() {
  $("select").material_select();
  $(".helper").helper();
  var filename = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
  if(filename == "options_credentials.html") {
    restore_options_credentials();
  } else if(filename == "options_badge.html") {
    restore_options_badge();
  } else if(filename == "options_popup.html") {
    restore_options_popup();
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
  } else if(filename == "options_popup.html") {
    save_options_popup();
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

(function($) {
  $.fn.helper = function() {
    return this.each(function() {
    var help_title = $(this).data("help-title");
    var help_content = $(this).data("help-content");
    $(this).css("display", "inline");
    $(this).append("<i class='material-icons helper_toggle' style='color:#2e51a2;cursor:pointer'>help</i>" +
    "<div class='row helper_help'>" +
      "<div class='col s6'>" +
        "<div class='card blue-grey darken-1'>" +
          "<div class='card-content white-text'>" +
            "<span class='card-title'>" + help_title + "</span>" +
            "<p>" + help_content + "</p>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>");
    $(".helper_help").hide();
    });
  };
})(jQuery);

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
    $(this).css("background-color", this.value);
    var badge_color_rgb = hexToRGB("#" + hex);
    if((badge_color_rgb.r * 0.299 + badge_color_rgb.g * 0.587 + badge_color_rgb.b * 0.114) > 186) {
      $(this).css("color", "#000000");
    } else {
      $(this).css("color", "#ffffff");
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

function restore_options_popup() {
  chrome.storage.sync.get({
    popup_action_open: "1",
    popup_input_rating: true,
    popup_input_rewatching: true,
    popup_input_tags: true,
    popup_input_storageType: false,
    popup_action_confirm: true
  }, function(items) {
    document.getElementById("popup_action_open").value = parseInt(items.popup_action_open);
    document.getElementById("popup_input_rating").checked = items.popup_input_rating;
    document.getElementById("popup_input_rewatching").checked = items.popup_input_rewatching;
    document.getElementById("popup_input_tags").checked = items.popup_input_tags;
    document.getElementById("popup_input_storageType").checked = items.popup_input_storageType;
    document.getElementById("popup_action_confirm").checked = items.popup_action_confirm;
    $("#popup_action_open").material_select();
  })
}
function save_options_popup() {
  var popup_action_open = document.getElementById("popup_action_open").value.toString();
  var popup_input_rating = document.getElementById("popup_input_rating").checked;
  var popup_input_rewatching = document.getElementById("popup_input_rewatching").checked;
  var popup_input_tags = document.getElementById("popup_input_tags").checked;
  var popup_input_storageType = document.getElementById("popup_input_storageType").checked;
  var popup_action_confirm = document.getElementById("popup_action_confirm").checked;
  chrome.storage.sync.set({
    popup_action_open: popup_action_open,
    popup_input_rating: popup_input_rating,
    popup_input_rewatching: popup_input_rewatching,
    popup_input_tags: popup_input_tags,
    popup_input_storageType: popup_input_storageType,
    popup_action_confirm: popup_action_confirm
  }, function() {
    var status = document.getElementById("save");
    status.innerHTML = 'Popup Options Saved.';
    status.classList.add("orange");
    status.disabled = true;
    setTimeout(function() {
      status.innerHTML = 'Save<i class="material-icons right">send</i>';
      status.disabled = false;
      status.classList.remove("orange");
    }, 3000)
  })
}

$(".helper").on("click", ".helper_toggle", function() {
  $(this).next().toggle();
});