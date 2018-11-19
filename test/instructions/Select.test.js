"use strict";

const expect = require("chai").expect;

const IC = require("../../src/IC");

describe("Select Tests", function () {
  describe("sgt", function () {
    it("should set the register to 1 if a > b", function () {
      let ic = new IC();

      ic.load("sgt r0 1 0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if a <= b", function () {
      let ic = new IC();

      ic.load("sgt r0 0 0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sle", function () {
    it("should set the register to 1 if a <= b", function () {
      let ic = new IC();

      ic.load("sle r0 1 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if a > b", function () {
      let ic = new IC();

      ic.load("sle r0 2 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sge", function () {
    it("should set the register to 1 if a >= b", function () {
      let ic = new IC();

      ic.load("sge r0 1 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if a < b", function () {
      let ic = new IC();

      ic.load("sge r0 0 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("seq", function () {
    it("should set the register to 1 if a == b", function () {
      let ic = new IC();

      ic.load("seq r0 1 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if a != b", function () {
      let ic = new IC();

      ic.load("seq r0 0 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sne", function () {
    it("should set the register to 1 if a != b", function () {
      let ic = new IC();

      ic.load("sne r0 0 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if a == b", function () {
      let ic = new IC();

      ic.load("sne r0 1 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sap", function () {
    it("should set the register to 1 if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("sap r0 1 1.01 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("sap r0 1 2.01 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sna", function () {
    it("should set the register to 1 if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("sna r0 1 2.01 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("sna r0 1 1.01 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("select", function () {
    it("should store c in a if b != 0", function () {
      let ic = new IC();

      ic.load("select r0 0.01 50 100");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(50);
    });

    it("should store d in a if b == 0", function () {
      let ic = new IC();

      ic.load("select r0 0.0 50 100");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(100);
    });
  });

  describe("sdse", function () {
    it("should set 1 in register if device is set/connected", function () {
      let ic = new IC();
      ic.setInternalRegister(0, -1);

      ic.load("sdse r0 d0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set 0 in register if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);
      ic.setInternalRegister(0, -1);

      ic.load("sdse r0 d0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sdns", function () {
    it("should set 0 in register if device is set/connected", function () {
      let ic = new IC();
      ic.setInternalRegister(0, -1);

      ic.load("sdns r0 d0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });

    it("should set 1 in register if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);
      ic.setInternalRegister(0, -1);

      ic.load("sdns r0 d0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });
  });

  describe("slt", function () {
    it("should store a 1 if s < t", function () {
      let ic = new IC();
      ic.load("slt r0 1 2");
      ic.setInternalRegister(0, 9);

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store a 0 if s >= t", function () {
      let ic = new IC();
      ic.load("slt r0 1 1");
      ic.setInternalRegister(0, 9);

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sltz", function () {
    it("should store a 1 if s < 0", function () {
      let ic = new IC();
      ic.load("sltz r0 -1");
      ic.setInternalRegister(0, 9);

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store a 0 if s >= 0", function () {
      let ic = new IC();
      ic.load("sltz r0 0");
      ic.setInternalRegister(0, 9);

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sgtz", function () {
    it("should store a 1 if s > 0", function () {
      let ic = new IC();
      ic.load("sgtz r0 1");
      ic.setInternalRegister(0, 9);

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store a 0 if s <= 0", function () {
      let ic = new IC();
      ic.load("sgtz r0 0");
      ic.setInternalRegister(0, 9);

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("slez", function () {
    it("should set the register to 1 if a <= 0", function () {
      let ic = new IC();

      ic.load("slez r0 0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if a > 0", function () {
      let ic = new IC();

      ic.load("slez r0 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sgez", function () {
    it("should set the register to 1 if a >= 0", function () {
      let ic = new IC();

      ic.load("sgez r0 0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if a < 0", function () {
      let ic = new IC();

      ic.load("sgez r0 -1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("seqz", function () {
    it("should set the register to 1 if a == 0", function () {
      let ic = new IC();

      ic.load("seqz r0 0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if a != 0", function () {
      let ic = new IC();

      ic.load("seqz r0 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("snez", function () {
    it("should set the register to 1 if a != 0", function () {
      let ic = new IC();

      ic.load("snez r0 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if a == 0", function () {
      let ic = new IC();

      ic.load("snez r0 0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sapz", function () {
    it("should set the register to 1 if abs(a - 0) <= c * max(abs(a), abs(0))", function () {
      let ic = new IC();

      ic.load("sapz r0 1.121039E-45 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if abs(a - 0) > c * max(abs(a), abs(0))", function () {
      let ic = new IC();

      ic.load("sapz r0 1 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("snaz", function () {
    it("should set the register to 1 if abs(a - 0) > c * max(abs(a), abs(0))", function () {
      let ic = new IC();

      ic.load("snaz r0 1 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should set the register to 0 if abs(a - 0) <= c * max(abs(a), abs(0))", function () {
      let ic = new IC();

      ic.load("snaz r0 1.121039E-45 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });
});