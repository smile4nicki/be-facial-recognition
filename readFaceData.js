const path = require("path");
const fs = require("fs");
const fr = require("face-recognition");
const detector = fr.FaceDetector();

const dataPath = path.resolve("./data/faces");

const classNames = ["Nic", "Obama"];

const allFiles = fs.readdirSync(dataPath);
const imagesByClass = classNames.map((c) =>
  allFiles
    .filter((f) => f.includes(c))
    .map((f) => path.join(dataPath, f))
    .map((fp) => {
      const image = fr.loadImage(fp);
      return detector.detectFaces(image, 150)[0];
    })
);

const numTrainingFaces = 4;
const trainDataByClass = imagesByClass.map((imgs) =>
  imgs.slice(0, numTrainingFaces)
);
const testDataByClass = imagesByClass.map((imgs) =>
  imgs.slice(numTrainingFaces)
);

module.exports = { classNames, trainDataByClass, testDataByClass };
