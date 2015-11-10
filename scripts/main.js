(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var AudioJS = require('audio.js');

window.onload = function() {
  FX.fadeOut(document.getElementById('preloader'), {
    duration: 600,
    complete: function() {
      document.getElementById('preloader').style.visibility = "hidden";
    }

  });
};
function App() {
}

module.exports = App;

App.prototype.init = function () {

  var fadeInAudio = document.getElementById('fade-in-audio-file');
  var fadeOutAudio = document.getElementById('fade-out-audio-file');
  var audioOutJS = new AudioJS(fadeOutAudio);
  var audioInJS = new AudioJS(fadeInAudio);

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
      audioInJS.stop();
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
      audioOutJS.stop();
    });
  }

  function displayBoard(fadeIn){
    var returnText;
    var isCorrect = false;
    if (fadeIn) {
      if(!fadeInDuration.value || !fadeInStart.value || !fadeInEnd.value){
        returnText= '// duration, initialVolume and finalVolume are required<br>// initialVolume should be lower than finalVolume';
      } else {
        if(fadeInCallback.value == "No"){
          returnText = "var options = { <br>&nbsp;&nbsp;duration: "+parseInt(fadeInDuration.value)+",<br>&nbsp;&nbsp;initialVolume: "+parseFloat(fadeInStart.value)+", <br>&nbsp;&nbsp;finalVolume: "+parseFloat(fadeInEnd.value)+", <br>&nbsp;&nbsp;ease: '"+fadeInEase.value+"'<br>};<br><br>audioJS.fadeIn(options);";
        } else {
          returnText = "var options = { <br>&nbsp;&nbsp;duration: "+parseInt(fadeInDuration.value)+",<br>&nbsp;&nbsp;initialVolume: "+parseFloat(fadeInStart.value)+", <br>&nbsp;&nbsp;finalVolume: "+parseFloat(fadeInEnd.value)+", <br>&nbsp;&nbsp;ease: '"+fadeInEase.value+"', <br>&nbsp;&nbsp;callback: function(){ //do stuff }<br>};<br><br>audioJS.fadeIn(options);";
        }
        isCorrect = true;
      }
    } else{
      if(!fadeOutDuration.value || !fadeOutStart.value || !fadeOutEnd.value){
        returnText= "// duration, initialVolume and finalVolume are required<br>// initialVolume should be higher than finalVolume";
      } else {
        if(fadeOutCallback.value == "No"){
          returnText = "var options = { <br>&nbsp;&nbsp;duration: "+parseInt(fadeOutDuration.value)+",<br>&nbsp;&nbsp;initialVolume: "+parseFloat(fadeOutStart.value)+", <br>&nbsp;&nbsp;finalVolume: "+parseFloat(fadeOutEnd.value)+", <br>&nbsp;&nbsp;ease: '"+fadeOutEase.value+"'<br>};<br><br>audioJS.fadeOut(options);";
        } else {
          returnText = "var options = { <br>&nbsp;&nbsp;duration: "+parseInt(fadeOutDuration.value)+",<br>&nbsp;&nbsp;initialVolume: "+parseFloat(fadeOutStart.value)+", <br>&nbsp;&nbsp;finalVolume: "+parseFloat(fadeOutEnd.value)+", <br>&nbsp;&nbsp;ease: '"+fadeOutEase.value+"', <br>&nbsp;&nbsp;callback: function(){ //do stuff }<br>};<br><br>audioJS.fadeOut(options);";
        }
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
  "use strict";

 var AudioJS = function (element) {
  
  var audioJS = {};
  
  var statusString = ['loaded', 'playing', 'paused', 'stoped', 'fading', 'endFade', 'ended'];
  var killed = false;

  var status,
    audioElement = element;
  
  var addAudioListeners = function(){
      audioElement.addEventListener("ended", function() {
        status = 6;
      });
  };
  
  audioJS.getAudio = function() {
      return audioElement;
  };
  
  audioJS.getStatus = function() {
      return status;
  };

  addAudioListeners();

  audioJS.fadeIn = function (options) {
    this.killed = false;
    status = 4;
    if (!isPlaying(this.getAudio())){
      this.play();
    }
    var duration = options.duration, 
      initialVolume = options.initialVolume,
      finalVolume = options.finalVolume,
      ease = options.ease,
      callback = options.callback;

    var vol = initialVolume;
    this.getAudio().volume = vol;
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
        this.getAudio().volume = initialVolume;
      } else {
        if ( vol >= finalVolume) {
          this.getAudio().volume = finalVolume;
        } else {
          this.getAudio().volume = vol;
        }
      } 
      
      if (elapsedTime < duration && !this.killed) {
        setTimeout(function() {
          fadeIn();
        }, null);
      } else {
        if(callback){
          callback();
          this.setStatus(5);
        }
        this.killed = false;
      }
    }.bind(this);

    fadeIn();
  };

  audioJS.killFade = function () {
    this.killed = true;
  };

  audioJS.play = function (callback) {
    this.getAudio().play();
    status = 1;
    if (callback) {
      this.getAudio().addEventListener('ended', function() {
        callback();
      });
    }
  };

  audioJS.setVolume = function (volume) {
    this.getAudio().volume = volume;
    
  };

  audioJS.load = function (callback) {
    this.getAudio().load();
    status = 0;
    if (callback) {
      this.getAudio().addEventListener('canplay', function() {
        callback();
      });
    }
  };

  audioJS.stop = function () {
    this.getAudio().pause();
    this.killFade();
    this.getAudio().currentTime = 0;
    status = 3;
  };

  audioJS.pause = function () {
    this.getAudio().pause();
    this.killFade();
    status = 2;
  };

  audioJS.getStringStatus = function () {
    return this.statusString[this.getStatus()];
  };

  audioJS.status = function () {
    return this.getStatus();
  };

  audioJS.fadeOut = function (options) {
    this.killed = false;
    status = 4;
    if (!isPlaying(this.getAudio())){
      this.play();
    }
    var duration = options.duration, 
      initialVolume = options.initialVolume,
      finalVolume = options.finalVolume,
      ease = options.ease,
      callback = options.callback;

    var vol = initialVolume;
    var startVolume = initialVolume;
    this.getAudio().volume = vol;
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
        this.getAudio().volume = finalVolume;
      } else {
        if ( (startVolume + vol) >= initialVolume) {
          this.getAudio().volume = initialVolume;
        } else {
          this.getAudio().volume = (startVolume + vol);
        }
      } 
      if (elapsedTime < duration && !this.killed) {
        setTimeout(function() {
          fadeOut();
        }, null);
      } else {
        if(callback){
          callback();
          status = 5;
        }
        this.killed = false;
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

  return audioJS;
};


module.exports = AudioJS;
},{}]},{},[2]);

(function() {
    var FX = {
        easing: {
            linear: function(progress) {
                return progress;
            },
            quadratic: function(progress) {
                return Math.pow(progress, 2);
            },
            swing: function(progress) {
                return 0.5 - Math.cos(progress * Math.PI) / 2;
            },
            circ: function(progress) {
                return 1 - Math.sin(Math.acos(progress));
            },
            back: function(progress, x) {
                return Math.pow(progress, 2) * ((x + 1) * progress - x);
            },
            bounce: function(progress) {
                for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                    if (progress >= (7 - 4 * a) / 11) {
                        return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                    }
                }
            },
            elastic: function(progress, x) {
                return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
            }
        },
        animate: function(options) {
            var start = new Date;
            var id = setInterval(function() {
                var timePassed = new Date - start;
                var progress = timePassed / options.duration;
                if (progress > 1) {
                    progress = 1;
                }
                options.progress = progress;
                var delta = options.delta(progress);
                options.step(delta);
                if (progress == 1) {
                    clearInterval(id);
                    options.complete();
                }
            }, options.delay || 10);
        },
        fadeOut: function(element, options) {
            var to = 1;
            this.animate({
                duration: options.duration,
                delta: function(progress) {
                    progress = this.progress;
                    return FX.easing.swing(progress);
                },
                complete: options.complete,
                step: function(delta) {
                    element.style.opacity = to - delta;
                }
            });
        },
        fadeIn: function(element, options) {
            var to = 0;
            this.animate({
                duration: options.duration,
                delta: function(progress) {
                    progress = this.progress;
                    return FX.easing.swing(progress);
                },
                complete: options.complete,
                step: function(delta) {
                    element.style.opacity = to + delta;
                }
            });
        }
    };
    window.FX = FX;
})()
