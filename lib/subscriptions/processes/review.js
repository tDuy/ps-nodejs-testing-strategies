var async = require("async");
var assert = require("assert");

class ReviewProcess {
  constructor(args) {
    assert(args.application, "Need an application to review");

    this.app = args.application;

    this.ensureAppValid = this.ensureAppValid.bind(this);
    // this.findNextMission = this.findNextMission.bind(this);
    // this.roleIsAvailable = this.roleIsAvailable.bind(this);
    // this.ensureRoleCompatible = this.ensureRoleCompatible.bind(this);
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
    var mission = {
      commander: null,
      pilot: null,
      MAVPilot: null,
      passengers: []
    };
    next(null, mission);
  }
  // make sure role selected is available
  roleIsAvailable(next) {
    // no concept of role yet, need more info
    next(null, true);
  }
  // make sure height/weight/age is right for the role
  ensureRoleCompatible(next) {
    // need more info about role
    next(null, true);
  }

  approveApplication(next) {
    next(null, true);
  }

  processApplication(next) {
    async.series(
      {
        validated: this.ensureAppValid,
        mission: this.findNextMission,
        roleAvailable: this.roleIsAvailable,
        roleCompatible: this.ensureRoleCompatible,
        success: this.approveApplication
      },
      function(err, result) {
        if (err)
          next(null, {
            success: false,
            message: err
          });
        else {
          result.message = "Welcome to Mars!";
          // console.log(result);

          next(null, result);
        }
      }
    );
  }
}

module.exports = ReviewProcess;
