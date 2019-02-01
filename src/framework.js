import { analyze } from 'web-audio-beat-detector';

var framework = {
  paused: false,
  audioStartOffset: 0,
  audioStartTime: 0,
  audioBuffer: undefined,
};

function createAndConnectAudioBuffer() {
  // create the source buffer
  framework.audioSourceBuffer = framework.audioContext.createBufferSource();
  // connect source and analyser
  framework.audioSourceBuffer.connect(framework.audioAnalyser);
  framework.audioAnalyser.connect(framework.audioContext.destination);
}

function playAudio(file) {
  console.log("playing")
  createAndConnectAudioBuffer();
  framework.audioFile = file;

  var fileName = framework.audioFile.name;
  document.getElementById('visualizerInfo').innerHTML = "Currently playing " + fileName;
  var fileReader = new FileReader();

  fileReader.onload = function (e) {
    console.log("loaded")
      var fileResult = fileReader.result;
      framework.audioContext.decodeAudioData(fileResult, function(buffer) {
        framework.audioSourceBuffer.buffer = buffer;
        framework.audioBuffer = buffer;
        framework.audioSourceBuffer.start();
        // framework.audioSourceBuffer.loop = true;
        analyze(framework.audioSourceBuffer.buffer).then((bpm) => {
          console.log(bpm)
            // the bpm could be analyzed
            framework.songBPM = bpm;
        })
        .catch((err) => {
            // something went wrong
            console.log("couldn't detect BPM");
        });
      }, function(e){"Error with decoding audio data" + e.err});
  };
  fileReader.readAsArrayBuffer(framework.audioFile);
}

// run this function after the window loads
window.addEventListener('load', function() {
  // set up audio processing
  framework.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  // create analyser
  framework.audioAnalyser = framework.audioContext.createAnalyser();
  framework.audioAnalyser.smoothingTimeConstant = 0.3;
  framework.audioAnalyser.fftSize = 1024;
  // create the source buffer
  framework.audioSourceBuffer = framework.audioContext.createBufferSource();

  // connect source and analyser
  framework.audioSourceBuffer.connect(framework.audioAnalyser);
  framework.audioAnalyser.connect(framework.audioContext.destination);

  // add drag and drop functionality for uploading audio file
  window.addEventListener("dragenter", dragenter, false);
  window.addEventListener("dragover", dragover, false);
  window.addEventListener("drop", drop, false);
  // add pausing functionality via spacebar
  window.addEventListener("keypress", keypress, false);

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    console.log("dropped")
    e.stopPropagation();
    e.preventDefault();
    if (framework.audioFile == undefined) {
      playAudio(e.dataTransfer.files[0]);
    } else {
      // stop current visualization and load new song
      framework.audioSourceBuffer.stop();
      playAudio(e.dataTransfer.files[0]);
    }
  }

  function keypress(e) {
    // spacebar
    if (e.keyCode == 32 && framework.audioBuffer != undefined) {
      if (!framework.paused) {
        framework.paused = true;
        framework.audioSourceBuffer.stop();
        // Measure how much time passed since the last pause.
        framework.audioStartOffset += framework.audioContext.currentTime - framework.audioStartTime;
      } else {
        framework.paused = false;
        framework.audioStartTime = framework.audioContext.currentTime;

        createAndConnectAudioBuffer();
        framework.audioSourceBuffer.buffer = framework.audioBuffer;
        // Start playback, but make sure we stay in bound of the buffer.
        framework.audioSourceBuffer.start(0, framework.audioStartOffset % framework.audioBuffer.duration);
        framework.audioSourceBuffer.loop = true;
      }
    }
    // t
    if (e.keyCode == 116) {
      // toggle instructions
      if (document.getElementById('visualizerInfo').style.visibility == "hidden") {
        document.getElementById('visualizerInfo').style.visibility = "visible";
      } else {
        document.getElementById('visualizerInfo').style.visibility = "hidden";
      }
    }
  }

});

export default {
  framework: framework
}

export const PI = 3.14159265
export const e = 2.7181718
