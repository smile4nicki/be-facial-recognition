const fr = require("face-recognition");
const recognizer = fr.FaceRecognizer();
const modelState = require("./model.json");
const detector = fr.FaceDetector();

const predictFace = async () => {
  recognizer.load(modelState);
  const imageToTest = fr.loadImage(`./data/faces/test_image.jpeg`);
  const capturedFace = detector.detectFaces(imageToTest, 150)[0];
  if (capturedFace === undefined) {
    return "no match!";
  } else {
    const prediction = recognizer.predictBest(capturedFace);
    return prediction;
  }
};

module.exports = predictFace;
