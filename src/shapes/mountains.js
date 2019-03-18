import * as THREE from 'three';


function createMountains() {
  //add some mountains in the background
  var geometry = new THREE.BufferGeometry();

  var vertices = new Float32Array( [
    60.0,0.0,-100.0,   78.0,0.0,-100.0,   70.0,20.0,-100.0,
    42.0,0.0,-100.0,   60.0,0.0,-100.0,   56.0,5.0,-100.0,
    56.0,5.0,-100.0,   60.0,0.0,-100.0,   70.0,20.0,-100.0,
    56.0,5.0,-100.0,   70.0,20.0,-100.0,   49.0,12.0,-100.0,
    42.0,0.0,-100.0,   56.0,5.0,-100.0,   49.0,12.0,-100.0,
    35.0,2.0,-100.0,   42.0,0.0,-100.0,   49.0,12.0,-100.0,
    35.0,2.0,-100.0,   49.0,12.0,-100.0,   30.0,16.0,-100.0,
    15.0,0.0,-100.0,   35.0,2.0,-100.0,   30.0,16.0,-100.0,
    15.0,0.0,-100.0,   30.0,16.0,-100.0,   12.0,10.0,-100.0,
    5.0,0.0,-100.0,   15.0,0.0,-100.0,   12.0,10.0,-100.0,
    3.0,3.0,-100.0,   5.0,0.0,-100.0,   12.0,10.0,-100.0,
    -5.0,0.0,-100.0,   5.0,0.0,-100.0,   3.0,3.0,-100.0,
    -12.0,0.0,-100.0,   -5.0,0.0,-100.0,   -14.0,6.0,-100.0,
    -15.0,0.0,-100.0,   -12.0,0.0,-100.0,   -14.0,6.0,-100.0,
    -21.0,0.0,-100.0,   -14.0,6.0,-100.0,   -17.0,13.0,-100.0,
    -24.0,10.0,-100.0,   -21.0,0.0,-100.0,   -17.0,13.0,-100.0,
    -24.0,10.0,-100.0,   -17.0,13.0,-100.0,   -22.0,18.0,-100.0,
    -28.0,19.0,-100.0,   -24.0,10.0,-100.0,   -22.0,18.0,-100.0,
    -31.0,5.0,-100.0,   -24.0,10.0,-100.0,   -28.0,19.0,-100.0,
    -31.0,5.0,-100.0,   -21.0,0.0,-100.0,   -24.0,10.0,-100.0,
    -49.0,22.0,-100.0,   -31.0,5.0,-100.0,   -28.0,19.0,-100.0,
    -45.0,0.0,-100.0,   -31.0,5.0,-100.0,   -49.0,22.0,-100.0,
    -55.0,6.0,-100.0,   -45.0,0.0,-100.0,   -49.0,22.0,-100.0,
    -59.0,0.0, -100.0,   -45.0,0.0,-100,   -55.0,6.0,-100.0
  ] );

  // geometry.vertices.push(
  //   // 0-2 (far right)
  //     new THREE.Vector3(60,0,-100),
  //     new THREE.Vector3(70,20,-100), //far right peak
  //     new THREE.Vector3(78,0,-100),
  // // 3-4
  //     new THREE.Vector3(42,0,-100),
  //     new THREE.Vector3(56,5,-100), //2nd peak
  // // 5-6
  //     new THREE.Vector3(49,12,-100),
  //     new THREE.Vector3(35,2,-100),
  // // 7-8
  //     new THREE.Vector3(30,16,-100), //3rd peak, right of sun
  //     new THREE.Vector3(15,0,-100),
  // // 9-11 (right of the sun)
  //     new THREE.Vector3(12,10,-100),
  //     new THREE.Vector3(3,3,-100),
  //     new THREE.Vector3(5,0,-100),
  // // 12-15 (left of sun)
  //     new THREE.Vector3(-5,0,-100),
  //     new THREE.Vector3(-14,6,-100),
  //     new THREE.Vector3(-12,0,-100),
  //     new THREE.Vector3(-15,0,-100),
  // // 16-17
  //     new THREE.Vector3(-21,0,-100),
  //     new THREE.Vector3(-17,13,-100),
  // // 18 (the middle one)
  //     new THREE.Vector3(-24,10,-100),
  // // 19-21
  //     new THREE.Vector3(-22,18,-100),
  //     new THREE.Vector3(-28,19,-100),
  //     new THREE.Vector3(-31,5,-100),
  // // 22-23
  //     new THREE.Vector3(-49,22,-100),
  //     new THREE.Vector3(-55,6,-100),
  // // 24-25 (bottom ones)
  //     new THREE.Vector3(-45,0,-100),
  //     new THREE.Vector3(-59,0, -100)
  // );

  // geometry.faces.push(
  //     0, 1, 2),
  //     3, 4, 0),
  //     4, 1, 0),
  //     4, 5, 1),
  //     3, 5, 4),
  //     6, 5, 3),
  //     6, 7, 5),
  //     8, 7, 6),
  //     8, 9, 7),
  //     11, 9, 8),
  //     10, 9, 11),
  //     12, 10, 11),
  //     14, 13, 12),
  //     15, 13, 14),
  //     16, 17, 13),
  //     18, 17, 16),
  //     18, 19, 17),
  //     20, 19, 18),
  //     21, 20, 18),
  //     21, 18, 16),
  //     22, 20, 21),
  //     24, 22, 21),
  //     23, 24, 22),
  //     25, 23, 24)
  //
  // );


  geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  var edgesMaterial = new THREE.MeshBasicMaterial( { color: 0x2222FF, wireframe: true } );
  var edges = new THREE.Mesh( geometry, edgesMaterial );

  var innerMaterial = new THREE.MeshBasicMaterial( {
      color: 0x000000,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1
  } );

  var inner = new THREE.Mesh( geometry, innerMaterial );
  return {
    edges: edges,
    inner: inner
  }
  // var mountains = new THREE.Mesh(
  //         geometry,
  //         new THREE.MeshBasicMaterial({
  //           color: 0x2222FF,
  //           wireframe: true
  //         }))
  // return mountains;
}

function createSunOccluder() {
  // mountains.position.set(0,0,-100);

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

  return sunOccluder;
}

export default {
  createMountains: createMountains,
  createSunOccluder: createSunOccluder
}
