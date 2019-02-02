import * as THREE from 'three';

// camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, 50);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// moving grid
var division = 20;
var limit = 100;
// pulse me to the beat
var grid = new THREE.GridHelper(limit * 2, division, "purple", "purple");

var gridUniforms = {
  time: {
    value: 0
  },
  limits: {
    value: new THREE.Vector2(-limit, limit)
  },
  speed: {
    // set me to the beat
    value: 25
  },
  color1: {
    type: "c",
    value: new THREE.Color(0xff0000)
  }
};

var moveable = [];
for (let i = 0; i <= division; i++) {
  moveable.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
}
grid.geometry.addAttribute('moveable', new THREE.BufferAttribute(new Uint8Array(moveable), 1));
grid.material = new THREE.ShaderMaterial({
  uniforms: gridUniforms,
  vertexShader: `
    uniform float time;
    uniform vec2 limits;
    uniform float speed;

    attribute float moveable;

    uniform vec3 color1;

    void main() {
      float limLen = limits.y - limits.x;
      vec3 pos = position;
      if (floor(moveable + 0.5) > 0.5){ // if a point has "moveable" attribute = 1
        float dist = speed * time;
        float currPos = mod((pos.z + dist) - limits.x, limLen) + limits.x;
        pos.z = currPos;
      }
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;

    void main() {
      gl_FragColor = vec4(color1, 1.);
    }
  `,
  vertexColors: THREE.VertexColors
});

scene.add(grid);

// add gradient for the sun
var uniforms = {
  "color1" : {
    type : "c",
    value : new THREE.Color(0xf4d676)
  },
  "color2" : {
    type : "c",
    value : new THREE.Color(0xff1690)
  },
};

var material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: `varying vec2 vUv;
  void main() {
  vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`,
  fragmentShader: `uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(mix(color1, color2, vUv.y),1.0);
  }`
});

// add a setting sun
var geometry = new THREE.CircleGeometry( 11, 32 );
var circle = new THREE.Mesh( geometry, material );
circle.position.set(0,9,-110)
scene.add( circle );

//add some mountains in the background
var geometry = new THREE.Geometry();

geometry.vertices.push(
  // 0-2 (far right)
    new THREE.Vector3(60,0,-100),
    new THREE.Vector3(70,20,-100), //far right peak
    new THREE.Vector3(78,0,-100),
// 3-4
    new THREE.Vector3(42,0,-100),
    new THREE.Vector3(56, 5, -100), //2nd peak
// 5-6
    new THREE.Vector3(49,12,-100),
    new THREE.Vector3(35,2,-100),
// 7-8
    new THREE.Vector3(30,16,-100), //3rd peak, right of sun
    new THREE.Vector3(15, 0, -100),
// 9-11 (right of the sun)
    new THREE.Vector3(12, 10, -100),
    new THREE.Vector3(3, 3, -100),
    new THREE.Vector3(5, 0, -100),
// 12-15 (left of sun)
    new THREE.Vector3(-5, 0, -100),
    new THREE.Vector3(-14, 6, -100),
    new THREE.Vector3(-12, 0, -100),
    new THREE.Vector3(-15, 0, -100),
// 16-17
    new THREE.Vector3(-21, 0, -100),
    new THREE.Vector3(-17, 13, -100),
// 18 (the middle one)
    new THREE.Vector3(-24, 10, -100),
// 19-21
    new THREE.Vector3(-22, 18, -100),
    new THREE.Vector3(-28, 19, -100),
    new THREE.Vector3(-31, 5, -100),
// 22-23
    new THREE.Vector3(-49, 22, -100),
    new THREE.Vector3(-55, 6, -100),
// 24-25 (bottom ones)
    new THREE.Vector3(-45, 0, -100),
    new THREE.Vector3(-59, 0, -100)
);

geometry.faces.push(
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(3, 4, 0),
    new THREE.Face3(4, 1, 0),
    new THREE.Face3(4, 5, 1),
    new THREE.Face3(3, 5, 4),
    new THREE.Face3(6, 5, 3),
    new THREE.Face3(6, 7, 5),
    new THREE.Face3(8, 7, 6),
    new THREE.Face3(8, 9, 7),
    new THREE.Face3(11, 9, 8),
    new THREE.Face3(10, 9, 11),
    new THREE.Face3(12, 10, 11),
    new THREE.Face3(14, 13, 12),
    new THREE.Face3(15, 13, 14),
    new THREE.Face3(16, 17, 13),
    new THREE.Face3(18, 17, 16),
    new THREE.Face3(18, 19, 17),
    new THREE.Face3(20, 19, 18),
    new THREE.Face3(21, 20, 18),
    new THREE.Face3(21, 18, 16),
    new THREE.Face3(22, 20, 21),
    new THREE.Face3(24, 22, 21),
    new THREE.Face3(23, 24, 22),
    new THREE.Face3(25, 23, 24)

);

var mountains = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: 0x2222AA,
          wireframe: true
        }))
// mountains.position.set(0,0,-100);
scene.add(mountains);

var sunOccluderGeometry = new THREE.Geometry();
sunOccluderGeometry.vertices.push(
  new THREE.Vector3(-5, 0, -101),
  new THREE.Vector3(3, 3, -101),
  new THREE.Vector3(5, 0, -101),
  new THREE.Vector3(12, 10, -101),
  new THREE.Vector3(15, 0, -101),
  new THREE.Vector3(0, -10, -101)
);
sunOccluderGeometry.faces.push(
    new THREE.Face3(2, 1, 0),
    new THREE.Face3(3, 1, 2),
    new THREE.Face3(4, 3, 2),
    new THREE.Face3(2, 0, 5)
);
var sunOccluder = new THREE.Mesh(
        sunOccluderGeometry,
        new THREE.MeshBasicMaterial({
          color: 0x000000
        }));

scene.add(sunOccluder);


var clock = new THREE.Clock();
var time = 0;
var count = 0;
var volumeAverages = [50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50];
var lastBurst = -1;

render();

function render() {
  requestAnimationFrame(render);
  count = count + 1;
  if (window.sunsetAnalyzer) {
    var array =  new Uint8Array(window.sunsetAnalyzer.frequencyBinCount);
    window.sunsetAnalyzer.getByteFrequencyData(array);
    var averageVolume = getAverageVolume(array, 80);
    // drop other frequencies, only care about bass
    volumeAverages.push(averageVolume);
    var movingAverageVolume = getAverageVolume(volumeAverages, volumeAverages.length);
    // every 3 ticks, update the mountains
    if (count % 3 == 0) {
      updateMountains(array);
    }
    if (averageVolume > 20 && averageVolume > 1.25 * movingAverageVolume && lastBurst == -1) {
      lastBurst = count;
      doBurst();
      console.log(array.length)
    }
    if (count - lastBurst > 15) {
      lastBurst = -1;
    }
    volumeAverages.shift()
  }

  time += clock.getDelta();
  grid.material.uniforms.time.value = time;
  renderer.render(scene, camera);
}

function updateMountains(array) {
  mountains.geometry.vertices[1].y = 20 + array[350]/15;
  mountains.geometry.vertices[4].y = 5 + array[330]/25;
  mountains.geometry.vertices[5].y = 12 + array[280]/15;
  mountains.geometry.vertices[6].y = 2 + array[280]/25;
  mountains.geometry.vertices[7].y = 16 + array[210]/15;
  // mountains.geometry.vertices[13].y = 3 + array[170]/45;
  mountains.geometry.vertices[17].y = 13 + array[170]/15;
  mountains.geometry.vertices[18].y = 10 + array[170]/25;
  mountains.geometry.vertices[19].y = 18 + array[160]/15;
  mountains.geometry.vertices[20].y = 19 + array[140]/15;
  mountains.geometry.vertices[21].y = 5 + array[130]/25;
  mountains.geometry.vertices[22].y = 22 + array[120]/15;
  mountains.geometry.vertices[23].y = 6 + array[110]/35;

  mountains.geometry.verticesNeedUpdate = true;
}

function doBurst() {
    uniforms["color1"].value.offsetHSL( 0.05, 0, 0 );
    uniforms["color1"].needsUpdate = true
    uniforms["color2"].value.offsetHSL( -0.05, 0, 0 );
    uniforms["color2"].needsUpdate = true
    gridUniforms["color1"].value.offsetHSL(0.05, 0, 0);
    gridUniforms["color1"].needsUpdate = true;
    podLocationX = Math.floor(Math.random() * (window.screen.availWidth - 250))
    podLocationY = Math.floor(Math.random())
}

// have dolphins generally spawn near each other
var podLocationX = 50;
var podLocationY = 10;

function spawnDolphin() {
  var randomX = podLocationX + Math.floor(Math.random() * 150)
  var randomY = podLocationY + Math.floor(Math.random() * 10)
  var randomYTop =  randomY + 35;
  var randomSize = 50 + randomYTop;
  var myImage = new Image();
  // the browser caches the image -- so if I spawn another dolphin, browser
  // just loads that same dolphin. to get a true copy, mangle the source
  // so the browser thinks its different. cool!
  myImage.src = '../dolphin.gif?' + Math.random();
  myImage.style.position = "absolute";
  myImage.style.top = randomYTop + "%";
  myImage.style.left = randomX + "px";
  // give the dolphins a crude perspective. closer = bigger dolphin
  myImage.style.height = randomSize + "px";
  document.body.appendChild(myImage);
  // <img id="neonDolphin" src="../dolphin.gif" style="position:absolute; top: 35%; left: 50px; height: 50px;">

}

function getAverageVolume(array, maxSize) {
      var values = 0;
      var average;

      // get all the frequency amplitudes
      for (var i = 0; i < maxSize; i++) {
          values += array[i];
      }

      average = values / maxSize;
      return average;
}

//TODO: dont export the scene -- only the functions necessary to interact with it
export default {
  spawnDolphin: spawnDolphin
}
