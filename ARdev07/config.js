document.addEventListener('DOMContentLoaded', () => {
  // シーンの設定
  const scene = document.querySelector('a-scene');
  scene.setAttribute('embedded', true);
  scene.setAttribute('arjs', `
    sourceType: webcam;
    debugUIEnabled: false;
    vrModeEnabled: false; // VRモードを無効にする
    renderer: {logarithmicDepthBuffer: true};
    patternRatio: 0.9;
    detectionMode: mono_and_matrix;
    matrixCodeType: 3x3_PARITY65 // 追加
  `);

  // マーカーの設定
  const marker = document.querySelector('a-marker');
  marker.setAttribute('type', 'pattern');
  marker.setAttribute('url', 'pattern-a.patt');
  marker.setAttribute('emitevents', 'true');

  // マーカー情報をコンソールに表示
  console.log('Marker pattern URL:', marker.getAttribute('url'));

  // オブジェクト（イメージ）の設定
  const image = document.createElement('a-image');
  image.setAttribute('src', 'a.png'); // 画像ファイルを指定する
  image.setAttribute('position', '0 0 0'); // 画像の位置を設定する
  image.setAttribute('material', 'opacity: 1.0;'); // 画像の不透明度を設定する
  image.setAttribute('visible', 'false'); // 初期状態では画像を非表示にする
  marker.appendChild(image); // マーカーに画像を追加する
});
