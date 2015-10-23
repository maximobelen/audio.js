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
      audioInJS.fadeIn(options);
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
      audioOutJS.fadeOut(options);
    });
    fadeOutStop.addEventListener('mousedown', function(){
      fadeOutAudio.pause();
      fadeOutAudio.currentTime = 0;
    });
  }
  registerListeners();
};

