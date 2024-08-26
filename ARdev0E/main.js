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

  infoDiv = document.getElementById('infoDiv');

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

      // infoDivの内容をクリアしてから新しい情報を追加
      if (infoDiv) {
        infoDiv.innerHTML = `${worldPositionText}\n${infoDiv.innerHTML.split('\n').slice(1).join('\n')}`;
      } else {
        console.error('infoDiv is not initialized');
      }

      console.log('World Position:', currentWorldPosition);

      // 最後に検知した位置を更新
      lastKnownPosition.copy(currentWorldPosition);
    } else {
      targetDetected = false;
      if (infoDiv) {
        infoDiv.innerHTML = `World Position: ---\n${infoDiv.innerHTML.split('\n').slice(1).join('\n')}`;
      } else {
        console.error('infoDiv is not initialized');
      }

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
  console.log('Device Orientation Event:', event); // デバッグ用ログ
  const alpha = event.alpha !== null ? event.alpha.toFixed(2) : '0.00';
  const beta = event.beta !== null ? event.beta.toFixed(2) : '0.00';
  const gamma = event.gamma !== null ? event.gamma.toFixed(2) : '0.00';

  const orientationText = `Orientation: alpha ${alpha}°, beta ${beta}°, gamma ${gamma}°`;
  if (infoDiv) {
    infoDiv.innerHTML = `${infoDiv.innerHTML.split('\n')[0]}\n${orientationText}\n${infoDiv.innerHTML.split('\n').slice(2).join('\n')}`;
  } else {
    console.error('infoDiv is not initialized');
  }

  console.log('Orientation:', { alpha, beta, gamma });
});

window.addEventListener('devicemotion', (event) => {
  console.log('Device Motion Event:', event); // デバッグ用ログ
  const acc = event.acceleration;
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastTime) / 1000; // 秒単位に変換
  lastTime = currentTime;

  // 速度を更新
  velocity.x += acc.x !== null ? acc.x * deltaTime : 0;
  velocity.y += acc.y !== null ? acc.y * deltaTime : 0;
  velocity.z += acc.z !== null ? acc.z * deltaTime : 0;

  // 位置を更新
  position.x += velocity.x * deltaTime;
  position.y += velocity.y * deltaTime;
  position.z += velocity.z * deltaTime;

  const accText = `Acceleration: x ${acc.x !== null ? acc.x.toFixed(2) : '0.00'}m/s², y ${acc.y !== null ? acc.y.toFixed(2) : '0.00'}m/s², z ${acc.z !== null ? acc.z.toFixed(2) : '0.00'}m/s²`;
  const positionText = `Position: x ${position.x.toFixed(2)}m, y ${position.y.toFixed(2)}m, z ${position.z.toFixed(2)}m`;
  if (infoDiv) {
    infoDiv.innerHTML = `${infoDiv.innerHTML.split('\n').slice(0, 2).join('\n')}\n${accText}\n${positionText}`;
  } else {
    console.error('infoDiv is not initialized');
  }

  console.log('Acceleration:', acc);
  console.log('Position:', position);
});

window.addEventListener("load", () => {
  start();
});
