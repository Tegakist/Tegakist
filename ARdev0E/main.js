import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const mindarThree = new MindARThree({
  container: document.querySelector("#container"),
  imageTargetSrc: "SSS.mind"
});

const {renderer, scene, camera} = mindarThree;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const anchor = mindarThree.addAnchor(0);

const loader = new GLTFLoader();
let mixer;
let model;
let initialWorldPosition = new THREE.Vector3();
let lastKnownPosition = new THREE.Vector3();
let infoDiv;
let targetDetected = false;

loader.load('Logo.glb', (gltf) => {
  model = gltf.scene;
  anchor.group.add(model);

  model.scale.set(10, 10, 10);

  mixer = new THREE.AnimationMixer(model);
  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });

  console.log('Model loaded:', model);
});

const clock = new THREE.Clock();

const start = async() => {
  await mindarThree.start();

  infoDiv = document.createElement('div');
  infoDiv.id = 'infoDiv';
  document.body.appendChild(infoDiv);

  console.log('InfoDiv created:', infoDiv);

  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    if (anchor.group.visible) {
      if (!targetDetected) {
        model.getWorldPosition(initialWorldPosition);
        targetDetected = true;
      }

      const currentWorldPosition = new THREE.Vector3();
      model.getWorldPosition(currentWorldPosition);
      currentWorldPosition.sub(initialWorldPosition);

      const worldPositionText = `World Position: ${currentWorldPosition.x.toFixed(2)}m, ${currentWorldPosition.y.toFixed(2)}m, ${currentWorldPosition.z.toFixed(2)}m`;

      infoDiv.innerHTML = `${worldPositionText}`;

      console.log('World Position:', currentWorldPosition);

      // 最後に検知した位置を更新
      lastKnownPosition.copy(currentWorldPosition);
    } else {
      targetDetected = false;
      infoDiv.innerHTML = `World Position: ---`;

      // 対象を見失った場合、最後に検知した位置にオブジェクトを保持
      model.position.copy(lastKnownPosition);
    }

    renderer.render(scene, camera);
  });
}

// デバイスの位置と傾きを取得するイベントリスナーを追加
let velocity = { x: 0, y: 0, z: 0 };
let position = { x: 0, y: 0, z: 0 };
let lastTime = Date.now();

window.addEventListener('deviceorientation', (event) => {
  const alpha = event.alpha ? event.alpha.toFixed(2) : 0;
  const beta = event.beta ? event.beta.toFixed(2) : 0;
  const gamma = event.gamma ? event.gamma.toFixed(2) : 0;

  const orientationText = `Orientation: alpha ${alpha}°, beta ${beta}°, gamma ${gamma}°`;
  infoDiv.innerHTML += `<br>${orientationText}`;

  console.log('Orientation:', { alpha, beta, gamma });
});

window.addEventListener('devicemotion', (event) => {
  const acc = event.acceleration;
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastTime) / 1000; // 秒単位に変換
  lastTime = currentTime;

  // 速度を更新
  velocity.x += acc.x * deltaTime;
  velocity.y += acc.y * deltaTime;
  velocity.z += acc.z * deltaTime;

  // 位置を更新
  position.x += velocity.x * deltaTime;
  position.y += velocity.y * deltaTime;
  position.z += velocity.z * deltaTime;

  const accText = `Acceleration: x ${acc.x.toFixed(2)}m/s², y ${acc.y.toFixed(2)}m/s², z ${acc.z.toFixed(2)}m/s²`;
  const positionText = `Position: x ${position.x.toFixed(2)}m, y ${position.y.toFixed(2)}m, z ${position.z.toFixed(2)}m`;
  infoDiv.innerHTML += `<br>${accText}<br>${positionText}`;

  console.log('Acceleration:', acc);
  console.log('Position:', position);
});

window.addEventListener("load", () => {
  start();
});
