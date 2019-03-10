var sunsetAudio = {
  paused: false,
  audio: undefined,
  audioContext: undefined,
  mediaElementSource: undefined,
  analyzer: undefined,
  anaylzerBytes: undefined
};


// // audio.src = 'http://192.99.37.181:8050/live.mp3';
// poolside.fm
// audio.src = 'http://stream.radio.co/s98f81d47e/listen';
// outrun
// http://139.162.14.151:9090/160mp3/;?d=
// synthwave
// http://139.162.14.151:9090/160mp3/;?d
// synthwave - KJR the drop http://www.kickinjamzradio.com
// http://192.227.116.104:8367/;stream/1

// http://79.120.39.202:8000/retrowave
// radio caprice space synth -- http://radcap.ru
// http://79.120.39.202:8000/space synth

// Radio Record Synthwave -- https://www.radiorecord.ru/
// http://air.radiorecord.ru:805/synth_128

var streams = [
  { name: "poolside.fm", src: "http://stream.radio.co/s98f81d47e/listen"},
  { name: "synthwave1", src: "http://air.radiorecord.ru:805/synth_128", details: "Radio Record Synthwave -- https://www.radiorecord.ru/"},
  { name: "synthwave2", src: "http://139.162.14.151:9090/160mp3/;?d"},
  { name: "synthwave3", src: "http://192.227.116.104:8367/;stream/1", details: "KJR the drop http://www.kickinjamzradio.com"},
  { name: "outrun", src: "http://139.162.14.151:9090/160mp3/;?d=" },
  { name: "retrowave", src: "http://79.120.39.202:8000/retrowave", details: "Radio Caprice http://radcap.ru"},
  { name: "space synth", src: "http://79.120.39.202:8000/spacesynth", details: "Radio Caprice http://radcap.ru"}
];

var currentStreamIndex = 0;

function nextStream() {
  currentStreamIndex = (currentStreamIndex + 1) % streams.length;
  if (!sunsetAudio.paused) {
    playPause();
  }
  if (sunsetAudio.audio) {
    stopStream();
  }
  playPause();
}

function playPause() {
  if (document.getElementById("radioStream")) {
    if (sunsetAudio.paused) {
      document.getElementById("radioStream").play();
      sunsetAudio.paused = false;
      document.getElementById("playButton").style.display = 'none';
      document.getElementById("pauseButton").style.display = 'block';
    } else {
      document.getElementById("radioStream").pause();
      sunsetAudio.paused = true;
      document.getElementById("playButton").style.display = 'block';
      document.getElementById("pauseButton").style.display = 'none';

    }
    return;
  } else {
    document.getElementById("playButton").style.display = 'none';
    document.getElementById("pauseButton").style.display = 'block';
    startStream()
  }
}

// TODO
function stopStream() {
   var elem = document.getElementById("radioStream");
   return elem.parentNode.removeChild(elem);
   delete sunsetAudio.audio;
   delete sunsetAudio.audioContext;
   delete sunsetAudio.mediaElementSource;
   delete sunsetAudio.analyzer;
   delete sunsetAudio.analyzerBytes;
}

function startStream() {
  // // Create a new instance of an audio object and adjust some of its properties
  sunsetAudio.audio = new Audio();
  sunsetAudio.audio.src = streams[currentStreamIndex].src
  sunsetAudio.audio.crossOrigin = "anonymous";
  sunsetAudio.audio.controls = false;
  sunsetAudio.audio.style.position = "absolute"
  sunsetAudio.audio.style.bottom = "10px"
  sunsetAudio.audio.id = "radioStream"
  document.getElementById('audio_box').appendChild(sunsetAudio.audio);

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  sunsetAudio.audioContext = new AudioContext();
  sunsetAudio.mediaElementSource = sunsetAudio.audioContext.createMediaElementSource(sunsetAudio.audio);
  sunsetAudio.analyzer = sunsetAudio.audioContext.createAnalyser();
  sunsetAudio.analyzer.smoothingTimeConstant = 0.3;
  sunsetAudio.analyzer.fftSize = 1024;

  sunsetAudio.mediaElementSource.connect(sunsetAudio.analyzer);
  sunsetAudio.analyzer.connect(sunsetAudio.audioContext.destination);
  sunsetAudio.analyzerBytes = new Uint8Array(sunsetAudio.analyzer.frequencyBinCount);
  sunsetAudio.audio.play();

  window.sunsetAnalyzer = sunsetAudio.analyzer
}


export default {
  sunsetAudio: sunsetAudio,
  playPause: playPause,
  nextStream: nextStream
}
