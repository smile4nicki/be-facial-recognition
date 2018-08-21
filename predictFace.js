const path = require("path");
const fs = require("fs");
const fr = require("face-recognition");
const recognizer = fr.FaceRecognizer();
const modelState = require("./model.json");
const detector = fr.FaceDetector();

const predictFace = (req, res) => {
  recognizer.load(modelState);
  const stuartTest = fr.loadImage(
    "/Users/stuarthughes/Downloads/random_face.jpeg"
  );
  const prediction = recognizer.predict(stuartTest);
  res.send({ prediction });
};

module.exports = predictFace;
