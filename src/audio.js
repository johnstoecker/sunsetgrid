import { analyze } from 'web-audio-beat-detector';

var sunsetAudio = {
  paused: false,
  audioStartOffset: 0,
  audioStartTime: 0,
  audioBuffer: undefined,
};

function playPause() {

// http://retrowave.ru/api/v1/tracks?cursor=1&limit=1
// http://retrowave.ru/audio/bff7fd15e91b4a1d8897d917fd01a4bdb644a8d4.mp3

  if (document.getElementById("radioStream")) {
    if (sunsetAudio.paused) {
      document.getElementById("radioStream").play();
      sunsetAudio.paused = false;
    } else {
      document.getElementById("radioStream").pause();
      sunsetAudio.paused = true;
    }
    return;
  } else {
    startStream()
  }
}

function startStream() {
  // // Create a new instance of an audio object and adjust some of its properties
  var audio = new Audio();
  // // audio.src = 'http://192.99.37.181:8050/live.mp3';
  audio.src = 'http://stream.radio.co/s98f81d47e/listen';
  audio.crossOrigin = "anonymous";
  //
  audio.controls = false;
  audio.style.position = "absolute"
  audio.style.bottom = "10px"
  audio.id = "radioStream"
  document.getElementById('audio_box').appendChild(audio);
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  // var context = new AudioContext(); // AudioContext object instance


  var audioContext = new AudioContext();
  var mediaElementSource = audioContext.createMediaElementSource(audio);
  var analyzer = audioContext.createAnalyser();
  analyzer.smoothingTimeConstant = 0.3;
  analyzer.fftSize = 1024;

  mediaElementSource.connect(analyzer);
  analyzer.connect(audioContext.destination);
  var analyzerBytes = new Uint8Array(analyzer.frequencyBinCount);
  audio.play();

  window.sunsetAnalyzer = analyzer
  document.getElementById("visualizerInfo").innerHTML = ""
}


export default {
  sunsetAudio: sunsetAudio,
  playPause: playPause
}

export const PI = 3.14159265
export const e = 2.7181718
