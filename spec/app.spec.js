const { expect } = require("chai");
const request = require("supertest");
const fs = require("fs");
const app = require("../app");
const readFaceData = require("../readFaceData");
const detectFaces = require("../detectFaces");
const predictFace = require("../predictFace");
let testPayload;

describe("readFaceData", function() {
  this.timeout(35000);
  beforeEach(function() {
    const classNames = { classNames: ["stuart", "Nic", "Ant", "Tim", "Rick"] };
    fs.writeFileSync("./data/classNames.json", JSON.stringify(classNames));
  });
  it("adds a new name when it is not currently in the array of class names", async () => {
    const data = fs.readFileSync(__dirname + "/../data/classNames.json");
    let json = JSON.parse(data);
    const faceData = await readFaceData("Jerry");
    const newClassNamesLength = faceData[0].length;
    expect(newClassNamesLength).to.equal(json.classNames.length + 1);
  });
  it("does not add a name already in the array of class names", async () => {
    const data = fs.readFileSync(__dirname + "/../data/classNames.json");
    let json = JSON.parse(data);
    const faceData = await readFaceData("Tim");
    const newClassNamesLength = faceData[0].length;
    expect(newClassNamesLength).to.equal(json.classNames.length);
  });
  it("creates an array of four images for each user to train the model", async () => {
    const data = fs.readFileSync(__dirname + "/../data/classNames.json");
    let json = JSON.parse(data);
    const faceData = await readFaceData("Tim");
    const newClassNamesLength = faceData[0].length;
    const trainingData = faceData[1];
    expect(trainingData.length).to.equal(newClassNamesLength);
    expect(trainingData[0].length).to.equal(4);
  });
});

describe("detectFaces", function() {
  this.timeout(30000);
  beforeEach(function() {
    const classNames = { classNames: ["stuart", "Nic", "Ant", "Tim", "Rick"] };
    fs.writeFileSync("./data/classNames.json", JSON.stringify(classNames));
  });
  it("returns a result", async () => {
    const resultData = await detectFaces("Tim");
    expect(resultData).to.be.an("array");
    expect(resultData.length).to.equal(5);
  });
});

describe.only("prediction API", function() {
  this.timeout(6000);
  it("returns a prediction less than or equal to 0.6 for a known user", () => {
    const predictTestJson = JSON.parse(
      fs.readFileSync(__dirname + "/../data/predictKnownUser.json")
    );
    return request(app)
      .post("/write")
      .send(predictTestJson)
      .then(res => {
        expect(res.body.prediction.className).to.equal("Donald");
        expect(res.body.prediction.distance).to.be.lessThan(0.61);
      });
  });
  it("returns a prediction higher than 0.6 for a known user", () => {
    const predictTestJson = JSON.parse(
      fs.readFileSync(__dirname + "/../data/predictUnknownUser.json")
    );
    return request(app)
      .post("/write")
      .send(predictTestJson)
      .then(res => {
        expect(res.body.prediction.distance).to.be.greaterThan(0.6);
      });
  });
});

describe("End to end API call", function() {
  this.timeout(60000);
  beforeEach(function() {
    const classNames = {
      classNames: ["stuart", "Nic", "Ant", "Tim", "Rick"]
    };
    fs.writeFileSync("./data/classNames.json", JSON.stringify(classNames));
    testPayload = fs.readFileSync(__dirname + "/../data/testPayload.json");
  });
  it("returns the result of the updated model with a new user added", () => {
    return request(app)
      .post("/newUser")
      .send(JSON.parse(testPayload))
      .then(res => {
        const body = res.body;
        expect(body).to.have.all.keys("result");
        expect(body.result.length).to.equal(6);
      });
  });
});
