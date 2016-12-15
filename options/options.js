function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function() {
  $("select").material_select();
  $(".helper").helper();
  var filename = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
  if(filename == "options_credentials.html") {
    restore_options_credentials();
  } else if(filename == "options_badge.html") {
    restore_options_badge();
  } else if(filename == "options_popup.html") {
    restore_options_popup();
  } else if(filename == "options_inpage.html") {
    restore_options_inpage();
  } else if(filename == "options_twitter.html") {
    twitter();
  } else {
    options_main();
  }
  if(getParameterByName("highlight") !== null) {
    highlight = getParameterByName("highlight");
    if(highlight.startsWith("ID:")) {
      $("#" + highlight.substring(3)).css("background-color", "#fff6a3").css("border-radius", "5px");
    } else if(highlight.startsWith("CLASS:")) {
      $("." + highlight.substring(6)).each(function() {
        $(this).css("background-color", "#fff6a3").css("border-radius", "5px");
      });
    }
  }
});

if($("#save").length > 0) {
  document.getElementById('save').addEventListener('click', function() {
    var filename = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
    if(filename == "options_credentials.html") {
      save_options_credentials();
    } else if(filename == "options_badge.html") {
      save_options_badge();
    } else if(filename == "options_popup.html") {
      save_options_popup();
    } else if(filename == "options_inpage.html") {
      save_options_inpage();
    }
  });
}
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


function options_main() {
  chrome.storage.sync.get({
    first_time_launch: true,
    verified: false
  }, function(items) {
    first_time_launch = items.first_time_launch;
    verified = items.verified;
    console.log("First Time Launch?:" + first_time_launch);
    if(first_time_launch === true) {
      $("body").css("pointer-events", "none");
      $("#main_welcome").show();
      $("#main").hide();
      welcome_message();
    } else {
      $("#main_welcome").hide();
      $("#main").show();
      if(verified === false) {
        $("#main_loggedIn").show();
      }
      development_github();
    }
  });
}
function welcome_message() {
  count = $("#main_welcome_fade").children().length;
  $("#main_welcome_fade").children().each(function(index) {
    $(this).delay(2000*index).fadeIn(300).delay(1400).fadeOut(300, function() {
      $(this).remove();
      if(!--count) welcome_message_features();
    });
  });
}
function welcome_message_features() {
  $("#main_welcome_features").fadeIn(300);
  $("body").css("pointer-events", "auto");
  chrome.storage.sync.set({
    first_time_launch: false
  });
}
function development_github() {
  $.ajax({
    url: "https://api.github.com/repos/FoxInFlame/QuickMyAnimeList/commits?sha=Version-1.3.4",
    success: function(data) {
      $("#github_latest_commit_sha").html(data[0]["sha"].substring(0,10));
      $("#github_latest_commit_link").attr("href", data[0]["html_url"]);
      var github_latest_commit_date = data[0]["commit"]["author"]["date"];
      var current_date = new Date();
      current_date = current_date.toISOString(); //"2011-12-19T15:28:46.493Z"
      current_date = current_date.split(".")[0]+"Z"; //"2011-12-19T15:28:46Z"
      $("#github_latest_commit_date").html(timeDifferenceHTML(current_date, github_latest_commit_date));
    },
    error: function() {
      $("#github_latest_commit_date").html("Nothing yet!");
      $("#github_latest_commit_sha").html("Empty");
      $("#github_latest_commit_link").css("pointer-events", "none");
    }
  })
  $.ajax({
    url: "https://api.github.com/repos/FoxInFlame/QuickMyAnimeList/commits",
    success: function(data) {
      $("#github_master_commit_sha").html(data[0]["sha"].substring(0,10));
      $("#github_master_commit_link").attr("href", data[0]["html_url"]);
      var github_master_commit_date = data[0]["commit"]["author"]["date"];
      var current_date = new Date();
      current_date = current_date.toISOString(); //"2011-12-19T15:28:46.493Z"
      current_date = current_date.split(".")[0]+"Z"; //"2011-12-19T15:28:46Z"
      $("#github_master_commit_date").html(timeDifferenceHTML(current_date, github_master_commit_date));
    }
  })
}
function timeDifferenceHTML(current, previous) {
  var differenceSeconds = timeDifferenceString(current, previous);
  if(differenceSeconds <= 60) {
    // Latest commit was less than a minute ago
    return Math.round(differenceSeconds) + " seconds ago";
  } else if(differenceSeconds <= 3600 && differenceSeconds > 60) {
    // Latest commit was less than an hour ago, but more than a minute
    return Math.round(differenceSeconds / 60) + " minutes ago";
  } else if(differenceSeconds <= 86400 && differenceSeconds > 3600) {
    // Latest commit was less than a day ago, but more than an hour
    return Math.round(differenceSeconds / 3600) + " hours ago";
  } else if(differenceSeconds <= 2592000 && differenceSeconds > 86400) {
    // Latest commit was less than a month ago, but more than a day
    return Math.round(differenceSeconds / 86400) + " days ago";
  } else if(differenceSeconds <=  31104000 && differenceSeconds > 2592000) {
    // Latest commit was less than a year ago, but more than a month
    return Math.round(differenceSeconds / 2592000) + " months ago";
  } else {
    // Latest commit was a few years ago
    return Math.round(differenceSeconds / 31104000) + " years ago";
  }
}
function timeDifferenceString(current, previous) {
  function toSeconds(time) {
    var parts,
        date,
        time;
    parts = time.split("T");
    date = parts[0];
    time = parts[1].slice(0, -1);
    //Date
    date = date.split("-");
    var date_year = parseInt(date[0]);
    var date_month = parseInt(date[1]);
    var date_day = parseInt(date[2]);
    var date_year_seconds = date_year * 31104000;
    var date_month_seconds = date_month * 2592000;
    var date_day_seconds = date_day * 86400;
    //Time
    time = time.split(":");
    var time_hour = parseInt(time[0]);
    var time_minutes = parseInt(time[1]);
    var time_seconds = parseInt(time[2]);
    var time_hour_seconds = time_hour * 3600;
    var time_minutes_seconds = time_minutes * 60;
    var total = date_year_seconds + date_month_seconds + date_day_seconds + time_hour_seconds + time_minutes_seconds + time_seconds;
    return total;
  }
  return toSeconds(current) - toSeconds(previous);
}

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
      url: "https://myanimelist.net/api/account/verify_credentials.xml",
      type: "GET",
      dataType: "xml",
      username: username,
      password: password,
      success: function(data) {
        var status = document.getElementById("save");
        status.innerHTML = 'Credentials Saved!';
        status.disabled = true;
        status.classList.add("green");
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
          chrome.extension.getBackgroundPage().updateBadge();
        }, 1000);
        setTimeout(function() {
          status.innerHTML = 'Save<i class="material-icons right">send</i>';
          status.disabled = false;
          status.classList.remove("green");
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
    badge_color: "#5be825",
    badge_interval: "3600",
    badge_count: "1"
  }, function(items) {
    document.getElementById("badge_enable").checked = items.badge_enable;
    document.getElementById("badge_color").value = items.badge_color;
    document.getElementById("badge_color").style.backgroundColor = items.badge_color;
    document.getElementById("badge_interval").value = (parseInt(items.badge_interval) / 60).toString();
    document.getElementById("badge_count").value = parseInt(items.badge_count);
    $("#badge_count").material_select();
  });
}
function save_options_badge() {
  var badge_enable = document.getElementById("badge_enable").checked;
  var badge_color = document.getElementById("badge_color").value;
  var badge_interval_min = document.getElementById("badge_interval").value;
  var badge_interval = (parseInt(badge_interval_min) * 60).toString();
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
          chrome.extension.getBackgroundPage().updateBadge();
        }, 1000);
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
    popup_action_open: 1,
    popup_input_rating: true,
    popup_input_rewatching: true,
    popup_input_tags: true,
    popup_input_storageType: false,
    popup_action_confirm: true,
    popup_theme: 2
  }, function(items) {
    document.getElementById("popup_action_open").value = items.popup_action_open;
    document.getElementById("popup_input_rating").checked = items.popup_input_rating;
    document.getElementById("popup_input_rewatching").checked = items.popup_input_rewatching;
    document.getElementById("popup_input_tags").checked = items.popup_input_tags;
    document.getElementById("popup_input_storageType").checked = items.popup_input_storageType;
    document.getElementById("popup_action_confirm").checked = items.popup_action_confirm;
    document.getElementById("popup_css_theme").value = items.popup_theme;
    $("#popup_action_open").material_select();
    $("#popup_css_theme").material_select();
    if(parseInt(items.popup_action_open) == 1) {
      $("#popup_csstheme_wrapper").show();
      $("#popup_qmalpanel_warning").hide();
      if(items.popup_theme == 1) {
        $("#popup_qmalpopup_mcss_options").hide();
        $("#popup_qmalpopup_mdb_options").show();
      } else if(items.popup_theme == 2) {
        $("#popup_qmalpopup_mcss_options").show();
        $("#popup_qmalpopup_mdb_options").hide();
      }
      return;
    }
    if($("#popup_action_open").val() == 6) {
      $("#popup_qmalpopup_mdb_options").hide();
      $("#popup_csstheme_wrapper").hide();
      $("#popup_qmalpanel_warning").show();
    } else {
      $("#popup_csstheme_wrapper").hide();
      $("#popup_qmalpopup_mdb_options").hide()
      $("#popup_qmalpanel_warning").hide();
    }
  });
  $("#popup_quickmalpanel_warning a").on("click", function() {
    chrome.tabs.create({url: "chrome://flags/#enable-panels"});
  });
  $("#popup_action_open, #popup_css_theme").on("change", function() {
    if($("#popup_action_open").val() == 1) {
      $("#popup_csstheme_wrapper").slideDown(150);
      if($("#popup_css_theme").val() == 1) {
        $("#popup_qmalpopup_mcss_options").slideUp(150);
        $("#popup_qmalpopup_mdb_options").slideDown(150);
      } else if($("#popup_css_theme").val() == 2) {
        $("#popup_qmalpopup_mcss_options").slideDown(150);
        $("#popup_qmalpopup_mdb_options").slideUp(150);
      }
      $("#popup_qmalpanel_warning").slideUp(150);
    } else if($("#popup_action_open").val() == 6) {
      $("#popup_qmalpopup_mcss_options").slideDown(150)
      $("#popup_qmalpopup_mdb_options").slideUp(150);
      $("#popup_csstheme_wrapper").slideUp(150);
      $("#popup_qmalpanel_warning").slideDown(150);
    } else {
      $("#popup_csstheme_wrapper").slideUp(150);
      $("#popup_qmalpopup_mcss_options").slideUp(150)
      $("#popup_qmalpopup_mdb_options").slideUp(150)
      $("#popup_qmalpanel_warning").slideUp(150);
    }
  });
}
function save_options_popup() {
  var popup_action_open = document.getElementById("popup_action_open").value;
  var popup_input_rating = document.getElementById("popup_input_rating").checked;
  var popup_input_rewatching = document.getElementById("popup_input_rewatching").checked;
  var popup_input_tags = document.getElementById("popup_input_tags").checked;
  var popup_input_storageType = document.getElementById("popup_input_storageType").checked;
  var popup_action_confirm = document.getElementById("popup_action_confirm").checked;
  var popup_css_theme = document.getElementById("popup_css_theme").value;
  
  chrome.storage.sync.set({
    popup_action_open: popup_action_open,
    popup_input_rating: popup_input_rating,
    popup_input_rewatching: popup_input_rewatching,
    popup_input_tags: popup_input_tags,
    popup_input_storageType: popup_input_storageType,
    popup_action_confirm: popup_action_confirm,
    popup_theme: popup_css_theme
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

function restore_options_inpage() {

}
function save_options_inpage() {

}

$(".helper").on("click", ".helper_toggle", function() {
  $(this).next().toggle();
});

function twitter() {
  chrome.storage.sync.get({
    "twitter_oauth_token": "",
    "twitter_oauth_token_secret": "",
    "twitter_screen_name": ""
  }, function(data) {
    if(data.twitter_oauth_token === "" || data.twitter_oauth_token === "") {
      document.getElementById("not-authenticated").style.display = "block";
      document.getElementById("authenticated").style.display = "none";
    } else {
      document.getElementById("twitter_displayname").innerHTML = data.twitter_screen_name;
      document.getElementById("not-authenticated").style.display = "none";
      document.getElementById("authenticated").style.display = "block";
    }
  });
  var codebird = new Codebird;
  document.getElementById("twitter-auth").addEventListener("click", function() {
    $.ajax({
      url: "http://www.foxinflame.tk/QuickMyAnimeList/source/twitter.php?from=" + chrome.runtime.id,
      method: "GET",
      type: "data/json",
      success: function(data) {
        var consumer_key = data.consumer_key;
        var consumer_secret = data.consumer_secret;
        codebird.setConsumerKey(consumer_key, consumer_secret);
        codebird.__call(
          "oauth_requestToken",
          {
            oauth_callback: "oob"
          },
          function (reply) {
            codebird.setToken(reply.oauth_token, reply.oauth_token_secret);
            codebird.__call(
              "oauth_authorize",
              {},
              function (auth_url) {
                window.codebird_auth = window.open(auth_url);
              }
            );
          }
        );
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  });
  document.getElementById("twitter-auth-code").addEventListener("change", function() {
    if($(this).val().trim() == "") {
      $("#twitter-auth-code-verify").addClass("disabled");
    } else {
      $("#twitter-auth-code-verify").removeClass("disabled");
    }
  });
  document.getElementById("twitter-auth-code-verify").addEventListener("click", function() {
    codebird.__call(
      "oauth_accessToken",
      {
        oauth_verifier: document.getElementById("twitter-auth-code").value.trim()
      },
      function (reply) {
        codebird.setToken(reply.oauth_token, reply.oauth_token_secret);
        /*
        {
          oauth_token: "14648265-rPn8EJwfB**********************",
          oauth_token_secret: "agvf3L3**************************",
          user_id: 14648265,
          screen_name: "jublonet",
          httpstatus: 200
        }
        */
        chrome.storage.sync.set({
          "twitter_oauth_token": reply.oauth_token,
          "twitter_oauth_token_secret": reply.oauth_token_secret,
          "twitter_screen_name": reply.screen_name
        }, function() {
          document.getElementById("twitter_displayname").innerHTML = reply.screen_name;
          document.getElementById("not-authenticated").style.display = "none";
          document.getElementById("authenticated").style.display = "block";
        });
      }
    );
  });
  document.getElementById("twitter-logout").addEventListener("click", function() {
    codebird.logout();
    chrome.storage.sync.set({
      "twitter_oauth_token": "",
      "twitter_oauth_token_secret": "",
      "twitter_screen_name": ""
    }, function() {
      document.getElementById("not-authenticated").style.display = "block";
      document.getElementById("authenticated").style.display = "none";
    });
  });
}