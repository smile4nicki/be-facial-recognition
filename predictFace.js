const path = require("path");
const fs = require("fs");
const fr = require("face-recognition");
const recognizer = fr.FaceRecognizer();
const modelState = require("./model.json");
const detector = fr.FaceDetector();

recognizer.load(modelState);

const stuartTest = fr.loadImage("/Users/smile4nicki/Downloads/Nic9.png");
const imageResized = detector.detectFaces(stuartTest, 150)[0];

const prediction = recognizer.predict(imageResized);

console.log(prediction);
