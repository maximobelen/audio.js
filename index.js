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