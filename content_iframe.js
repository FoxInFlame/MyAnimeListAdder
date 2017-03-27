if(!window.isTop) {
  if(document.getElementsByClassName("video-js").length !== 0) { // Only if this iframe is Video JS (e.g. Openload)
    console.log("Detected VideoJS.");
    window.setInterval(checkVideoTimeVideoJS, 10000);
  }
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

function update_later(status, boolean) {
  var o = {};
  var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;
  var key = "update_later_" + url.hashCode();
  o[key] = boolean;
  if(status == "set") {
    chrome.storage.local.set(o, function() {});
  } else if(status == "get") {
    chrome.storage.local.get(o, function(item) {
      if(boolean) boolean(item[key]);
    });
  }
}

function checkVideoTimeVideoJS() {
  var time = $(".vjs-remaining-time-display").contents().filter(function() {
    return this.nodeType == 3;
  })[0].nodeValue;
  time = parseInt(time.split("-")[1].replace(":", "")); // So 16:12 becomes 1612, 16:10 becomes 1610, 15:59 becomes 1559. It's also a number (no leading 0), so 00:18 becomes 18.
  update_later("get", function(boolean) {
    if(time < 200 && time > 0 && boolean === true) { // 2 minutes until end of video, check for elements in main content script after receiving message
      // It also checks if the time is 0, which is what happens before the video loads. Of course, the end of the video will also be skipped, but by then time<200 would've detected it.
      chrome.runtime.sendMessage({ // Message sent to background script, which will then transfer to main content script
        sendBack: true,
        data: "dialog_show"
      });
    }
  });
}