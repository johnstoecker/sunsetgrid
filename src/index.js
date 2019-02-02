import framework from './framework'

import scene from './scene'

import sunsetAudio from './audio'



console.log(framework)

// framework.init()
console.log('asdf')

console.log(scene)


window.addEventListener('load', function() {
  window.addEventListener("keypress", keypress, false);
  window.addEventListener("click", sunsetAudio.playPause);

  function keypress(e) {
    console.log(e)
    // spacebar
    if (e.keyCode == 32) {
      sunsetAudio.playPause();
    }

    if (e.keyCode == 100) {
      console.log("trying to spawn dolhpin")
      scene.spawnDolphin();
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
})
