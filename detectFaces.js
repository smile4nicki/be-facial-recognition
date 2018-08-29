// const readFaceData = require("./readFaceData");
const fr = require("face-recognition");
const fs = require("fs");
const recognizer = fr.FaceRecognizer();
const path = require("path");
const detector = fr.FaceDetector();
const dataPath = path.resolve("./data/faces");
let classNamesForModel;

const detectFaces = (newName = "") => {
  const data = fs.readFileSync("./data/classNames.json");
  let json = JSON.parse(data);
  if (newName !== "" && json.classNames.indexOf(newName) === -1) {
    json.classNames[json.classNames.length] = newName;
  }
  fs.writeFileSync("./data/classNames.json", JSON.stringify(json));
  classNamesForModel = JSON.parse(fs.readFileSync("./data/classNames.json"))
    .classNames;
  const allFiles = fs.readdirSync(dataPath);
  const imagesByClass = classNamesForModel.map((c) =>
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

  trainDataByClass.forEach((faces, label) => {
    console.log(faces);
    const name = classNamesForModel[label];
    recognizer.addFaces(faces, name, 10);
  });

  const modelState = recognizer.serialize();
  fs.writeFileSync("model.json", JSON.stringify(modelState));

  const errors = classNamesForModel.map((_) => []);
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
};

module.exports = { detectFaces };
