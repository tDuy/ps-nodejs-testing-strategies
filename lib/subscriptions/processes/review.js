var Emitter = require("events").EventEmitter;
// var util = require("util");

class ReviewProcess extends Emitter {
  constructor() {
    super();
    this.callback = undefined;

    // even path
    this.on("application-received", this.ensureAppValid);
    this.on("validated", this.findNextMission);
    this.on("mission-selected", this.roleIsAvailable);
    this.on("role-available", this.ensureRoleCompatible);
    this.on("role-compatible", this.acceptApplication);

    // sad path
    this.on("invalid", this.denyApplication);
  }
  // make sure app is valid
  ensureAppValid(app) {
    if (app.isValid()) {
      this.emit("validated", app);
    } else {
      // exactly what is wrong ?
      this.emit("invalid", app.validationMessage());
    }
  }
  // find next mission
  findNextMission(app) {
    app.mission = {
      commander: null,
      pilot: null,
      MAVPilot: null,
      passengers: []
    };
    this.emit("mission-selected", app);
  }
  // make sure role selected is available
  roleIsAvailable(app) {
    // no concept of role yet, need more info
    this.emit("role-available", app);
  }
  // make sure height/weight/age is right for the role
  ensureRoleCompatible(app) {
    // need more info about role
    this.emit("role-compatible", app);
  }

  // accept the app with a message
  acceptApplication(app) {
    // what do we do
    this.callback(null, {
      success: true,
      message: "Welcome to the Mars Program!"
    });
  }

  // deny the app with a message
  denyApplication(message) {
    this.callback(null, {
      success: false,
      message: message
    });
  }

  processApplication(app, next) {
    this.callback = next;
    this.emit("application-received", app);
  }
}

module.exports = ReviewProcess;
