var async = require("async");
var assert = require("assert");
var MissionControl = require("../models/mission_control");
var Assignment = require("../models/assignment");

class ReviewProcess {
  constructor(args) {
    assert(args.application, "Need an application to review");
    assert(args.db, "Need a db instance");

    this.app = args.application;
    this.db = args.db;
    this.missionControl = new MissionControl({ db: this.db });
    this.assignment = undefined;
    this.mission = undefined;

    this.ensureAppValid = this.ensureAppValid.bind(this);
    this.findNextMission = this.findNextMission.bind(this);
    this.roleIsAvailable = this.roleIsAvailable.bind(this);
    this.ensureRoleCompatible = this.ensureRoleCompatible.bind(this);
    this.approveApplication = this.approveApplication.bind(this);
  }
  // make sure app is valid
  ensureAppValid(next) {
    if (this.app.isValid()) {
      next(null, true);
    } else {
      // exactly what is wrong ?
      next(this.app.validationMessage(), null);
    }
  }
  // find next mission
  findNextMission(next) {
    this.missionControl.currentMission(
      function(err, result) {
        if (err) {
          next(err, null);
        } else {
          this.mission = result;
          next(null, result);
        }
      }.bind(this)
    );
  }
  // make sure role selected is available
  roleIsAvailable(next) {
    this.missionControl.hasSpaceForRole(this.app.role, next);
  }
  // make sure height/weight/age is right for the role
  ensureRoleCompatible(next) {
    this.assignment = new Assignment({
      passenger: this.app,
      role: this.app.role,
      mission: this.mission
    });
    next(null, this.assignment.passengerIsCompatible);
  }

  approveApplication(next) {
    // save the assignment to disk
    this.db.saveAssignment({ assignment: this.assignment }, next);
  }

  processApplication(next) {
    async.series(
      {
        validated: this.ensureAppValid,
        mission: this.findNextMission,
        roleAvailable: this.roleIsAvailable,
        roleCompatible: this.ensureRoleCompatible,
        assignment: this.approveApplication
      },
      function(err, result) {
        if (err)
          next(null, {
            success: false,
            message: err
          });
        else {
          result.message = "Welcome to Mars!";
          result.success = true;
          next(null, result);
        }
      }
    );
  }
}

module.exports = ReviewProcess;
