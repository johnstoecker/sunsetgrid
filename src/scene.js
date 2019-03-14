import * as THREE from 'three';
import Building from './shapes/building';
import Mountains from './shapes/mountains';

// camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, 50);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// useful for checking how many calls/frame -- renderer.info
window.renderer = renderer;

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

var mountains = Mountains.createMountains();
var sunOccluder = Mountains.createSunOccluder();
scene.add(mountains);
scene.add(sunOccluder);


// move -- stretchy stretches from y=0 to the beat. bouncy just moves up and down to the beat (stays the same size)
// cubes, pyramids, frustums (pyramid with flat top)
// ah, right they aren't cubes, but rather rectangular prisms
var buildingData = [
  {
    dimensions: [5,10,5],position: [68,5,-90],color: 0xFF6C11,frequency:350,shape:"cube",move:"stretchy"
  },{
    dimensions: [5,10,5],position: [63,5,-90],color: 0xFF3864,frequency:330,shape:"cube",move:"stretchy"
  },{
    dimensions: [4,12,4],position: [58,6,-90],color: 0x2DE2E6,frequency:280,shape:"cube",move:"stretchy"
  },{
    dimensions: [2,2,2],position: [58,13,-90],color: 0x2DE2E6,frequency:280,shape:"cube",move:"bouncy"
  },{
    dimensions: [4,4,4],position: [54,2,-90],color: 0x023788,frequency:250,shape:"cube",move:"stretchy"
  }, {
    dimensions: [4,8,4], position: [54,8, -90], color: 0x023788, frequency: 250, shape:"pyramid",move:"bouncy"
  },{
    dimensions: [6,14,6],position: [44,7,-90],color: 0x650D89,frequency:220,shape:"cube",move:"stretchy"
  },{
    dimensions: [2,8,2],position: [38,4,-90],color: 0x920075,frequency:200,shape:"cube",move:"stretchy"
  },{
    dimensions: [3,12,3],position: [36,6,-90],color: 0xF6019D,frequency:190,shape:"cube",move:"stretchy"
  },{
    dimensions: [4,6,4],position: [32,3,-90],color: 0xD40078,frequency:180,shape:"cube",move:"stretchy"
  },{
    dimensions: [3,4,3],position: [32,8,-90],color: 0xD40078,frequency:180,shape:"cube",move:"bouncy"
  },{
    dimensions: [1,2,1],position: [32,11,-90],color: 0xD40078,frequency:180,shape:"cube",move:"bouncy"
  },{
    dimensions: [10,8,10],position: [25,4,-90],color: 0xFD3777,frequency:170,shape:"cube",move:"stretchy"
  },{
    dimensions: [8,2,8],position: [25,9,-90],color: 0xFD3777,frequency:170,shape:"cube",move:"bouncy"
  },{
    dimensions: [4,18,8],position: [18,9,-90],color: 0xF706CF,frequency:160,shape:"cube",move:"stretchy"
  },{
    dimensions: [6,12,6],position: [12,6,-90],color: 0xFD1D53,frequency:140,shape:"cube",move:"stretchy"
  }, {
    // middle double tower
    dimensions: [6,10,6,4,4], position: [6,5, -90], color: 0xF9C80E, frequency: 130, shape:"frustum",move:"stretchy"
  }, {
    dimensions: [6,10,6,4,4], position: [-6,5, -90], color: 0xF9C80E, frequency: 130, shape:"frustum",move:"stretchy"
  }, {
    dimensions: [12,2,2], position: [0,6, -90], color: 0xF9C80E, frequency: 130, shape:"cube",move:"bouncy"
  }, {
    dimensions: [8,18,8], position: [-18,8, -90], color: 0xFF4365, frequency: 120, shape:"pyramid",move:"stretchy"
  }, {
    dimensions: [4,9,4], position: [-14,4.5, -90], color: 0xFF4365, frequency: 120, shape:"pyramid",move:"stretchy"
  }, {
    dimensions: [4,9,4], position: [-22,4.5, -90], color: 0xFF4365, frequency: 120, shape:"pyramid",move:"stretchy"

// second row
  },{
    dimensions: [4,2,4],position: [68,1,-80],color: 0xD40078,shape:"cube"
  },{
    dimensions: [6,4,6],position: [63,2,-80],color: 0xFF3864,shape:"cube"
  },{
    dimensions: [4,5,4],position: [58,2.5,-80],color: 0xF706CF,shape:"cube"
  },{
    dimensions: [4,4,4],position: [54,2,-80],color: 0x541388,shape:"pyramid"
  },{
    dimensions: [1,5,1],position: [51.5,2.5,-80],color: 0x791E94,shape:"cube"
  },{
    dimensions: [3,4,3],position: [49.5,2,-80],color: 0xD40078,shape:"cube"
  },{
    dimensions: [6,8,6],position: [45,4,-80],color: 0xF706CF,shape:"cube"
  },{
    dimensions: [6,3,6],position: [45,9.5,-80],color: 0xF706CF,shape:"pyramid"
  },{
    dimensions: [4,6,4],position: [40,3,-80],color: 0x023788,shape:"cube"
  },{
    dimensions: [2,4,4],position: [37,2,-80],color: 0xD40078,shape:"cube"
  },{
    dimensions: [4,5,4],position: [34,2.5,-80],color: 0x540D6E,shape:"cube"
  },{
    dimensions: [7,7,4],position: [28.5,3.5,-80],color: 0xF6019D,shape:"cube"
  },{
    dimensions: [1,2,1],position: [26.5,8,-80],color: 0xF6019D,shape:"cube"
  },{
    dimensions: [1,2,1],position: [30.5,8,-80],color: 0xF6019D,shape:"cube"
  },{
    dimensions: [4,6,4],position: [23,3,-80],color: 0xF6019D,shape:"cube"
  },{
    dimensions: [3,3,3,2,2],position: [19.5,1.5,-80],color: 0x540D6E,shape:"frustum"
  }
]

// 540D6E
// 791E94
// 541388

var buildings = [];
for(var i=0; i<buildingData.length; i++) {
  var building = Building.createBuilding(buildingData[i]);
  scene.add(building.edges);
  scene.add(building.inner);
  buildings.push(building);
}
window.buildings = buildings;

// var hemLight = new THREE.HemisphereLight( 0xff0000, 0x0000ff, 1 );
// scene.add( hemLight );

// var directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
// directionalLight.castShadow = true;
// directionalLight.position.set(0,50,-150);
// directionalLight.target = cube;
//
var light = new THREE.PointLight( 0xffffff, 2, 150 );
light.position.set( 0, 10, -95 );
scene.add( light );
window.light = light;

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );


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
    // every 3 ticks, update the ~mountains~ buildings
    if (count % 3 == 0) {
      updateBuildings(array);
    }
    if (averageVolume > 20 && averageVolume > 1.25 * movingAverageVolume && lastBurst == -1) {
      lastBurst = count;
      doBurst();
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

function stretchRectangularBuilding(building, val) {
  // indices on edge geometry of top y value
  var indices = [4,16,19,22,28,37,40,46,55,58,67,70];
  for (var i=0; i<indices.length; i++) {
    var index = indices[i];
    building.edges.geometry.attributes.position.array[index] = val;
  }
  building.edges.geometry.attributes.position.needsUpdate = true;

  var indices = [4,5,6,7];
  for(var i=0; i<indices.length; i++) {
    var index = indices[i];
    building.inner.geometry.vertices[index].y = val;
  }
  building.inner.geometry.verticesNeedUpdate = true;
}

function stretchPyramidBuilding(building, val) {
  // indices on edge geometry of top y value
  var indices = [4,10,22,34];
  for (var i=0; i<indices.length; i++) {
    var index = indices[i];
    building.edges.geometry.attributes.position.array[index] = val;
  }
  building.edges.geometry.attributes.position.needsUpdate = true;

  building.inner.geometry.vertices[4].y = val;
  building.inner.geometry.verticesNeedUpdate = true;
}

function moveBuilding(building, val) {
  // translateZ instead
  building.edges.position.set(0,val,0);
  building.inner.position.set(0,val,0);
}

function updateBuildings(array) {
  for(var i=0; i<buildings.length; i++) {
    var val = array[buildings[i].data.frequency]/8;
    if (buildings[i].data.move == "bouncy") {
      moveBuilding(buildings[i], val);
    } else if (buildings[i].data.move=="stretchy" && (buildings[i].data.shape == "cube" || buildings[i].data.shape == "frustum")) {
      stretchRectangularBuilding(buildings[i], val + buildings[i].data.dimensions[1]);
    } else if (buildings[i].data.move == "stretchy" && (buildings[i].data.shape == "pyramid")) {
      stretchPyramidBuilding(buildings[i], val + buildings[i].data.dimensions[1]);
    }
  }
}


function updateMountains(array) {
  // mountains.geometry.vertices[1].y = 20 + array[350]/15;
  // mountains.geometry.vertices[4].y = 5 + array[330]/25;
  // mountains.geometry.vertices[5].y = 12 + array[280]/15;
  // mountains.geometry.vertices[6].y = 2 + array[280]/25;
  // mountains.geometry.vertices[7].y = 16 + array[210]/15;
  // // mountains.geometry.vertices[13].y = 3 + array[170]/45;
  // mountains.geometry.vertices[17].y = 13 + array[170]/15;
  // mountains.geometry.vertices[18].y = 10 + array[170]/25;
  // mountains.geometry.vertices[19].y = 18 + array[160]/15;
  // mountains.geometry.vertices[20].y = 19 + array[140]/15;
  // mountains.geometry.vertices[21].y = 5 + array[130]/25;
  // mountains.geometry.vertices[22].y = 22 + array[120]/15;
  // mountains.geometry.vertices[23].y = 6 + array[110]/35;
  //
  // mountains.geometry.verticesNeedUpdate = true;
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
  var myImage = new Image();
  // the browser caches the image -- so if I spawn another dolphin, browser
  // just loads that same dolphin. to get a true copy, mangle the source
  // so the browser thinks its different. cool!
  myImage.src = 'dolphin_animation_small.gif?' + Math.random();
  myImage.style.position = "absolute";
  myImage.style.top = randomYTop + "%";
  myImage.style.left = randomX + "px";
  document.body.appendChild(myImage);
  setTimeout(function() { document.body.removeChild(myImage);}, 5000);
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

export default {
  spawnDolphin: spawnDolphin
}
