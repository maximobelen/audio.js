
var AudioJS = (function AudioJS(element) {
  "use strict";

  var status,
  audioElement,
  killed;
  
  var statusString = ['loaded','playing', 'paused', 'stoped', 'fading'];

  function AudioJS(element) {
    if (!(this instanceof AudioJS)) {
      return new AudioJS(element);
    }
    killed = false;
    audioElement = element;
  }

  AudioJS.prototype.fadeIn = function (options) {
    killed = false;
    status = 4;
    if (!isPlaying(audioElement)){
      audioElement.play();
    }
    var duration = options.duration, 
      initialVolume = options.initialVolume,
      finalVolume = options.finalVolume,
      ease = options.ease,
      callback = options.callback;

    var vol = initialVolume;
    audioElement.volume = vol;
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
        audioElement.volume = initialVolume;
      } else {
        if ( vol >= finalVolume) {
          audioElement.volume = finalVolume;
        } else {
          audioElement.volume = vol;
        }
      } 
      
      if (elapsedTime < duration && !killed) {
        setTimeout(function() {
          fadeIn();
        }, null);
      } else {
        if(callback){
          callback();
          status = 3;
        }
        killed = false;
      }
    }.bind(this);

    fadeIn();
  };

  AudioJS.prototype.killFade = function () {
    killed = true;
  };

  AudioJS.prototype.play = function (callback) {
    audioElement.play();
    status = 1;
    if (callback) {
      audioElement.addEventListener("ended", function() {
        callback();
      });
    }
  };

  AudioJS.prototype.load = function (callback) {
    audioElement.load();
    status = 0;
    if (callback) {
      audioElement.addEventListener("canplay", function() {
        callback();
      });
    }
  };

  AudioJS.prototype.stop = function () {
    audioElement.pause();
    audioElement.currentTime = 0;
    status = 3;
  };

  AudioJS.prototype.pause = function () {
    audioElement.pause();
    status = 2;
  };

  AudioJS.prototype.getStringStatus = function () {
    return statusString[status];
  };

  AudioJS.prototype.status = function () {
    return status;
  };

  AudioJS.prototype.fadeOut = function (options) {
    killed = false;
    if (!isPlaying(audioElement)){
      audioElement.play();
    }
    var duration = options.duration, 
      initialVolume = options.initialVolume,
      finalVolume = options.finalVolume,
      ease = options.ease,
      callback = options.callback;

    var vol = initialVolume;
    var startVolume = initialVolume;
    audioElement.volume = vol;
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
        audioElement.volume = finalVolume;
      } else {
        if ( (startVolume + vol) >= initialVolume) {
          audioElement.volume = initialVolume;
        } else {
          audioElement.volume = (startVolume + vol);
        }
      } 
      if (elapsedTime < duration && !killed) {
        setTimeout(function() {
          fadeOut();
        }, null);
      } else {
        if(callback){
          callback();
        }
        killed = false;
      }
    }.bind(this);
    fadeOut();
  };

  var easeLinear = function (currentTime, start, change, duration) {
    return change * currentTime/duration + start;
  };

  var easeInQuad = function (currentTime, start, change, duration) {
    currentTime /= duration;
    return change * currentTime * currentTime + start;
  };

  var easeOutQuad = function (currentTime, start, change, duration) {
    currentTime /= duration;
    return -change * currentTime * (currentTime-2) + start;
  };

  var easeInOutQuad = function (currentTime, start, change, duration) {
    currentTime /= duration/2;
    if (currentTime < 1) return change/2 * currentTime * currentTime + start;
    currentTime--;
    return -change/2 * (currentTime * ( currentTime - 2) - 1) + start;
  };

  var easeInCubic = function (currentTime, start, change, duration) {
    currentTime /= duration;
    return change * currentTime * currentTime * currentTime + start;
  };

  var easeOutCubic = function (currentTime, start, change, duration) {
    currentTime /= duration;
    currentTime--;
    return change * (currentTime * currentTime * currentTime + 1) + start;
  };

  var easeInOutCubic = function (currentTime, start, change, duration) {
    currentTime /= duration/2;
    if (currentTime < 1) return change/2 * currentTime * currentTime * currentTime + start;
    currentTime -= 2;
    return change/2 * (currentTime * currentTime * currentTime + 2) + start;
  };

  var easeInExpo = function (currentTime, start, change, duration){
    return change * Math.pow( 2, 10 * (currentTime/duration - 1) ) + start;
  };

  var easeOutExpo = function (currentTime, start, change, duration) {
    return change * ( -Math.pow( 2, -10 * currentTime/duration ) + 1 ) + start;
  };

  var easeInOutExpo = function (currentTime, start, change, duration) {
    currentTime /= duration/2;
    if (currentTime < 1) return change / 2 * Math.pow( 2, 10 * (currentTime - 1) ) + start;
    currentTime--;
    return change/2 * ( -Math.pow( 2, -10 * currentTime) + 2 ) + start;
  };

  var easeInCirc = function (currentTime, start, change, duration) {
    currentTime /= duration;
    return -change * (Math.sqrt(1 - currentTime * currentTime) - 1) + start;
  };

  var easeOutCirc = function (currentTime, start, change, duration) {
    currentTime /= duration;
    currentTime--;
    return change * Math.sqrt(1 - currentTime * currentTime) + start;
  };

  var easeInOutCirc = function (currentTime, start, change, duration) {
    currentTime /= duration/2;
    if (currentTime < 1) return -change/2 * (Math.sqrt(1 - currentTime * currentTime) - 1) + start;
    currentTime -= 2;
    return change/2 * (Math.sqrt(1 - currentTime * currentTime) + 1) + start;
  };

  var isPlaying = function isPlaying(audio) { 
    return !audio.paused; 
  };

  var selectEase = function(ease){
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
  return AudioJS;
});

module.exports = AudioJS;