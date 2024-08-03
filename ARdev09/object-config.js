document.addEventListener('DOMContentLoaded', () => {
  const marker = document.querySelector('a-marker');
  const box = document.createElement('a-box');
  box.setAttribute('position', '0 0 0');
  box.setAttribute('material', 'opacity: 0.5; color: red;');
  box.setAttribute('visible', 'false');
  marker.appendChild(box);
});
