# audio.js

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A handler for HTML5 audios, special to fade volume  
  Take a look to the demo, only for check fades--> [Demo](http://maximobelen.github.io/audio.js/)

```js
var AudioJS = require('audio.js');  
  
var audioElement = document.getElementById('background-audio');  
// AUDIO ELEMENT should be an html5 audio element  
  
var audioJS = AudioJS(audioElement);  
var options = {
  duration: 10, //in seconds
  intialVolume: 0, // a volume from 0.0 to 1.0
  finalVolume: 0.9, // a volume from 0.0 to 1.0
  ease: 'easeOutExpo',
  callback: function(){console.log('Im a callback!');}
};  
  
audioJS.play(callback);  
audioJS.stop(callback);  
audioJS.pause();  
audioJS.setVolume(0.4);  
audioJS.status();  
audioJS.load();  
audioJS.getStringStatus();  
  // 0 is loaded  
  // 1 is playing  
  // 2 paused  
  // 3 stoped  
  // 4 is fading  
  // 5 endFade  
  // 6 ended  
  
audioJS.fadeIn(options);

```

##Methods
  
###FADE IN
```js
audioJS.fadeIn({duration: 2, initialVolume: 0, finalVolume: 0.95, ease: 'easeOutExpo'});
  
audioJS.fadeIn({duration: 10, initialVolume: 0, finalVolume: 0.95, ease: 'easeOutExpo', 
  callback: function(){
    console.log("bullshit");
  }
});
```
###FADE OUT
```js
audioJS.fadeOut({duration: 3, initialVolume: 0.9, finalVolume: 0.1});  

audioJS.fadeOut({duration: 5 , initialVolume: 0.9, finalVolume: 0.1, ease:'easeInQuad'});
```
###KILL FADE
```js
  
//if you want to kill a fade that is animating
audioJS.killFade();  

```
### Available Eases  
'easeLinear'  
'easeInQuad'  
'easeOutQuad'  
'easeInOutQuad'  
'easeInCubic'  
'easeOutCubic'  
'easeInOutCubic'  
'easeInExpo'  
'easeOutExpo'  
'easeInOutExpo'  
'easeInCirc'  
'easeOutCirc'  
'easeInOutCirc'  

Note: If you dont choose any ease, easeLinear is going to be run.

## Usage

[![NPM](https://nodei.co/npm/audio.js.png)](https://www.npmjs.com/package/audio.js)
