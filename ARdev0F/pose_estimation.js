function estimatePose(objectPoints, imagePoints) {
  const rvec = new cv.Mat();
  const tvec = new cv.Mat();
  const success = cv.solvePnP(objectPoints, imagePoints, cameraMatrix, distCoeffs, rvec, tvec);

  if (!success) {
    console.error('Pose estimation failed');
    return null;
  }

  // rvecとtvecを使用してカメラの位置と姿勢を計算
  return { rvec, tvec };
}
