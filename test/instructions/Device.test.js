"use strict";

const expect = require("chai").expect;

const IC = require("../../src/IC");

describe("Device Tests", function () {
  describe("s", function () {
    it ("should save the value to the IO register", function () {
      let ic = new IC();
      ic.load("s d0 Field 1");

      ic.step();

      expect(ic.getIORegisters()[0]["Field"]).to.equal(1);
    });
  });

  describe("l", function () {
    it ("should load the value from the IO register", function () {
      let ic = new IC();
      ic.setIORegister(0, "Field", 1.5);

      ic.load("l r0 d0 Field");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1.5);
    });

    it ("should fail parse if the device is not a device", function () {
      let ic = new IC();

      ic.load("l r0 r0 Field");

      var output = ic.getProgramErrors();

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_INVALID_TYPE");
      expect(output[0]["field"]).to.equal(1);
    });
  });

  describe("ls", function () {
    it("should put the value of the slot's logic type into the register", function () {
      let ic = new IC();

      ic.setIOSlot(1, 2, "Setting", 1.5);

      ic.load("move r0 2\nls r2 d1 r0 Setting");
      ic.step();
      ic.step();

      expect(ic.getProgramErrors().length).to.equal(0);
      expect(ic.getInternalRegisters()[2]).to.equal(1.5);
    });

    it("should create an 0 value slot logic type when read and it does not exist", function () {
      let ic = new IC();

      ic.load("ls r2 d1 2 Setting");
      ic.step();

      var result = ic.getIOSlots();
      expect(result[1][2]["Setting"]).to.equal(0);
    });
  });

  describe("lr", function () {
    it("should put the value of the reagents's logic mode into the register", function () {
      let ic = new IC();

      ic.setIOReagent(3, "Iron", "Quantity", 33);

      ic.load("lr r4 d3 Quantity Iron");
      ic.step();

      expect(ic.getProgramErrors().length).to.equal(0);
      expect(ic.getInternalRegisters()[4]).to.equal(33);
    });

    it("should create an 0 value reagent logic mode when read and it does not exist", function () {
      let ic = new IC();

      ic.load("lr r4 d3 Quantity Iron");
      ic.step();

      var result = ic.getIOReagents();
      expect(result[3]["Iron"]["Quantity"]).to.equal(0);
    });
  });
});