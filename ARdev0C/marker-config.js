document.addEventListener('DOMContentLoaded', () => {
  const marker = document.querySelector('a-marker');
  marker.setAttribute('type', 'pattern');
  marker.setAttribute('url', 'pattern-a.patt');
  marker.setAttribute('emitevents', 'true');
  marker.setAttribute('id', 'marker'); // idを追加
});
