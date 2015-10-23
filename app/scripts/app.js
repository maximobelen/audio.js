'use strict';
var AudioJS = require('audio.js');

function App() {
}

module.exports = App;

App.prototype.init = function () {

  this.audio = document.getElementById('audio-file');
  this.audioJS = new AudioJS(this.audio);

  this.fadeInButton = document.getElementById('fade-in-button');
  this.fadeOutButton = document.getElementById('fade-out-button');
  this.board = document.getElementById('audio-file');

  this.fadeInDuration = document.getElementById('fade-in-duration');
  this.fadeInInInitial = document.getElementById('fade-in-initial-volume');
  this.fadeInFinal = document.getElementById('fade-in-final-volume');
  this.fadeInEase = document.getElementById('fade-in-ease');
  this.fadeInCallback = document.getElementById('fade-in-callback');

  this.fadeOutDuration = document.getElementById('fade-out-duration');
  this.fadeOutStart = document.getElementById('fade-out-initial-volume');
  this.fadeOutEnd = document.getElementById('fade-out-final-volume');
  this.fadeOutEase = document.getElementById('fade-out-ease');
  this.fadeOutCallback = document.getElementById('fade-out-callback');

  function registerListeners(){
    this.fadeInButton.addEventListener('mousedown', function(){
      this.audioJS.fadeIn({duration: this.fadeInDuration.value, initialVolume: this.fadeInStart.value, finalVolume: this.fadeInEnd.value, ease: this.fadeInEase.value});
    });

    this.fadeOutButton.addEventListener('mousedown', function(){
      this.audioJS.fadeIn({duration: this.fadeOutDuration.value, initialVolume: this.fadeOutStart.value, finalVolume: this.fadeOutEnd.value, ease: this.fadeOutEase.value});
    });
  }
  registerListeners();
};

