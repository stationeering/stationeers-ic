"use strict";

const expect = require("chai").expect;

const IC = require("../src/IC");

describe("Instruction Tests", function () {
  describe("move", function () {
    it("should move/load a value into register from literal", function () {
      let ic = new IC();
      ic.load("move r1 1.5");

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(1.5);
    });

    it("should move/load a value into register from another register", function () {
      let ic = new IC();
      ic.load("move r1 r2");

      ic.setInternalRegister(2, 1.5);

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(1.5);
    });
  });

  describe("add", function () {
    it("should add to two values into a register", function () {
      let ic = new IC();
      ic.load("add r1 r0 2.5");

      ic.setInternalRegister(0, 1.5);

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(4);
    });
  });

  describe("sub", function () {
    it("should subtract to two values into a register", function () {
      let ic = new IC();
      ic.load("sub r1 r0 2.5");

      ic.setInternalRegister(0, 1.5);

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(-1);
    });
  });

  describe("mul", function () {
    it("should multiply to two values into a register", function () {
      let ic = new IC();
      ic.load("mul r1 4 2.5");

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(10);
    });
  });

  describe("div", function () {
    it("should divide to two values into a register", function () {
      let ic = new IC();
      ic.load("div r0 9 3");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(3);
    });
  });

  describe("mod", function () {
    it("should modulus to two values into a register", function () {
      let ic = new IC();
      ic.load("mod r0 -9 8");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(7);
    });
  });

  describe("sqrt", function () {
    it("should store the squareroot of s in d", function () {
      let ic = new IC();
      ic.load("sqrt r0 9");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(3);
    });
  });

  describe("round", function () {
    it("should store the round of s in d", function () {
      let ic = new IC();
      ic.load("round r0 1.51");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(2);
    });
  });

  describe("trunc", function () {
    it("should store the trunc of s in d", function () {
      let ic = new IC();
      ic.load("trunc r0 -1.71");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(-1);
    });
  });

  describe("ceil", function () {
    it("should store the ceil of s in d", function () {
      let ic = new IC();
      ic.load("ceil r0 1.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(2);
    });
  });

  describe("floor", function () {
    it("should store the floor of s in d", function () {
      let ic = new IC();
      ic.load("floor r0 1.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });
  });

  describe("max", function () {
    it("should store the max of s and t in d", function () {
      let ic = new IC();
      ic.load("max r0 1.01 2");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(2);
    });
  });

  describe("min", function () {
    it("should store the min of s and t in d", function () {
      let ic = new IC();
      ic.load("min r0 1.01 2");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1.01);
    });
  });

  describe("abs", function () {
    it("should store the abs of s in d", function () {
      let ic = new IC();
      ic.load("abs r0 -99");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(99);
    });
  });

  describe("log", function () {
    it("should store the log of s in d", function () {
      let ic = new IC();
      ic.load("log r0 10");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(2.302585092994046);
    });
  });

  describe("exp", function () {
    it("should store the exp of s in d", function () {
      let ic = new IC();
      ic.load("exp r0 10");

      ic.step();

      var deviation = Math.abs(ic.getInternalRegisters()[0] - 22026.46579480671);

      expect(deviation).to.be.at.most(0.00001);
    });
  });

  describe("rand", function () {
    it("should store a random value in d", function () {
      let ic = new IC();
      ic.load("rand r0");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.not.equal(0);
    });
  });

  describe("and", function () {
    it("should store 1 in d if s and t are > 0", function () {
      let ic = new IC();
      ic.load("and r0 0.01 0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 1 in d if s and t are < 0", function () {
      let ic = new IC();
      ic.load("and r0 -0.01 -0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 0 in d if s and t are == 0", function () {
      let ic = new IC();
      ic.load("and r0 0 0");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("or", function () {
    it("should store 1 in d if s or t are > 0", function () {
      let ic = new IC();
      ic.load("or r0 0.00 0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 1 in d if s or t are < 0", function () {
      let ic = new IC();
      ic.load("or r0 0.00 -0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 0 in d if s and t are == 0", function () {
      let ic = new IC();
      ic.load("or r0 0.00 0.00");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("xor", function () {
    it("should store 1 in d = 0.00 xor t = 0.01", function () {
      let ic = new IC();
      ic.load("xor r0 0.00 0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 1 in d = 0.01 xor t = 0.00", function () {
      let ic = new IC();
      ic.load("xor r0 0.01 0.00");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 0 in d = 0.01 xor t = 0.01", function () {
      let ic = new IC();
      ic.load("xor r0 0.01 0.02");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });

    it("should store 0 in d = -0.01 xor t = -0.01", function () {
      let ic = new IC();
      ic.load("xor r0 -0.01 -0.02");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });

    it("should store 1 in d = 0.00 xor t = -0.01", function () {
      let ic = new IC();
      ic.load("xor r0 0.00 -0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 1 in d = -0.01 xor t = 0.00", function () {
      let ic = new IC();
      ic.load("xor r0 -0.01 0.00");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });
  });

  describe("nor", function () {
    it("should store 1 in d if s and t are both 0", function () {
      let ic = new IC();
      ic.load("nor r0 0 0");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 0 in d if s and t are both 1", function () {
      let ic = new IC();
      ic.load("nor r0 1 1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });

    it("should store 0 in d if s and t are both -1", function () {
      let ic = new IC();
      ic.load("nor r0 -1 -1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });
  
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

  describe("push", function () {
    it ("should push the value in the register to the stack", function () {
      let ic = new IC();

      ic.setInternalRegister(0, 1.5);

      ic.load("push r0");
      expect(ic.getProgramErrors().length).to.equal(0);

      ic.step();

      expect(ic.getInternalRegisters()[16]).to.equal(1);
      expect(ic.getStack()[0]).to.equal(1.5);
    });

    it ("should throw return an error when the stack is full", function () {
      let ic = new IC();

      ic.setInternalRegister(0, 1.5);
      ic.load("push r0\nj 0");

      for (var i = 0; i < 512; i++) {
        expect(ic.step()).to.equal(undefined);
        expect(ic.step()).to.equal(undefined);
      }

      expect(ic.step()).to.equal("STACK_OVERFLOW");
    });

    it ("should provide a stack pointer alias automatically", function () {
      let ic = new IC();

      ic.load("push sp\npush sp");

      ic.step();
      ic.step();

      expect(ic.getStack()[0]).to.equal(0);
      expect(ic.getStack()[1]).to.equal(1);
    });
  });

  describe("pop", function () {
    it ("should pop the current the value of the stack to the register", function () {
      let ic = new IC();

      ic.setInternalRegister(0, 1.5);

      ic.load("push r0\npop r1");
      expect(ic.getProgramErrors().length).to.equal(0);

      ic.step();     
      ic.step();
      
      expect(ic.getInternalRegisters()[16]).to.equal(0);
      expect(ic.getInternalRegisters()[1]).to.equal(1.5);
    });

    it ("should throw return an error when the stack is empty", function () {
      let ic = new IC();

      ic.load("pop r0");

      expect(ic.step()).to.equal("STACK_UNDERFLOW");
    });
  });

  describe("peek", function () {
    it ("should peek the current the value of the stack to the register, but not change the stack pointer", function () {
      let ic = new IC();

      ic.setInternalRegister(0, 1.5);

      ic.load("push r0\npeek r1");
      expect(ic.getProgramErrors().length).to.equal(0);

      ic.step();
      ic.step();
      
      expect(ic.getInternalRegisters()[16]).to.equal(1);
      expect(ic.getInternalRegisters()[1]).to.equal(1.5);
    });

    it ("should throw return an error when the stack is empty", function () {
      let ic = new IC();

      ic.load("peek r0");

      expect(ic.step()).to.equal("STACK_UNDERFLOW");
    });
  });

  describe("hcf", function () {
    it ("should cause a step to return a notice", function () {
      let ic = new IC();

      ic.load("hcf");
      
      expect(ic.step()).to.equal("HALT_AND_CATCH_FIRE");
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
