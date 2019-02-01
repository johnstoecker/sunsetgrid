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

var moveable = [];
for (let i = 0; i <= division; i++) {
  moveable.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
}
grid.geometry.addAttribute('moveable', new THREE.BufferAttribute(new Uint8Array(moveable), 1));
grid.material = new THREE.ShaderMaterial({
  uniforms: {
    time: {
      value: 0
    },
    limits: {
      value: new THREE.Vector2(-limit, limit)
    },
    speed: {
      // set me to the beat
      value: 35
    }
  },
  vertexShader: `
    uniform float time;
    uniform vec2 limits;
    uniform float speed;

    attribute float moveable;

    varying vec3 vColor;

    void main() {
      vColor = color;
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
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1.);
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

var fShader = document.getElementById('fragmentShader').text;
var vShader = document.getElementById('vertexShader').text;

var material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vShader,
  fragmentShader: fShader
});

// add a setting sun
var geometry = new THREE.CircleGeometry( 5, 64 );
var circle = new THREE.Mesh( geometry, material );
circle.position.set(0,9,-40)
scene.add( circle );


// Create ambient light and add to scene.
// var light = new THREE.AmbientLight(0x404040); // soft white light
// scene.add(light);

// Create directional light and add to scene.
// var directionalLight = new THREE.DirectionalLight(0xffffff);
// directionalLight.position.set(1, 1, 1).normalize();
// scene.add(directionalLight);

var clock = new THREE.Clock();
var time = 0;

render();

function render() {
  requestAnimationFrame(render);
  time += clock.getDelta();
  grid.material.uniforms.time.value = time;
  renderer.render(scene, camera);
}
