function init() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
    .then(stream => {
      const video = document.getElementById('video');
      video.srcObject = stream;
      video.play();
      document.getElementById('status').innerHTML = 'Camera is ready.';
    })
    .catch(error => {
      console.error('Error accessing camera: ', error);
      document.getElementById('status').innerHTML = 'Error accessing camera.';
    });

  async function loadFeatures() {
    try {
      const response = await fetch('features.csv');
      const data = await response.text();
      const rows = data.split('\n').map(row => row.split(','));

      const keypoints = new cv.KeyPointVector();
      const descriptors = new cv.Mat(rows.length, 32, cv.CV_8U);

      rows.forEach((row, i) => {
        if (row.length > 4) {
          const [x, y, size, angle, ...desc] = row.map(Number);
          const keypoint = new cv.KeyPoint(x, y, size, angle);
          keypoints.push_back(keypoint);
          for (let j = 0; j < desc.length; j++) {
            descriptors.data[i * 32 + j] = desc[j];
          }
        }
      });

      return { keypoints, descriptors };
    } catch (error) {
      console.error('Error loading features: ', error);
      document.getElementById('status').innerHTML = 'Error loading features.';
    }
  }

  cv['onRuntimeInitialized'] = async () => {
    const { keypoints, descriptors } = await loadFeatures();
    if (!keypoints || !descriptors) return;

    console.log('Loaded keypoints:', keypoints);
    console.log('Loaded descriptors:', descriptors);

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvasOutput');
    const context = canvas.getContext('2d');
    const detector = new cv.ORB();
    const bf = new cv.BFMatcher(cv.NORM_HAMMING, true);

    let prevDescriptors = descriptors;
    let prevKeypoints = keypoints;

    function processFrame() {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const src = cv.imread(canvas);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      const keypoints = new cv.KeyPointVector();
      const descriptors = new cv.Mat();
      detector.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);

      if (prevDescriptors && prevKeypoints) {
        const matches = new cv.DMatchVector();
        bf.match(prevDescriptors, descriptors, matches);

        const imgMatches = new cv.Mat();
        cv.drawMatches(src, prevKeypoints, src, keypoints, matches, imgMatches);
        cv.imshow('canvasOutput', imgMatches);

        console.log('Matches:', matches.size());

        matches.delete(); imgMatches.delete();
      }

      prevDescriptors = descriptors.clone();
      prevKeypoints = keypoints.clone();

      src.delete(); gray.delete();
      requestAnimationFrame(processFrame);
    }

    processFrame();

    // THREE.jsのセットアップ
    const container = document.getElementById('threejs-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();
  };
}
