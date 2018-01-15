var MembershipApplication = require("../../models/membership_application");
var Mission = require("../../models/mission");
var DB = require("../../db");
var sinon = require("sinon");

exports.validApplication = new MembershipApplication({
  first: "Test",
  last: "User",
  email: "test@test.com",
  role: "commander",
  age: 30,
  height: 66,
  weight: 180
});

exports.stubDb = function(args) {
  args || (args = {});
  var mission = args.mission || new Mission();
  var db = new DB();
  sinon.stub(db, "getMissionByLaunchDate").yields(null, null);
  sinon.stub(db, "createNextMission").yields(null, mission);
  return db;
};
