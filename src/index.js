import scene from './scene'

import sunsetAudio from './audio'

window.addEventListener('load', function() {
  window.addEventListener("keypress", keypress, false);
  // window.addEventListener("click", sunsetAudio.playPause);
  document.getElementById("playButton").addEventListener("click", sunsetAudio.playPause);
  document.getElementById("pauseButton").addEventListener("click", sunsetAudio.playPause);
  document.getElementById("nextButton").addEventListener("click", sunsetAudio.nextStream);
  document.getElementById("dolphinButton").addEventListener("click", scene.spawnDolphin);
  document.getElementById("questionMark").addEventListener("click", showAbout, false);
  // document.getElementById("questionMark").addEventListener("blur", hideAbout, false);
  window.addEventListener('click', windowClickListener, false);

  function windowClickListener (event) {
    if (!document.getElementById("aboutContainer").contains(event.target) &&
    !document.getElementById("questionMark").contains(event.target)) {
      document.getElementById("aboutContainer").style.visibility = "hidden";
    }
    scene.spawnDolphin();
  }

  function showAbout () {
    document.getElementById("aboutContainer").style.visibility = "visible"
  }

  function hideAbout (event) {
    console.log(event);
    if (!document.getElementById("aboutContainer").contains(event.target) && document.getElementById("aboutContainer") != event.target) {
      document.getElementById("aboutContainer").style.visibility = "hidden"
    }
  }

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
