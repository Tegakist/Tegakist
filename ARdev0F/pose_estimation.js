function estimatePose(objectPoints, imagePoints) {
  const rvec = new cv.Mat();
  const tvec = new cv.Mat();
  cv.solvePnP(objectPoints, imagePoints, cameraMatrix, distCoeffs, rvec, tvec);

  // rvecとtvecを使用してカメラの位置と姿勢を計算
  return { rvec, tvec };
}
