'use strict';
var AudioJS = require('audio.js');

function App() {
}

module.exports = App;

App.prototype.init = function () {

  this.audio = document.getElementById('audio-file');
  var audioJS = new AudioJS(this.audio);

  var fadeInButton = document.getElementById('fade-in-button');
  var fadeOutButton = document.getElementById('fade-out-button');
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
    fadeInButton.addEventListener('mousedown', function(){
      var options = 
      {
        duration: parseInt(fadeInDuration.value),
        initialVolume: parseFloat(fadeInStart.value), 
        finalVolume: parseFloat(fadeInEnd.value), 
        ease: fadeInEase.value
      };
      audioJS.fadeIn(options);
    });

    fadeOutButton.addEventListener('mousedown', function(){
      var options = 
      {
        duration: parseInt(fadeOutDuration.value),
        initialVolume: parseFloat(fadeOutStart.value), 
        finalVolume: parseFloat(fadeOutEnd.value), 
        ease: fadeOutEase.value
      };
      audioJS.fadeOut(options);
    });
  }
  registerListeners();
};

