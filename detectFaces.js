const readFaceData = require("./readFaceData");
const fr = require("face-recognition");
const fs = require("fs");
const recognizer = fr.FaceRecognizer();
const path = require("path");
const detector = fr.FaceDetector();
const dataPath = path.resolve("./data/faces");
let classNamesForModel;

const detectFaces = newName => {
  return readFaceData(newName).then(
    ([classNamesForModel, trainDataByClass, testDataByClass]) => {
      trainDataByClass.forEach((faces, label) => {
        console.log(faces);
        const name = classNamesForModel[label];
        recognizer.addFaces(faces, name, 10);
      });

      const modelState = recognizer.serialize();
      fs.writeFileSync("model.json", JSON.stringify(modelState));

      const errors = classNamesForModel.map(_ => []);
      testDataByClass.forEach((faces, label) => {
        const name = classNamesForModel[label];
        console.log();
        console.log("testing %s", name);
        faces.forEach((face, i) => {
          const prediction = recognizer.predictBest(face);
          console.log("%s (%s)", prediction.className, prediction.distance);

          // count number of wrong classifications
          if (prediction.className !== name) {
            errors[label] = errors[label] + 1;
          }
        });
      });

      // print the result
      const result = classNamesForModel.map((className, label) => {
        const numTestFaces = testDataByClass[label].length;
        const numCorrect = numTestFaces - errors[label].length;
        const accuracy = parseInt((numCorrect / numTestFaces) * 10000) / 100;
        return `${className} ( ${accuracy}% ) : ${numCorrect} of ${numTestFaces} faces have been recognized correctly`;
      });
      console.log("result:");
      console.log(result);
      return result;
    }
  );
};

module.exports = detectFaces;
