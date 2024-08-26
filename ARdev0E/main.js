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
    } else {
      targetDetected = false;
      infoDiv.innerHTML = `World Position: ---`;
    }

    renderer.render(scene, camera);
  });
}

window.addEventListener("load", () => {
  start();
});
