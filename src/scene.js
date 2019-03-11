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

var cubeBuildingData = [
  {
    dimensions: [5,10,5],position: [68,5,-90],color: 0xff0000,frequency:350
  },{
    dimensions: [5,10,5],position: [63,5,-90],color: 0xff0000,frequency:330
  },{
    dimensions: [4,12,4],position: [58,6,-90],color: 0xff0000,frequency:280
  },{
    dimensions: [2,2,2],position: [58,13,-90],color: 0xff0000,frequency:280
  },{
    dimensions: [4,4,4],position: [54,2,-90],color: 0xff0000,frequency:250
  }
]

var cubeBuildings = [];
for(var i=0; i<cubeBuildingData.length; i++) {
  var building = Building.createCube(cubeBuildingData[i].dimensions,cubeBuildingData[i].position, cubeBuildingData[i].color)
  scene.add(building.edges);
  scene.add(building.inner);
  cubeBuildings.push({
    building: building,
    data: cubeBuildingData[i]
  })
}

//
// var building1 = Building.createCube([5,10,5], [68, 5, -90], 0xff0000);
// scene.add(building1.edges);
// scene.add(building1.inner);
//
// var building2 = Building.createCube([5,10,5], [63, 5, -90], 0xff0000);
// scene.add(building2.edges);
// scene.add(building2.inner);
//
// var building3 = Building.createCube([4,12,4], [58,6, -90], 0xff0000);
// scene.add(building3.edges);
// scene.add(building3.inner);
// window.building3 = building3;
// var building3Top = Building.createCube([2,2,2],[58,13,-90], 0xff0000);
// scene.add(building3Top.edges);
// scene.add(building3Top.inner);
// window.building3Top = building3Top;
//
// var building4 = Building.createCube([4,4,4], [54, 2, -90], 0xff0000);
// scene.add(building4.edges);
// scene.add(building4.inner);
var building4Top = Building.createPyramid([4,8,4], [54, 8, -90], 0xff0000);
scene.add(building4Top.edges);
scene.add(building4Top.inner);


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
    // every 3 ticks, update the ~mountains~ buildlings
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

function updateRectangularBuilding(building, val) {
  // indices on edge geometry of top y value
  var indices = [1,7,10,19,25,31,34,43,49,52,55,58];
  for (var i=0; i<indices.length; i++) {
    var index = indices[i];
    building.edges.geometry.attributes.position.array[index] = val;
  }
  building.edges.geometry.attributes.position.needsUpdate = true;

  var indices = [0,1,4,5];
  for(var i=0; i<indices.length; i++) {
    var index = indices[i];
    building.inner.geometry.vertices[index].y = val;
  }
  building.inner.geometry.verticesNeedUpdate = true;
}

function updateBuildings(array) {
  for(var i=0; i<cubeBuildings.length; i++) {
    var val = array[cubeBuildings[i].data.frequency]/8 + cubeBuildings[i].data.dimensions[1]/2;
    updateRectangularBuilding(cubeBuildings[i].building, val)
  }
  // updateRectangularBuilding(building1, 5 + array[350]/8);
  // updateRectangularBuilding(building2, 5 + array[330]/8);
  // updateRectangularBuilding(building3, 6 + array[280]/8);
  // updateRectangularBuilding(building3Top, 1 + array[280]/8);
  // updateRectangularBuilding(building4, 2 + array[250]/8);

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
