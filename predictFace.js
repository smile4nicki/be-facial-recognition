const path = require("path");
const fs = require("fs");
const fr = require("face-recognition");
const recognizer = fr.FaceRecognizer();
const modelState = require("./model.json");
const detector = fr.FaceDetector();

recognizer.load(modelState);

const stuartTest = fr.loadImage(
  "/Users/stuarthughes/Downloads/random_face.jpeg"
);

const prediction = recognizer.predict(stuartTest);

console.log(prediction);
