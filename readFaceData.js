const path = require("path");
const fs = require("fs");
const fr = require("face-recognition");
const detector = fr.FaceDetector();
const dataPath = path.resolve("./data/faces");
const classNames = ["Nic", "Obama", "donnie", "Rick", "stuart", "Tim"];

const readFaceData = async () => {
  const allFiles = await fs.readdirSync(dataPath);
  const imagesByClass = await classNames.map((c) =>
    allFiles
      .filter((f) => f.includes(c))
      .map((f) => path.join(dataPath, f))
      .map((fp) => {
        const image = fr.loadImage(fp);
        return detector.detectFaces(image, 150)[0];
      })
  );

  const numTrainingFaces = 4;
  const trainDataByClass = await imagesByClass.map((imgs) =>
    imgs.slice(0, numTrainingFaces)
  );
  const testDataByClass = await imagesByClass.map((imgs) =>
    imgs.slice(numTrainingFaces)
  );

  return [classNames, trainDataByClass, testDataByClass];
};

module.exports = readFaceData;
