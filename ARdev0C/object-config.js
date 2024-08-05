document.addEventListener('DOMContentLoaded', () => {
  const marker = document.querySelector('a-marker');
  const box = document.createElement('a-box');
  box.setAttribute('position', '0 0 0');
  box.setAttribute('material', 'opacity: 0.5; color: red;');
  box.setAttribute('visible', 'true'); // visibleをtrueに設定
  box.setAttribute('id', 'box'); // idを追加
  marker.appendChild(box);
});
