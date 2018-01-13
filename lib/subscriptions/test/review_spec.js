var assert = require("assert");
var sinon = require("sinon");
var ReviewProcess = require("../processes/review");
var MembershipApplication = require("../models/membership_application");

describe("The Review Process", () => {
  describe("Receiving a valid application", () => {
    var decision;
    var validApp = new MembershipApplication({
      first: "Test",
      last: "User",
      email: "test@test.com",
      age: 30,
      height: 66,
      weight: 180
    });

    var review = new ReviewProcess();
    var validationSpy = sinon.spy();
    var missionSpy = sinon.spy();
    var roleAvailableSpy = sinon.spy();
    var roleCompatibleSpy = sinon.spy();

    before(function(done) {
      review.on("validated", validationSpy);
      review.on("mission-selected", missionSpy);
      review.on("role-available", roleAvailableSpy);
      review.on("role-compatible", roleCompatibleSpy);
      review.processApplication(validApp, function(err, result) {
        decision = result;
        done();
      });
    });

    it("return success", function() {
      assert(decision.success, decision.message);
    });
    it("ensures the application is valid", function() {
      assert(validationSpy.called);
    });
    it("selects a mission", function() {
      assert(missionSpy.called);
    });
    it("ensures a role exists", function() {
      assert(roleAvailableSpy.called);
    });
    it("ensures role compatibility", function() {
      assert(roleCompatibleSpy.called);
    });
  });
});
