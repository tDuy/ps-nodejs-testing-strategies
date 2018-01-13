var moment = require("moment");
var MissionControl = require("../models/mission_control");
var assert = require("assert");

var db = require("../db");
var sinon = require("sinon");
sinon.stub(db, "find").yields(null, { id: 1 });

var missionControl = new MissionControl({ db: db });

describe("Mission Control", () => {
  describe("The Current Mission", () => {
    var currentMission;
    before(function(done) {
      missionControl.currentMission(function(err, res) {
        currentMission = res;
        done();
      });
    });
    it("is created if none exist", function() {
      assert(currentMission);
    });
  });
});
