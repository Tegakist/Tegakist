document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  scene.setAttribute('embedded', '');
  scene.setAttribute('arjs', `
    sourceType: webcam;
    debugUIEnabled: false;
    vrModeEnabled: false;
    renderer: {logarithmicDepthBuffer: true};
    patternRatio: 0.9;
    detectionMode: mono_and_matrix;
  `);

  // keep-visibleコンポーネントの定義
  AFRAME.registerComponent('keep-visible', {
    tick: function () {
      const box = document.querySelector('a-box');
      if (!markerVisible && box) {
        box.setAttribute('visible', 'true');
      }
    }
  });

  scene.setAttribute('keep-visible', '');
});
