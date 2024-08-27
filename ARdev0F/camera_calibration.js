const cameraMatrix = cv.matFromArray(3, 3, cv.CV_32FC1, [
  1000, 0, 320,
  0, 1000, 240,
  0, 0, 1
]);
const distCoeffs = cv.matFromArray(1, 5, cv.CV_32FC1, [0, 0, 0, 0, 0]);
