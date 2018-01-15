var assert = require("assert");
var moment = require("moment");
var MembershipApplication = require("../models/membership_application");
var Helpers = require("./helpers");

describe("Membership application requirements", () => {
  var validApp;

  before(function() {
    // Arrange the data here
    validApp = Helpers.validApplication;
  });

  describe("Application valid if ...", () => {
    it("all validators successful", function() {
      assert(validApp.isValid(), "Not valid");
    });
  });

  describe("Application invalid if ...", () => {
    it("is expired", function() {
      var app = new MembershipApplication({ validUntil: "2010-01-01" });
      assert(app.expired());
    });
    it("first is omitted", function() {
      var app = new MembershipApplication({ first: "", last: "name" });
      assert(!app.nameIsValid(), "Not valid");
    });
    it("last is omitted", function() {
      var app = new MembershipApplication({ first: " " });
      assert(!app.nameIsValid(), "Not valid");
    });
    it("email is 4 chars or less", () => {
      var app = new MembershipApplication({ email: "5@g" });
      assert(!app.emailIsValid(), "Not valid");
    });
    it("email doesn't contain @", () => {
      var app = new MembershipApplication({ email: "5ggggggggggg" });
      assert(!app.emailIsValid(), "Not valid");
    });
    it("email is omitted", () => {
      var app = new MembershipApplication();
      assert(!app.emailIsValid(), "Not valid");
    });
    it("age is more than 100", function() {
      var app = new MembershipApplication({ age: 120 });
      assert(!app.ageIsValid(), "Not valid");
    });
    it("age less than 15", function() {
      var app = new MembershipApplication({ age: 12 });
      assert(!app.ageIsValid(), "Not valid");
    });
    it("age is omitted", function() {
      var app = new MembershipApplication({ age: " " });
      assert(!app.ageIsValid(), "Not valid");
    });
    it("weight less than 100", function() {
      var app = new MembershipApplication({ weight: 90 });
      assert(!app.weightIsValid(), "Not valid");
    });
    it("weight is more than 300", function() {
      var app = new MembershipApplication({ weight: 320 });
      assert(!app.weightIsValid(), "Not valid");
    });
    it("weight is omitted", function() {
      var app = new MembershipApplication({ weight: " " });
      assert(!app.weightIsValid(), "Not valid");
    });
    it("height is less than 60 inches", function() {
      var app = new MembershipApplication({ height: 50 });
      assert(!app.heightIsValid(), "Not valid");
    });
    it("height is more than 75 inches", function() {
      var app = new MembershipApplication({ height: 80 });
      assert(!app.heightIsValid(), "Not valid");
    });
    it("height is omitted", function() {
      var app = new MembershipApplication({ height: " " });
      assert(!app.heightIsValid(), "Not valid");
    });
  });
});
