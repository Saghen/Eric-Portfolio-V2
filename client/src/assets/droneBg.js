import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Scene } from 'three/src/scenes/Scene';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { Fog } from 'three/src/scenes/Fog';

import { AmbientLight } from 'three/src/lights/AmbientLight';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';

import { Mesh } from 'three/src/objects/Mesh';
import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry';
import { BufferGeometry } from 'three/src/core/BufferGeometry';

import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';

import { Vector3 } from 'three/src/math/Vector3';

import { ImageLoader } from 'three/src/loaders/ImageLoader';

import { Float32BufferAttribute, Uint32Attribute, Uint32BufferAttribute } from 'three/src/core/BufferAttribute'

// prettier-ignore
const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 10;

const scene = new Scene();

let mesh;

/*let mat = new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0x333333, metalness: 0xffffff });

const loader = new GLTFLoader();
loader.load('/drone.glb', gltf => {
  mesh = gltf.scene.children[0];
  mesh.scale.set(0.3, 0.3, 0.3);
  mesh.position.set(0, 0, 0);

  //mesh.children.forEach(val => val.material = mat);

  //scene.add(gltf.scene);
});*/

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.physicallyCorrectLights = true;
renderer.setPixelRatio(window.devicePixelRatio);

scene.add(new AmbientLight(0xffffff, 5));

const directionalLight = new DirectionalLight(0xffffff, 5);
directionalLight.position.set(0.5, 0, 0.866); // ~60º
scene.add(directionalLight);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

/* Fog provides depth to the landscape*/
scene.fog = new Fog(0x0099ff, 0, 200);

function getHeightData(img, scale) {
  if (scale == undefined) scale = 1;

  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var context = canvas.getContext('2d');

  var size = img.width * img.height;
  var data = new Float32Array(size);

  context.drawImage(img, 0, 0);

  for (var i = 0; i < size; i++) {
    data[i] = 0;
  }

  var imgd = context.getImageData(0, 0, img.width, img.height);
  var pix = imgd.data;

  var j = 0;
  for (var i = 0; i < pix.length; i += 4) {
    var all = pix[i] + pix[i + 1] + pix[i + 2];
    data[j++] = all / (12 * scale);
  }

  return data;
}

let landscape;

let imgLoader = new ImageLoader();

imgLoader.load('images/heightmap.png', img => {
  //get height data from img
  let data = getHeightData(img);

  let geo = new PlaneBufferGeometry(10, 10, 256, 256);

  //set height of vertices
  for (let i = 0; i < geo.attributes.position.count; i++) {
    geo.attributes.position.array[i * 3 + 2] = data[i] / 20;
  }
  console.log(geo.attributes.position);

  landscape = new Mesh(
    geo,
    new MeshBasicMaterial({ wireframe: true, color: 0xffffff })
  );

  landscape.scale.set(3, 3.5, 2);
  landscape.scale.multiplyScalar(15);
  landscape.position.set(0, -50, 0);

  scene.add(landscape);

  landscape.lookAt(new Vector3(0, 10, 0));
});

let lastTick = performance.now();

function animate() {
  let multiplier = (performance.now() - lastTick) / (1000 / 60);

  requestAnimationFrame(animate);

  if (mesh) {
    mesh.rotation.x += 0.002 * multiplier;
    mesh.rotation.y += 0.005 * multiplier;
  }

  if (landscape) landscape.rotation.z += 0.001 * multiplier;

  lastTick = performance.now();

  renderer.render(scene, camera);
}

export default {
  camera,
  renderer,
  animate
};
