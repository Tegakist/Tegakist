AFRAME.registerComponent('keep-visible', {
  tick: function () {
    const box = document.querySelector('a-box');
    if (!markerVisible && box) {
      box.setAttribute('visible', 'true');
    }
  }
});
