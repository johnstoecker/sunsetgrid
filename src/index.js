import scene from './scene'

import sunsetAudio from './audio'

window.addEventListener('load', function() {
  window.addEventListener("keypress", keypress, false);
  // window.addEventListener("click", sunsetAudio.playPause);
  document.getElementById("playButton").addEventListener("click", sunsetAudio.playPause);
  document.getElementById("pauseButton").addEventListener("click", sunsetAudio.playPause);
  document.getElementById("nextButton").addEventListener("click", sunsetAudio.nextStream);
  document.getElementById("dolphinButton").addEventListener("click", scene.spawnDolphin);

  function keypress(e) {
    // spacebar
    if (e.keyCode == 32) {
      sunsetAudio.playPause();
    }
    // 'd'
    if (e.keyCode == 100) {
      scene.spawnDolphin();
    }

    // 't'
    if (e.keyCode == 116) {
      // toggle instructions
      if (document.getElementById('visualizerInfo').style.visibility == "hidden") {
        document.getElementById('visualizerInfo').style.visibility = "visible";
      } else {
        document.getElementById('visualizerInfo').style.visibility = "hidden";
      }
    }
  }
})
