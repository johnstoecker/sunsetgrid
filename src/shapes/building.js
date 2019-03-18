import * as THREE from 'three';

//create a group and add the two cubes
//These cubes can now be rotated / scaled etc as a group
// var group = new THREE.Group();
// group.add( cubeA );
// group.add( cubeB );

// const loader = new THREE.TextureLoader();
// loader.crossOrigin = '';
// const texture = loader.load('./building_texture_1.png');
// var texture = new THREE.TextureLoader().load( './building_texture_1.png' );

// immediately use the texture for material creation
// var buildingMaterial = new THREE.MeshBasicMaterial( { map: texture } );

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

var buildingMaterialBlue = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
var buildingMaterialRed = new THREE.MeshLambertMaterial( {color: 0xff0000} );
// to occlude inside the building
var innerMaterial = new THREE.MeshBasicMaterial( {
    color: 0x000000,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1
} );

//
// var building4Geometry = new THREE.BoxGeometry( 4, 4, 4 );
// var geometry = new THREE.EdgesGeometry( building4Geometry );
// var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// var building4 = new THREE.LineSegments( geometry, material );
// building4.position.set(54, 2, -90);
// scene.add(building4);
// var building4Inner = new THREE.Mesh( building4Geometry, innerMaterial);
// building4Inner.position.set(54, 2, -90);
// scene.add(building4Inner);
//


function createPyramid(data) {
  var dimensions = data.dimensions;
  var position = data.position;
  var color = data.color;
  var buildingGeometry = new THREE.BufferGeometry();
  var vertices = [
      // ...vertices[52, 4, -88 ),
      // new THREE.Vector3( 52, 4, -92 ),
      // new THREE.Vector3( 56, 4, -92 ),
      // new THREE.Vector3( 56, 4, -88 ),
      // new THREE.Vector3( 54, 12, -90 ),

      [position[0] - dimensions[0]/2, position[1] - dimensions[1]/2, position[2] - dimensions[2]/2 ],
      [position[0] - dimensions[0]/2, position[1] - dimensions[1]/2, position[2] + dimensions[2]/2 ],
      [position[0] + dimensions[0]/2, position[1] - dimensions[1]/2, position[2] + dimensions[2]/2 ],
      [position[0] + dimensions[0]/2, position[1] - dimensions[1]/2, position[2] - dimensions[2]/2 ],
      [position[0], position[1] + dimensions[1]/2, position[2]],

  ];

//   4
//
// 1   2
//  0   3


  var verticesFaces = new Float32Array([
     ...vertices[1], ...vertices[4], ...vertices[0],
     ...vertices[2], ...vertices[4], ...vertices[1],
     ...vertices[3], ...vertices[4], ...vertices[2],
     ...vertices[0], ...vertices[4], ...vertices[3]
  ]);


  // buildingGeometry.faces = [
  //     // new THREE.Face3( 0, 1, 2 ),
  //     // new THREE.Face3( 0, 2, 3 ),
  //     new THREE.Face3( 1, 4, 0 ),
  //     new THREE.Face3( 2, 4, 1 ),
  //     new THREE.Face3( 3, 4, 2 ),
  //     new THREE.Face3( 0, 4, 3 )
  // ];
  buildingGeometry.addAttribute( 'position', new THREE.BufferAttribute( verticesFaces, 3 ) );
  var geometry = new THREE.EdgesGeometry( buildingGeometry );
  var material = new THREE.LineBasicMaterial( { color: color } );
  var building = new THREE.LineSegments( geometry, material );
  var buildingInner = new THREE.Mesh( buildingGeometry, innerMaterial);
  return {
    edges: building,
    inner: buildingInner,
    data: data
  }
}

// a frustum is a pyramid with a flat top
// dimensions: bottom length, bottom width, height, top length, top width
function createFrustum(data) {
  var dimensions = data.dimensions;
  var position = data.position;
  var color = data.color;
  var buildingGeometry = new THREE.BufferGeometry();
  var vertices = [
      // new THREE.Vector3( 52, 4, -88 ),
      // new THREE.Vector3( 52, 4, -92 ),
      // new THREE.Vector3( 56, 4, -92 ),
      // new THREE.Vector3( 56, 4, -88 ),
      // new THREE.Vector3( 54, 12, -90 ),

      [position[0] - dimensions[0]/2, position[1] - dimensions[1]/2, position[2] - dimensions[2]/2],
      [position[0] - dimensions[0]/2, position[1] - dimensions[1]/2, position[2] + dimensions[2]/2],
      [position[0] + dimensions[0]/2, position[1] - dimensions[1]/2, position[2] + dimensions[2]/2],
      [position[0] + dimensions[0]/2, position[1] - dimensions[1]/2, position[2] - dimensions[2]/2],

      [position[0] - dimensions[3]/2, position[1] + dimensions[1]/2, position[2] - dimensions[4]/2],
      [position[0] - dimensions[3]/2, position[1] + dimensions[1]/2, position[2] + dimensions[4]/2],
      [position[0] + dimensions[3]/2, position[1] + dimensions[1]/2, position[2] + dimensions[4]/2],
      [position[0] + dimensions[3]/2, position[1] + dimensions[1]/2, position[2] - dimensions[4]/2],

  ];

//5    6
// 4    7
//
// 1   2
//  0   3

  var verticesFaces = new Float32Array([
      // new THREE.Face3( 0, 1, 2 ),
      // new THREE.Face3( 0, 2, 3 ),
      ...vertices[1], ...vertices[4], ...vertices[0],
      ...vertices[1], ...vertices[5], ...vertices[4],
      ...vertices[2], ...vertices[6], ...vertices[1],
      ...vertices[1], ...vertices[6], ...vertices[5],
      ...vertices[3], ...vertices[7], ...vertices[2],
      ...vertices[2], ...vertices[7], ...vertices[6],
      ...vertices[0], ...vertices[4], ...vertices[3],
      ...vertices[3], ...vertices[4], ...vertices[7],
      ...vertices[4], ...vertices[5], ...vertices[7],
      ...vertices[7], ...vertices[5], ...vertices[6]

  ]);
  buildingGeometry.addAttribute( 'position', new THREE.BufferAttribute( verticesFaces, 3 ) );
  var geometry = new THREE.EdgesGeometry( buildingGeometry );
  var material = new THREE.LineBasicMaterial( { color: color } );
  var building = new THREE.LineSegments( geometry, material );
  var buildingInner = new THREE.Mesh( buildingGeometry, innerMaterial);
  return {
    edges: building,
    inner: buildingInner,
    data: data
  }
}

function createCube(data) {
  var dimensions = data.dimensions;
  var position = data.position;
  var color = data.color;

  var building1Geometry = new THREE.BufferGeometry();
  var vertices = [
      [position[0] - dimensions[0]/2, position[1] - dimensions[1]/2, position[2] - dimensions[2]/2],
      [position[0] - dimensions[0]/2, position[1] - dimensions[1]/2, position[2] + dimensions[2]/2],
      [position[0] + dimensions[0]/2, position[1] - dimensions[1]/2, position[2] + dimensions[2]/2],
      [position[0] + dimensions[0]/2, position[1] - dimensions[1]/2, position[2] - dimensions[2]/2],

      [position[0] - dimensions[0]/2, position[1] + dimensions[1]/2, position[2] - dimensions[2]/2],
      [position[0] - dimensions[0]/2, position[1] + dimensions[1]/2, position[2] + dimensions[2]/2],
      [position[0] + dimensions[0]/2, position[1] + dimensions[1]/2, position[2] + dimensions[2]/2],
      [position[0] + dimensions[0]/2, position[1] + dimensions[1]/2, position[2] - dimensions[2]/2],

  ];

  var verticesFaces = new Float32Array([
      ...vertices[1], ...vertices[4], ...vertices[0],
      ...vertices[1], ...vertices[5], ...vertices[4],
      ...vertices[2], ...vertices[6], ...vertices[1],
      ...vertices[1], ...vertices[6], ...vertices[5],
      ...vertices[3], ...vertices[7], ...vertices[2],
      ...vertices[2], ...vertices[7], ...vertices[6],
      ...vertices[0], ...vertices[4], ...vertices[3],
      ...vertices[3], ...vertices[4], ...vertices[7],
      ...vertices[4], ...vertices[5], ...vertices[7],
      ...vertices[7], ...vertices[5], ...vertices[6]

  ]);

  building1Geometry.addAttribute( 'position', new THREE.BufferAttribute( verticesFaces, 3 ) );
  var geometry = new THREE.EdgesGeometry( building1Geometry );
  var material = new THREE.LineBasicMaterial( { color: color } );
  var building = new THREE.LineSegments( geometry, material );
  var buildingInner = new THREE.Mesh( building1Geometry, innerMaterial);
  return {
    edges: building,
    inner: buildingInner,
    data: data
  }
}

function createBuilding(buildingData) {
  if (buildingData.shape == "cube") {
    return createCube(buildingData);
  } else if (buildingData.shape == "pyramid") {
    return createPyramid(buildingData);
  } else if (buildingData.shape == "frustum") {
    return createFrustum(buildingData);
  }
}

export default {
  createBuilding: createBuilding
}
