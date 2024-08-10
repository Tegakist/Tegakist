document.addEventListener('DOMContentLoaded', () => {
  // シーンの設定
  const scene = document.querySelector('a-scene');
  scene.embedded = true;
  scene.arjs = `
    sourceType: webcam;
    debugUIEnabled: false;
    vrModeEnabled: false;
    renderer: {logarithmicDepthBuffer: true};
    patternRatio: 0.9;
    detectionMode: mono_and_matrix;
    matrixCodeType: 3x3_PARITY65 // 追加
  `;

  // マーカーの設定
  const marker = document.querySelector('a-marker');
  marker.type = 'pattern';
  marker.url = 'pattern-OTK.patt';
  marker.emitevents = 'true';

  // マーカー情報をコンソールに表示
  console.log('Marker pattern URL:', marker.url);

  // オブジェクト（イメージ）の設定
  const image = document.createElement('a-image');
  image.src = 'a.png'; // 画像ファイルを指定する
  image.position = '0 0 0'; // 画像の位置を設定する
  image.material = 'opacity: 1.0;'; // 画像の不透明度を設定する
  image.visible = false; // 初期状態では画像を非表示にする
  marker.appendChild(image); // マーカーに画像を追加する
});
