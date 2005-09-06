/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
function progressBar(id) {
  var pb = this;
  this.id = id;

  this.element = document.createElement('div');
  this.element.id = id;
  this.element.className = 'progress';
  this.element.innerHTML = '<div class="percentage"></div>'+
                           '<div class="status">&nbsp;</div>'+
                           '<div class="bar"><div class="filled"></div></div>';
}

/**
 * Set the percentage and status message for the progressbar.
 */
progressBar.prototype.setProgress = function (percentage, status) {
  var divs = this.element.getElementsByTagName('div');
  for (i in divs) {
    if (percentage >= 0) {
      if (hasClass(divs[i], 'filled')) {
        divs[i].style.width = percentage + '%';
      }
      if (hasClass(divs[i], 'percentage')) {
        divs[i].innerHTML = percentage + '%';
      }
    }
    if (hasClass(divs[i], 'status')) {
      divs[i].innerHTML = status;
    }
  }
}

/**
 * Start monitoring progress via Ajax.
 */
progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
}

/**
 * Stop monitoring progress via Ajax.
 */
progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
}

/**
 * Request progress data from server.
 */
progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  HTTPGet(this.uri, this.receivePing, this);
}

/**
 * HTTP callback function. Passes data back to the progressbar and sets a new
 * timer for the next ping.
 */
progressBar.prototype.receivePing = function(string, xmlhttp, pb) {
  if (xmlhttp.status != 200) {
    return alert('An HTTP error '+ xmlhttp.status +' occured.\n'+ pb.uri);
  }
  // Split into values
  var matches = string.length > 0 ? string.split('|') : [];
  if (matches.length >= 2) {
    pb.setProgress(matches[0], matches[1]);
  }
  pb.timer = setTimeout(function() { pb.sendPing(); }, pb.delay);
}