if(!window.isTop) {
  if(window.location.href.indexOf("openload.co") !== -1) { // Only if this iframe is OpenLoad (VideoJS)
    console.log("[QMAL] Detected OpenLoad. Initialising script.");
    window.setInterval(checkVideoTimeVideoJS, 10000);
  } else if(window.location.href.indexOf("rapidvideo.com") !== -1) { // Only if this iframe is RapidVideo (JWPlayer)
    console.log("[QMAL] Detected RapidVideo. Initialising script.");
    window.setInterval(checkVideoTimeJWPlayer, 10000);
  }
}

String.prototype.replaceAll = function(find, replace) {
  return this.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

// escape metacharacters that can be passed in "find" in replaceAll()
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function checkVideoTimeVideoJS() {
  let time = $(".vjs-remaining-time-display").contents().filter(function() {
    return this.nodeType == 3;
  })[0].nodeValue;
  time = parseInt(time.split("-")[1].replaceAll(":", "")); // So 16:12 becomes 1612, 16:10 becomes 1610, 15:59 becomes 1559. It's also a number (no leading 0), so 00:18 becomes 18.
  if(time < 200 && time > 0) { // 2 minutes until end of video, check for elements in main content script after receiving message
    // It also checks if the time is 0, which is what happens before the video loads. Of course, the end of the video will also be skipped, but by then time<200 would've detected it.
    chrome.runtime.sendMessage({ // Message sent to background script, which will then transfer to main content script
      sendBack: true,
      data: "dialog_show"
    });
  }
}

function checkVideoTimeJWPlayer() {
  let length = $(".jw-controlbar-right-group .jw-text-duration").contents().filter(function() {
    return this.nodeType == 3;
  })[0].nodeValue;
  length = parseInt(length.replaceAll(":", ""));
  let current = $(".jw-controlbar .jw-text-elapsed").contents().filter(function() {
    return this.nodeType == 3;
  })[0].nodeValue;
  current = parseInt(current.replaceAll(":", ""));
  time = length - current;
  if(time < 200 && time > 0) {
    chrome.runtime.sendMessage({
      sendBack: true,
      data: "dialog_show"
    });
  }
}