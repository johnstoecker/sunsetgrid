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
          color: 0x2222FF,
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



//create a group and add the two cubes
//These cubes can now be rotated / scaled etc as a group
// var group = new THREE.Group();
// group.add( cubeA );
// group.add( cubeB );

//add a city skyline

// const loader = new THREE.TextureLoader();
// loader.crossOrigin = '';
// const texture = loader.load('./building_texture_1.png');
// var texture = new THREE.TextureLoader().load( './building_texture_1.png' );

// immediately use the texture for material creation
// var buildingMaterial = new THREE.MeshBasicMaterial( { map: texture } );

// add gradient for the sun
var buildingUniforms = {
  "darkblue" : {
    type : "c",
    value : new THREE.Color(0x180332)
  },
  "lightblue" : {
    type : "c",
    value : new THREE.Color(0x1d429c)
  },

  "darkpurple" : {
    type : "c",
    value : new THREE.Color(0x20053c)
  },
  "lightpurple" : {
    type : "c",
    value : new THREE.Color(0x20053c)
  },

  "darkpink" : {
    type : "c",
    value : new THREE.Color(0x3f0354)
  },
  "lightpink" : {
    type : "c",
    value : new THREE.Color(0x5e0760)
  },

  "darkishblue" : {
    type : "c",
    value : new THREE.Color(0x423bab)
  },
  "lightishblue" : {
    type : "c",
    value : new THREE.Color(0x4569c2)
  },
};

// 20053c
// 4d196e


var buildingMaterial = new THREE.ShaderMaterial({
  uniforms: buildingUniforms,
  vertexShader: `varying vec2 vUv;
  void main() {
  vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`,
  fragmentShader: `uniform vec3 darkblue;
  uniform vec3 lightblue;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(mix(darkblue, lightblue, vUv.y),1.0);
  }`
});

var buildingMaterial2 = new THREE.ShaderMaterial({
  uniforms: buildingUniforms,
  vertexShader: `varying vec2 vUv;
  void main() {
  vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`,
  fragmentShader: `uniform vec3 darkpurple;
  uniform vec3 lightpurple;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(mix(darkpurple, lightpurple, vUv.y),1.0);
  }`
});

var buildingMaterial3 = new THREE.ShaderMaterial({
  uniforms: buildingUniforms,
  vertexShader: `varying vec2 vUv;
  void main() {
  vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`,
  fragmentShader: `uniform vec3 darkpink;
  uniform vec3 lightpink;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(mix(darkpink, lightpink, vUv.y),1.0);
  }`
});


var buildingMaterial4 = new THREE.ShaderMaterial({
  uniforms: buildingUniforms,
  vertexShader: `varying vec2 vUv;
  void main() {
  vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`,
  fragmentShader: `uniform vec3 darkishblue;
  uniform vec3 lightishblue;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(mix(darkishblue, lightishblue, vUv.y),1.0);
  }`
});


var buildingMaterialBlue = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
var buildingMaterialRed = new THREE.MeshLambertMaterial( {color: 0xff0000} );

var building1Geometry = new THREE.BoxGeometry( 5, 10, 5 );
var building1 = new THREE.Mesh( building1Geometry, buildingMaterialBlue );
building1.position.set(68, 5, -90);
scene.add( building1 );

var building2Geometry = new THREE.BoxGeometry( 5, 10, 5 );
var geometry = new THREE.EdgesGeometry( building2Geometry );
var material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
var building2 = new THREE.LineSegments( geometry, material );
building2.position.set(63, 5, -90);
scene.add( building2 );
window.building2 = building2;

// var building2 = new THREE.Mesh( building2Geometry, buildingMaterial2 );
// building2.position.set(63, 5, -90);
// scene.add( building2 );

var building3Geometry = new THREE.BoxGeometry( 4, 12, 4 );
var building3 = new THREE.Mesh( building3Geometry, buildingMaterial3 );
building3.position.set(58, 6, -90);
scene.add( building3 );
var building3Geometry2 = new THREE.BoxGeometry( 2, 2, 2 );
var building3top = new THREE.Mesh( building3Geometry2, buildingMaterial3 );
building3top.position.set(58, 13, -90);
scene.add( building3top );
window.building3 = building3;
window.building3top = building3top;

var building4Geometry = new THREE.BoxGeometry( 4, 4, 4 );
var building4 = new THREE.Mesh( building4Geometry, buildingMaterialRed);
building4.position.set(54, 2, -90);
scene.add(building4);

var building4Geometry2 = new THREE.Geometry();

building4Geometry2.vertices = [
    new THREE.Vector3( 52, 4, -88 ),
    new THREE.Vector3( 52, 4, -92 ),
    new THREE.Vector3( 56, 4, -92 ),
    new THREE.Vector3( 56, 4, -88 ),
    new THREE.Vector3( 54, 12, -90 ),
];

building4Geometry2.faces = [
    // new THREE.Face3( 0, 1, 2 ),
    // new THREE.Face3( 0, 2, 3 ),
    new THREE.Face3( 1, 0, 4 ),
    new THREE.Face3( 2, 1, 4 ),
    new THREE.Face3( 2, 4, 3 ),
    new THREE.Face3( 3, 4, 0 )
];

// var building4Geometry2 = new THREE.CylinderGeometry( 1, 4, 12, 4 );
var building4top = new THREE.Mesh( building4Geometry2,new THREE.MeshBasicMaterial({
  color: 0x2222FF,
  wireframe: true
}));
// building4top.position.set(54, 10, -90)
scene.add( building4top );
window.building4top = building4top;

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
    // every 3 ticks, update the mountains
    if (count % 3 == 0) {
      updateMountains(array);
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

function updateBuildings(array) {
  building1.geometry.vertices[0].y = 5 + array[350]/8;
  building1.geometry.vertices[1].y = 5 + array[350]/8;
  building1.geometry.vertices[4].y = 5 + array[350]/8;
  building1.geometry.vertices[5].y = 5 + array[350]/8;
  building1.geometry.verticesNeedUpdate = true;

  // indices on edge geometry of top y value
  var indices = [1,7,10,19,25,31,34,43,49,52,55,58];
  for (var i=0; i<indices.length; i++) {
    var index = indices[i];
    building2.geometry.attributes.position.array[index] = 5 + array[330]/8;
  }
  building2.geometry.scale(1,1,1);


  // building2.geometry.vertices[0].y = 5 + array[330]/8;
  // building2.geometry.vertices[1].y = 5 + array[330]/8;
  // building2.geometry.vertices[4].y = 5 + array[330]/8;
  // building2.geometry.vertices[5].y = 5 + array[330]/8;
  // building2.geometry.verticesNeedUpdate = true;

  building3.geometry.vertices[0].y = 6 + array[280]/8;
  building3.geometry.vertices[1].y = 6 + array[280]/8;
  building3.geometry.vertices[4].y = 6 + array[280]/8;
  building3.geometry.vertices[5].y = 6 + array[280]/8;
  building3.geometry.verticesNeedUpdate = true;
  building3top.geometry.vertices[0].y = 1 + array[280]/8;
  building3top.geometry.vertices[1].y = 1 + array[280]/8;
  building3top.geometry.vertices[4].y = 1 + array[280]/8;
  building3top.geometry.vertices[5].y = 1 + array[280]/8;
  building3top.geometry.verticesNeedUpdate = true;
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
