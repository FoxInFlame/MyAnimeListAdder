setTimeout(function() {
  /* Example: Send data from the page to your Chrome extension */
  document.dispatchEvent(new CustomEvent('QMAL_extensionConnected', {
    detail: "hi" // Some variable from Gmail.
  }));
}, 0);