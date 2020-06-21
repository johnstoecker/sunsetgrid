import * as THREE from 'three';
import Building from './shapes/building';

// camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, 50);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer({ alpha: true });// THREE.CanvasRenderer({ alpha: true } );
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



var gridBaseGeometry = new THREE.BufferGeometry();

var vertices = new Float32Array( [
  -110,-0.1,50,  110,-0.1,-112,   -110,-0.1,-112,
  -110,-0.1,50,  110,-0.1,40,     110, -0.1, -112
]);
gridBaseGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
var innerMaterial = new THREE.MeshBasicMaterial( {
    color: 0x000000
} );

var gridBase = new THREE.Mesh( gridBaseGeometry, innerMaterial );
scene.add(gridBase);
window.gridBase = gridBase;

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
    dimensions: [6,10,6,4,4], position: [6,5, -90], color: 0xF9C80E, frequency: 110, shape:"frustum",move:"stretchy"
  }, {
    dimensions: [6,10,6,4,4], position: [-6,5, -90], color: 0xF9C80E, frequency: 110, shape:"frustum",move:"stretchy"
  }, {
    dimensions: [12,2,2], position: [0,6, -90], color: 0xF9C80E, frequency: 110, shape:"cube",move:"bouncy"
  }, {
    dimensions: [8,18,8], position: [-18,8, -90], color: 0xFF4365, frequency: 90, shape:"pyramid",move:"stretchy"
  }, {
    dimensions: [4,9,4], position: [-14,4.5, -90], color: 0xFF4365, frequency: 90, shape:"pyramid",move:"stretchy"
  }, {
    dimensions: [4,9,4], position: [-22,4.5, -90], color: 0xFF4365, frequency: 90, shape:"pyramid",move:"stretchy"
  },{
    dimensions: [4,12,4],position: [-26,6,-90],color: 0xF706CF,frequency:70,shape:"cube",move:"stretchy"
  },{
    dimensions: [2,2,2],position: [-26,13,-90],color: 0xF706CF,frequency:70,shape:"cube",move:"bouncy"
  },{
    dimensions: [6,14,6],position: [-31,7,-90],color: 0xF9C80E,frequency:50,shape:"cube",move:"stretchy"
  },{
    dimensions: [5,11,5],position: [-36.5,5.5,-90],color: 0xFD3777,frequency:35,shape:"cube",move:"stretchy",divisor:10
  }, {
    dimensions: [5,2,5], position: [-36.5,12, -90], color: 0xFD3777, frequency: 35, shape:"pyramid",move:"bouncy",divisor:10
  },{
    dimensions: [6,14,6],position: [-42,7,-90],color: 0x540D6E,frequency:25,shape:"cube",move:"stretchy",divisor:10
  },{
    dimensions: [8,11,8],position: [-49,5.5,-90],color: 0xF6019D,frequency:15,shape:"cube",move:"stretchy",divisor:12
  },{
    dimensions: [1,3,1],position: [-47,12.5,-90],color: 0xF6019D,frequency:15,shape:"cube",move:"bouncy",divisor:12
  },{
    dimensions: [1,3,1],position: [-51,12.5,-90],color: 0xF6019D,frequency:15,shape:"cube",move:"bouncy",divisor:12
  }
]


var colors = [0xD40078, 0xFF3864, 0xF706CF, 0x541388, 0x791E94, 0x023788, 0xF6019D, 0x2DE2E6]

function getRandomBuildingData(positionX, sizeX) {
  var buildingChoicePicker = Math.random() * 10;
  let color = colors[Math.floor(Math.random() * colors.length)]
  // cube
  if (buildingChoicePicker > 7) {
    var dimensionY = Math.floor(Math.random()*7) + 2;
    return [{
      dimensions: [sizeX, dimensionY, sizeX], position: [positionX, dimensionY/2, -80], color: color, shape: "cube", move: "forward"
    }]
    // pyramid
  } else if(buildingChoicePicker > 6){
    var dimensionY = Math.floor(Math.random() *7)+2;
    return [{
      dimensions: [sizeX, dimensionY, sizeX], position: [positionX, dimensionY/2, -80], color: color, shape: "pyramid", move: "forward"
    }]
    //frustum
  } else if(buildingChoicePicker > 5) {
    var dimensionY = Math.floor(Math.random() * 7)+2;
    return [{
      dimensions: [sizeX, dimensionY, sizeX, 2, 2], position: [positionX, dimensionY/2, -80], color: color, shape: "frustum", move: "forward"
    }]
    // 1 cube on top of another
  } else if(buildingChoicePicker > 4) {
    var dimensionY = Math.floor(Math.random() * 5)+2;
    var topDimensionY = Math.floor(Math.random()*3)+1;
    var topDimensionX = sizeX -2;
    return [{
      dimensions: [sizeX, dimensionY, sizeX], position: [positionX, dimensionY/2, -80], color: color, shape: "cube", move: "forward"
    }, {
      dimensions: [topDimensionX, topDimensionY, topDimensionX], position: [positionX, dimensionY+topDimensionY/2, -80], color: color, shape: "cube", move: "forward"
    }]
    // cube with two cube towers
  } else if(buildingChoicePicker > 3) {
    var dimensionY = Math.floor(Math.random() * 7)+2;
    var topDimensionY = Math.floor(Math.random()*2)+1;
    return [{
      dimensions: [sizeX, dimensionY, sizeX], position: [positionX, dimensionY/2, -80], color: color, shape: "cube", move: "forward"
    }, {
      dimensions: [1, topDimensionY, 1], position: [positionX - sizeX/4, dimensionY + topDimensionY/2, -80], color: color, shape: "cube", move: "forward"
    }, {
      dimensions: [1, topDimensionY, 1], position: [positionX + sizeX/4, dimensionY + topDimensionY/2, -80], color: color, shape: "cube", move: "forward"
    }]
    //cube with pyramid tower
  } else if(buildingChoicePicker > 2) {
    var dimensionY = Math.floor(Math.random() * 5)+2;
    var topDimensionY = Math.floor(Math.random()*3)+2;
    return [{
      dimensions: [sizeX, dimensionY, sizeX], position: [positionX, dimensionY/2, -80], color: color, shape: "cube", move: "forward"
    }, {
      dimensions: [sizeX, topDimensionY, sizeX], position: [positionX, dimensionY + topDimensionY/2, -80], color: color, shape: "pyramid", move: "forward"
    }]
    // frustrum with cube on top
  } else if (buildingChoicePicker > 1) {
    var dimensionY = Math.floor(Math.random() * 7)+2;
    var topDimensionY = Math.floor(Math.random()*3)+2;
    return [{
      dimensions: [sizeX, dimensionY, sizeX, 2, 2], position: [positionX, dimensionY/2, -80], color: color, shape: "frustum", move: "forward"
    }, {
      dimensions: [sizeX-2, topDimensionY, sizeX-2], position: [positionX, dimensionY + topDimensionY/2, -80], color: color, shape: "cube", move: "forward"
    }]
  // 3 cubes on top of each other
  } else {
    var dimensionY = Math.floor(Math.random() * 2)+2;
    return [{
      dimensions: [sizeX, dimensionY, sizeX], position: [positionX, dimensionY/2, -80], color: color, shape: "cube", move: "forward"
    }, {
      dimensions: [sizeX, dimensionY, sizeX], position: [positionX, dimensionY * 1.5, -80], color: color, shape: "cube", move: "forward"
    }, {
      dimensions: [sizeX, dimensionY, sizeX], position: [positionX, dimensionY * 2.5, -80], color: color, shape: "cube", move: "forward"
    }]
  }
}

function getNewBuildingRowData() {
  var sizeX = Math.floor(Math.random() * 4 + 3);
  var currentX = sizeX / 2 + 2;

  var newRowData = []

  while (currentX < 70) {
    newRowData = newRowData.concat(getRandomBuildingData(currentX, sizeX));
    currentX = currentX + sizeX / 2;
    sizeX = Math.floor(Math.random() * 4 + 3);
    currentX = currentX + sizeX / 2;
  }

  currentX = - sizeX / 2 - 2;
  while (currentX > -70) {
    newRowData = newRowData.concat(getRandomBuildingData(currentX, sizeX));
    currentX = currentX - sizeX / 2;
    sizeX = Math.floor(Math.random() * 4 + 3);
    currentX = currentX - sizeX / 2;
  }

  return newRowData;
}



function getBuildingRowData() {
// second row
  return [{
    dimensions: [4,2,4],position: [68,1,-80],color: 0xD40078,shape:"cube", move: "forward"
  },{
    dimensions: [6,4,6],position: [63,2,-80],color: 0xFF3864,shape:"cube", move: "forward"
  },{
    dimensions: [4,5,4],position: [58,2.5,-80],color: 0xF706CF,shape:"cube", move: "forward"
  },{
    dimensions: [4,4,4],position: [54,2,-80],color: 0x541388,shape:"pyramid", move: "forward"
  },{
    dimensions: [1,5,1],position: [51.5,2.5,-80],color: 0x791E94,shape:"cube", move: "forward"
  },{
    dimensions: [3,4,3],position: [49.5,2,-80],color: 0xD40078,shape:"cube", move: "forward"
  },{
    dimensions: [6,8,6],position: [45,4,-80],color: 0xF706CF,shape:"cube", move: "forward"
  },{
    dimensions: [6,3,6],position: [45,9.5,-80],color: 0xF706CF,shape:"pyramid", move: "forward"
  },{
    dimensions: [4,6,4],position: [40,3,-80],color: 0x023788,shape:"cube", move: "forward"
  },{
    dimensions: [2,4,4],position: [37,2,-80],color: 0xD40078,shape:"cube", move: "forward"
  },{
    dimensions: [4,5,4],position: [34,2.5,-80],color: 0x540D6E,shape:"cube", move: "forward"
  },{
    dimensions: [7,7,4],position: [28.5,3.5,-80],color: 0xF6019D,shape:"cube", move: "forward"
  },{
    dimensions: [1,2,1],position: [26.5,8,-80],color: 0xF6019D,shape:"cube", move: "forward"
  },{
    dimensions: [1,2,1],position: [30.5,8,-80],color: 0xF6019D,shape:"cube", move: "forward"
  },{
    dimensions: [4,6,4],position: [23,3,-80],color: 0xF6019D,shape:"cube", move: "forward"
  },{
    dimensions: [3,3,3,2,2],position: [19.5,1.5,-80],color: 0x540D6E,shape:"frustum", move: "forward"
  },{
    dimensions: [4,8,6],position: [15,4,-80],color: 0x2DE2E6,shape:"pyramid", move: "forward"
  },{
    dimensions: [4,2,4],position: [11,1,-80],color: 0xD40078,shape:"cube", move: "forward"
  },{
    dimensions: [4,6,4,2,2],position: [11,5,-80],color: 0xD40078,shape:"frustum", move: "forward"
  },{
    dimensions: [7,3,7],position: [5.5,1.5,-80],color: 0x541388,shape:"cube", move: "forward"
  },{
    dimensions: [4,1,4],position: [5.5,3.5,-80],color: 0x541388,shape:"cube", move: "forward"
  },{
    dimensions: [3,4,3],position: [-3.5,2,-80],color: 0x791E94,shape:"cube", move: "forward"
  },{
    dimensions: [3,3,3],position: [-3.5,5.5,-80],color: 0x791E94,shape:"pyramid", move: "forward"
  },{
    dimensions: [4,5,4],position: [-7,2.5,-80],color: 0xF706CF,shape:"cube", move: "forward"
  },{
    dimensions: [1,5,1],position: [-9.5,2.5,-80],color: 0x791E94,shape:"cube", move: "forward"
  },{
    dimensions: [4,2,4],position: [-12,1,-80],color: 0xD40078,shape:"cube", move: "forward"
  },{
    dimensions: [4,4,4],position: [-16,2,-80],color: 0x541388,shape:"pyramid", move: "forward"
  },{
    dimensions: [6,4,6],position: [-21,2,-80],color: 0xFF3864,shape:"cube", move: "forward"
  },{
    dimensions: [7,7,4],position: [-27.5,3.5,-80],color: 0xF6019D,shape:"cube", move: "forward"
  },{
    dimensions: [1,2,1],position: [-25.5,8,-80],color: 0xF6019D,shape:"cube", move: "forward"
  },{
    dimensions: [1,2,1],position: [-29.5,8,-80],color: 0xF6019D,shape:"cube", move: "forward"
  },{
    dimensions: [2,4,4],position: [-32,2,-80],color: 0xD40078,shape:"cube", move: "forward"
  },{
    dimensions: [4,6,4],position: [-35,3,-80],color: 0xF6019D,shape:"cube", move: "forward"
  },{
    dimensions: [3,3,3,2,2],position: [-38.5,1.5,-80],color: 0x540D6E,shape:"frustum", move: "forward"
  },{
    dimensions: [4,5,4],position: [-42,2.5,-80],color: 0x540D6E,shape:"cube", move: "forward"
  },{
    dimensions: [4,8,6],position: [-46,4,-80],color: 0x2DE2E6,shape:"pyramid", move: "forward"
  },{
    dimensions: [4,6,4,2,2],position: [-48,3,-80],color: 0xD40078,shape:"frustum", move: "forward"
  }];
}
// 540D6E
// 791E94
// 541388

var downtownBuildings = [];
for(var i=0; i<buildingData.length; i++) {
  var building = Building.createBuilding(buildingData[i]);
  scene.add(building.edges);
  scene.add(building.inner);
  downtownBuildings.push(building);
}

var firstRowBuildingData = getNewBuildingRowData();
var uptownBuildings = [];
for(var i=0; i<firstRowBuildingData.length; i++) {
  var building = Building.createBuilding(firstRowBuildingData[i]);
  scene.add(building.edges);
  scene.add(building.inner);
  uptownBuildings.push(building);
}



// downtown buildings are on the horizon, bounce to the beat
// uptown buildings move towards the camera
window.downtownBuildings = downtownBuildings;
window.uptownBuildings = uptownBuildings;
window.dolphins = [];

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );


var clock = new THREE.Clock();
var time = 0;
var count = 0;
var volumeAverages = [50,50,50,50,50,50,50,50];
window.volumeAverages = volumeAverages;
var lastBurst = -1;
var lastBurstTime = -1;
var lastBeatTime = -1;
var currentRow = 0;
var lastRowCount = 0;

render();

function render() {
  requestAnimationFrame(render);
  count = count + 1;

  if (count % 3 == 1) {
    updateDolphins();
  }

  if (window.sunsetAnalyzer) {
    var array =  new Uint8Array(window.sunsetAnalyzer.frequencyBinCount);
    window.sunsetAnalyzer.getByteFrequencyData(array);
    var averageVolume = getAverageVolume(array, 8);
    // drop other frequencies, only care about bass
    volumeAverages.push(averageVolume);
    var movingAverageVolume = getAverageVolume(volumeAverages, volumeAverages.length);
    // every 3 ticks, update the ~mountains~ buildings
    if (count % 3 == 0) {
      updateBuildings(array);
      // console.log("ave: "+ averageVolume + " moving: " + movingAverageVolume);
    }
    if (count % 40 == 0 && currentRow < 30) {
      currentRow += 1;
      var buildingData = getNewBuildingRowData(currentRow);

      var newBuildings = [];
      for(var i=0; i<buildingData.length; i++) {
        var building = Building.createBuilding(buildingData[i]);
        scene.add(building.edges);
        scene.add(building.inner);
        newBuildings.push(building);
      }
      window.uptownBuildings = window.uptownBuildings.concat(newBuildings);
      if (currentRow == 30) {
        lastRowCount = count;
      }
    }
    if (count - lastRowCount > 800 && currentRow == 30) {
      for (var i=0; i<window.uptownBuildings.length; i++) {
        scene.remove(window.uptownBuildings[i].edges);
        scene.remove(window.uptownBuildings[i].inner);
        window.uptownBuildings = [];
      }
      currentRow = 0;
      // TODO: garbage collection
      // removeFirstRow();
    }
    if (averageVolume > 20 && averageVolume > 1.08 * movingAverageVolume && time - lastBurstTime > 0.5) {
      spawnDolphin();
      // lastBurst = count;
      lastBurstTime = time;
      lastBeatTime = time;
      doBurst();
    }
    volumeAverages.shift()
  }

  time += clock.getDelta();
  grid.material.uniforms.time.value = time;
  renderer.render(scene, camera);
}

function stretchRectangularBuilding(building, val) {
  // indices on edge geometry of top y value
  var indices = [1,16,19,22,28,37,40,46,55,58,67,70];
  for (var i=0; i<indices.length; i++) {
    var index = indices[i];
    building.edges.geometry.attributes.position.array[index] = val;
  }
  building.edges.geometry.attributes.position.needsUpdate = true;

  var innerIndices = [4,13,16,22,31,34,40,49,52,58,67,70,73,76,79,82,85,88]
  // var indices = [4,5,6,7];
  for(var i=0; i<indices.length; i++) {
    var index = innerIndices[i];
    building.inner.geometry.attributes.position.array[index] = val;
  }
  building.edges.geometry.attributes.position.needsUpdate = true;
  building.inner.geometry.attributes.position.needsUpdate = true;
}

function stretchPyramidBuilding(building, val) {
  // indices on edge geometry of top y value
  var indices = [4,7,19,31];
  for (var i=0; i<indices.length; i++) {
    var index = indices[i];
    building.edges.geometry.attributes.position.array[index] = val;
  }
  var innerIndices = [4,13,22,31];
  for (var i=0; i<indices.length; i++) {
    var index = innerIndices[i];
    building.inner.geometry.attributes.position.array[index] = val;
  }
  building.edges.geometry.attributes.position.needsUpdate = true;
  building.inner.geometry.attributes.position.needsUpdate = true;
}

function moveBuilding(building, val) {
  // translateZ instead
  building.edges.position.set(building.data.position[0],building.data.position[1] + val,building.data.position[2]);
  building.inner.position.set(building.data.position[0],building.data.position[1] + val,building.data.position[2]);
}

function slideBuilding(building) {
  building.edges.translateZ(1);
  building.inner.translateZ(1);
}

function updateBuildings(array) {
  for(var i=0; i<window.downtownBuildings.length; i++) {
    var val = array[window.downtownBuildings[i].data.frequency]/(window.downtownBuildings[i].data.divisor || 8);
    if (window.downtownBuildings[i].data.move == "bouncy") {
      moveBuilding(window.downtownBuildings[i], val);
    } else if (window.downtownBuildings[i].data.move=="stretchy" && (window.downtownBuildings[i].data.shape == "cube" || window.downtownBuildings[i].data.shape == "frustum")) {
      stretchRectangularBuilding(window.downtownBuildings[i], val + + window.downtownBuildings[i].data.position[1]);// + window.downtownBuildings[i].data.dimensions[1] );
    } else if (window.downtownBuildings[i].data.move == "stretchy" && (window.downtownBuildings[i].data.shape == "pyramid")) {
      stretchPyramidBuilding(window.downtownBuildings[i], val + window.downtownBuildings[i].data.position[1]);
    }
  }

  for(var i=0; i<window.uptownBuildings.length; i++) {
    slideBuilding(window.uptownBuildings[i]);
  }
}

function updateDolphins() {
  for (var i=0; i<window.dolphins.length; i++) {
    window.dolphins[i].rotation = window.dolphins[i].rotation - 0.05;
    window.dolphins[i].mesh.rotation.z = window.dolphins[i].rotation
    window.dolphins[i].mesh.translateZ(1);
    window.dolphins[i].mesh.translateX(0.02);
    if (window.dolphins[i].rotation < -Math.PI) {
      scene.remove(window.dolphins[i].mesh)
      window.dolphins.splice(i,1)
      i -= 1;
    }
  }
}

function doBurst() {
    gridUniforms["color1"].value.offsetHSL(0.05, 0, 0);
    gridUniforms["color1"].needsUpdate = true;
    podLocationX = Math.floor(Math.random() * 150) - 75;
    podLocationZ = Math.floor(Math.random() * -50) + 10;
}

// have dolphins generally spawn near each other
var podLocationX = -20;
var podLocationZ = -30;


var textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin("");
var texture = textureLoader.load( './dolphin_texture.png' );
var dolphinGeometry = new THREE.PlaneGeometry( 10, 10 );
dolphinGeometry.translate( -5, 5, 0);
var dolphinMaterial = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );


function spawnDolphin() {
  var randomX = podLocationX + Math.floor(Math.random() * 20) - 10
  var randomZ = podLocationZ + Math.floor(Math.random() * -20) + 10

  var mesh = new THREE.Mesh( dolphinGeometry, dolphinMaterial );
  mesh.position.set(randomX, -2 , randomZ)
  mesh.rotation.z = Math.PI * 0.7

  scene.add( mesh );

  window.dolphins.push(
    {
      rotation: Math.PI * 0.5,
      mesh: mesh
    }
  )
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
