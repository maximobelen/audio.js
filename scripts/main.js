(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var AudioJS = require('audio.js');

function App() {
}

module.exports = App;

App.prototype.init = function () {

  var fadeInAudio = document.getElementById('fade-in-audio-file');
  var fadeOutAudio = document.getElementById('fade-out-audio-file');
  var audioInJS = new AudioJS(fadeInAudio);
  var audioOutJS = new AudioJS(fadeOutAudio);

  var fadeInButton = document.getElementById('fade-in-button');
  var fadeOutButton = document.getElementById('fade-out-button');
  var fadeInStop = document.getElementById('fade-in-stop');
  var fadeOutStop = document.getElementById('fade-out-stop');
  var board = document.getElementById('audio-file');
  var changeText = document.getElementById('change-text');

  var fadeInDuration = document.getElementById('fade-in-duration');
  var fadeInStart = document.getElementById('fade-in-initial-volume');
  var fadeInEnd = document.getElementById('fade-in-final-volume');
  var fadeInEase = document.getElementById('fade-in-ease');
  var fadeInCallback = document.getElementById('fade-in-callback');

  var fadeOutDuration = document.getElementById('fade-out-duration');
  var fadeOutStart = document.getElementById('fade-out-initial-volume');
  var fadeOutEnd = document.getElementById('fade-out-final-volume');
  var fadeOutEase = document.getElementById('fade-out-ease');
  var fadeOutCallback = document.getElementById('fade-out-callback');

  function registerListeners(){
    fadeInButton.addEventListener('mousedown', function() {
      audioInJS.killFade();
      var options = 
      {
        duration: parseInt(fadeInDuration.value),
        initialVolume: parseFloat(fadeInStart.value), 
        finalVolume: parseFloat(fadeInEnd.value), 
        ease: fadeInEase.value
      };
      if(displayBoard(true)){
        audioInJS.fadeIn(options);
      }
    });

    fadeInStop.addEventListener('mousedown', function(){
      fadeInAudio.pause();
      fadeInAudio.currentTime = 0;
    });

    fadeOutButton.addEventListener('mousedown', function() {
      audioOutJS.killFade();
      var options = 
      {
        duration: parseInt(fadeOutDuration.value),
        initialVolume: parseFloat(fadeOutStart.value), 
        finalVolume: parseFloat(fadeOutEnd.value), 
        ease: fadeOutEase.value
      };
      if(displayBoard(false)){
        audioOutJS.fadeOut(options);
      }
    });

    fadeOutStop.addEventListener('mousedown', function(){
      fadeOutAudio.pause();
      fadeOutAudio.currentTime = 0;
    });
  }

  function displayBoard(fadeIn){
    var returnText;
    var isCorrect = false;
    if (fadeIn) {
      if(!fadeInDuration.value || !fadeInStart.value || !fadeInEnd.value){
        returnText= '// duration, initialVolume and finalVolume are required<br>// initialVolume should be lower than finalVolume';
      } else {
        returnText = "var options = { <br>&nbsp;&nbsp;duration: "+parseInt(fadeInDuration.value)+",<br>&nbsp;&nbsp;initialVolume: "+parseFloat(fadeInStart.value)+", <br>&nbsp;&nbsp;finalVolume: "+parseFloat(fadeInEnd.value)+", <br>&nbsp;&nbsp;ease: '"+fadeInEase.value+"'<br>};<br><br>audioJS.fadeIn(options);";
        isCorrect = true;
      }
    } else{
      if(!fadeOutDuration.value || !fadeOutStart.value || !fadeOutEnd.value){
        returnText= "// duration, initialVolume and finalVolume are required<br>// initialVolume should be higher than finalVolume";
      } else {
        returnText = "var options = { <br>&nbsp;&nbsp;duration: "+parseInt(fadeOutDuration.value)+",<br>&nbsp;&nbsp;initialVolume: "+parseFloat(fadeOutStart.value)+", <br>&nbsp;&nbsp;finalVolume: "+parseFloat(fadeOutEnd.value)+", <br>&nbsp;&nbsp;ease: '"+fadeOutEase.value+"'<br>};<br><br>audioJS.fadeOut(options);";
        isCorrect = true;
      }
    }
    changeText.innerHTML = returnText;
    return isCorrect;
  }
  registerListeners();
};


},{"audio.js":3}],2:[function(require,module,exports){
/**
 * scripts/main.js
 *
 * This is the starting point for your application.
 * Take a look at http://browserify.org/ for more info
 */

'use strict';

var App = require('./app.js');
var AudioJS = require('audio.js');
var app = new App();

app.init();
},{"./app.js":1,"audio.js":3}],3:[function(require,module,exports){
'use strict';
function AudioJS(element) {
  if (!(this instanceof AudioJS)) {
    return new AudioJS(element);
  }
  this.killed = false;
  this.audioElement = element;
}

AudioJS.prototype.fadeIn = function (options) {
  'use strict';
  this.killed = false;
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
    
    if (elapsedTime < duration && !this.killed) {
      setTimeout(function() {
        fadeIn();
      }, null);
    } else {
      if(callback){
        callback();
      }
      this.killed = false;
    }
  }.bind(this);

  fadeIn();
};
AudioJS.prototype.killFade = function () {
  this.killed = true;
};

AudioJS.prototype.fadeOut = function (options) {
  'use strict';
  this.killed = false;
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
    if (elapsedTime < duration && !this.killed) {
      setTimeout(function() {
        fadeOut();
      }, null);
    } else {
      if(callback){
        callback();
      }
      this.killed = false;
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
},{}]},{},[2]);