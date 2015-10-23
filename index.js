'use strict';
function AudioJS(element) {
  if (!(this instanceof AudioJS)) {
    return new AudioJS(element);
  }
  
  this.audioElement = element;
}

AudioJS.prototype.fadeIn = function (options) {
  'use strict';
  if (!isPlaying(this.audioElement)){
    this.audioElement.play();
  }
  var duration = options.duration, 
    initialVolume = options.initialVolume,
    finalVolume = options.finalVolume,
    ease = options.ease,
    callback = options.callback;

  var vol = initialVolume;
  this.audioElement.volume = vol;
  var startTime = new Date();
  var elapsedTime = 0;
  var change = finalVolume - initialVolume;

  if (ease) {
    ease = selectEase(ease);
  } else {
    ease = easeLinear;
  }

  var fadeIn = function () {
    var currentTime = new Date();
    elapsedTime = (currentTime.getTime() - startTime.getTime()) / 1000;
    vol = ease(elapsedTime, 0, change, duration);
    if (vol <= initialVolume){
      this.audioElement.volume = initialVolume;
    } else {
      if ( vol >= finalVolume) {
        this.audioElement.volume = finalVolume;
      } else {
        this.audioElement.volume = vol;
      }
    } 
    
    if (elapsedTime < duration) {
      setTimeout(function() {
        fadeIn();
      }, null);
    } else {
      if(callback){
        callback();
      }
    }
  }.bind(this);

  fadeIn();
};

AudioJS.prototype.fadeOut = function (options) {
  'use strict';
  if (!isPlaying(this.audioElement)){
    this.audioElement.play();
  }
  var duration = options.duration, 
    initialVolume = options.initialVolume,
    finalVolume = options.finalVolume,
    ease = options.ease,
    callback = options.callback;

  var vol = initialVolume;
  var startVolume = initialVolume;
  this.audioElement.volume = vol;
  var startTime = new Date();
  var elapsedTime = 0;
  var change = finalVolume - initialVolume;

  if (ease) {
    ease = selectEase(ease);
  } else {
    ease = easeLinear;
  }
  var fadeOut = function () {
    var currentTime = new Date();
    elapsedTime = (currentTime.getTime() - startTime.getTime()) / 1000;
    vol = easeInExpo(elapsedTime, 0, change, duration);
    if ((startVolume + vol) <= finalVolume){
      this.audioElement.volume = finalVolume;
    } else {
      if ( (startVolume + vol) >= initialVolume) {
        this.audioElement.volume = initialVolume;
      } else {
        this.audioElement.volume = (startVolume + vol);
      }
    } 
    if (elapsedTime < duration) {
      setTimeout(function() {
        fadeOut();
      }, null);
    } 
  }.bind(this);
  fadeOut();
};

var easeLinear = function (currentTime, start, change, duration) {
  'use strict';
  return change * currentTime/duration + start;
};

var easeInQuad = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration;
  return change * currentTime * currentTime + start;
};

var easeOutQuad = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration;
  return -change * currentTime * (currentTime-2) + start;
};

var easeInOutQuad = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration/2;
  if (currentTime < 1) return change/2 * currentTime * currentTime + start;
  currentTime--;
  return -change/2 * (currentTime * ( currentTime - 2) - 1) + start;
};

var easeInCubic = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration;
  return change * currentTime * currentTime * currentTime + start;
};

var easeOutCubic = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration;
  currentTime--;
  return change * (currentTime * currentTime * currentTime + 1) + start;
};

var easeInOutCubic = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration/2;
  if (currentTime < 1) return change/2 * currentTime * currentTime * currentTime + start;
  currentTime -= 2;
  return change/2 * (currentTime * currentTime * currentTime + 2) + start;
};

var easeInExpo = function (currentTime, start, change, duration){
  'use strict';
  return change * Math.pow( 2, 10 * (currentTime/duration - 1) ) + start;
};

var easeOutExpo = function (currentTime, start, change, duration) {
  'use strict';
  return change * ( -Math.pow( 2, -10 * currentTime/duration ) + 1 ) + start;
};

var easeInOutExpo = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration/2;
  if (currentTime < 1) return change / 2 * Math.pow( 2, 10 * (currentTime - 1) ) + start;
  currentTime--;
  return change/2 * ( -Math.pow( 2, -10 * currentTime) + 2 ) + start;
};

var easeInCirc = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration;
  return -change * (Math.sqrt(1 - currentTime * currentTime) - 1) + start;
};

var easeOutCirc = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration;
  currentTime--;
  return change * Math.sqrt(1 - currentTime * currentTime) + start;
};

var easeInOutCirc = function (currentTime, start, change, duration) {
  'use strict';
  currentTime /= duration/2;
  if (currentTime < 1) return -change/2 * (Math.sqrt(1 - currentTime * currentTime) - 1) + start;
  currentTime -= 2;
  return change/2 * (Math.sqrt(1 - currentTime * currentTime) + 1) + start;
};

var isPlaying = function isPlaying(audio) { 
  'use strict';
  return !audio.paused; 
};

var selectEase = function(ease){
  'use strict';
  switch (ease) {
    case 'easeLinear':
      return easeLinear; 
    case 'easeInQuad': 
      return easeInQuad;
    case 'easeOutQuad': 
      return easeOutQuad;
    case 'easeInOutQuad': 
      return easeInOutQuad;
    case 'easeInCubic': 
      return easeInCubic;
    case 'easeOutCubic': 
      return easeOutCubic;
    case 'easeInOutCubic': 
      return easeInOutCubic;
    case 'easeInExpo': 
      return easeInExpo;
    case 'easeOutExpo': 
      return easeOutExpo;
    case 'easeInOutExpo': 
      return easeInOutExpo;
    case 'easeInCirc': 
      return easeInCirc;
    case 'easeOutCirc': 
      return easeOutCirc;
    case 'easeInOutCirc': 
      return easeInOutCirc;
    default:
      return easeLinear;
  }
};

module.exports = AudioJS;