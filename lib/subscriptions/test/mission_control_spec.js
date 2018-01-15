var MissionControl = require("../models/mission_control");
var assert = require("assert");

var Helpers = require("./helpers");
var sinon = require("sinon");

describe("Mission Planning", () => {
  var missionControl, db;
  before(function() {
    db = Helpers.stubDb();
    missionControl = new MissionControl({ db: db });
  });

  describe("No Current Mission", () => {
    var currentMission;
    before(function(done) {
      missionControl.currentMission(function(err, res) {
        currentMission = res;
        done();
      });
    });
    it("is created if none exist", function() {
      assert(currentMission);
      assert(db.getMissionByLaunchDate.called);
    });
  });
  describe("Current Mission Exists", () => {
    var currentMission;
    before(function(done) {
      db.getMissionByLaunchDate.restore(); // unwrap it
      sinon.stub(db, "getMissionByLaunchDate").yields(null, {});
      missionControl.currentMission(function(err, res) {
        currentMission = res;
        done();
      });
    });
    it("return mission", function() {
      // assert(db.getMissionByLaunchDate.called);
      assert(currentMission);
      // assert(db.createNextMission.called);
    });
  });
});
