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

  describe("j", function () {
    it("should change the program counter to the a value provided", function () {
      let ic = new IC();
      ic.load("j 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });
  });

  describe("bltz", function () {
    it("should change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bltz -1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bltz 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("blez", function () {
    it("should change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("blez 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("blez 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("bgez", function () {
    it("should change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bgez 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bgez -1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("bgtz", function () {
    it("should change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("bgtz 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("bgtz 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("beq", function () {
    it("should change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("beq 1 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("beq 1 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("bne", function () {
    it("should change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("bne 1 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });

    it("should not change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("bne 1 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });
  });

  describe("j", function () {
    it("should change the program counter to the a value provided", function () {
      let ic = new IC();
      ic.load("j 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should change the program counter to the a value provided, rounding if floating", function () {
      let ic = new IC();
      ic.load("j 9.4");

      var output = ic.getProgramErrors();

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_INVALID_TYPE");
      expect(output[0]["field"]).to.equal(0);
    });

    it("should accept a register as the jump address and then change the program counter to that value", function() {
      let ic = new IC();
      ic.load("move r0 9\nj r0");

      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should accept a register as the jump address and return an error if the jump result is negative", function() {
      let ic = new IC();
      ic.load("move r0 -9\nj r0");

      ic.step();
      var result = ic.step();

      expect(result).to.equal("INVALID_PROGRAM_COUNTER");
    });

    it("should accept a register as the jump address and then change the program counter to that value, rounded if floating", function() {
      let ic = new IC();
      ic.load("move r0 9.4\nj r0");

      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(9);
    });
  });

  describe("bltz", function () {
    it("should change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bltz -1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bltz 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });


  describe("blez", function () {
    it("should change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("blez 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("blez 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("bgez", function () {
    it("should change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bgez 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bgez -1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("bgtz", function () {
    it("should change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("bgtz 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("bgtz 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("beq", function () {
    it("should change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("beq 1 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });

    it("should not change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("beq 1 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("bne", function () {
    it("should change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("bne 1 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
    });

    it("should not change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("bne 1 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
    });
  });

  describe("jr", function () {
    it("should change the program counter to be relative to the provided negative value", function () {
      let ic = new IC();
      ic.load("yield\nyield\nyield\njr -2\nyield\nyield\n");

      expect(ic.getProgramErrors().length).to.equal(0);

      ic.step();
      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("brltz", function () {
    it("should change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrltz -1 -2\nyield\nyield\n");

      expect(ic.getProgramErrors().length).to.equal(0);

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(0);
    });

    it("should not change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrltz 0 9\nyield\nyield\n");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(3);
    });
  });

  describe("brlez", function () {
    it("should change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrlez 0 9\nyield\nyield\n");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(11);
    });

    it("should not change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrlez 1 9\nyield\nyield\n");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(3);
    });
  });

  describe("rbgez", function () {
    it("should change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrgez 0 9\nyield\nyield\n");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(11);
    });

    it("should not change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrgez -1 9\nyield\nyield\n");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(3);
    });
  });

  describe("brgtz", function () {
    it("should change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrgtz 1 9");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(11);
    });

    it("should not change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrgtz 0 9");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(3);
    });
  });

  describe("breq", function () {
    it("should change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbreq 1 1 9");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(11);
    });

    it("should not change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbreq 1 0 9");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(3);
    });
  });

  describe("brne", function () {
    it("should change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrne 1 1 9");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(3);
    });

    it("should not change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrne 1 0 9");

      ic.step();
      ic.step();
      ic.step();

      expect(ic._programCounter).to.equal(11);
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

  describe("sgt", function () {
    it ("should set the register to 1 if a > b", function () {
      let ic = new IC();

      ic.load("sgt r0 1 0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it ("should set the register to 0 if a <= b", function () {
      let ic = new IC();

      ic.load("sgt r0 0 0");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sle", function () {
    it ("should set the register to 1 if a <= b", function () {
      let ic = new IC();

      ic.load("sle r0 1 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it ("should set the register to 0 if a > b", function () {
      let ic = new IC();

      ic.load("sle r0 2 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sge", function () {
    it ("should set the register to 1 if a >= b", function () {
      let ic = new IC();

      ic.load("sge r0 1 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it ("should set the register to 0 if a < b", function () {
      let ic = new IC();

      ic.load("sge r0 0 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("seq", function () {
    it ("should set the register to 1 if a == b", function () {
      let ic = new IC();

      ic.load("seq r0 1 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it ("should set the register to 0 if a != b", function () {
      let ic = new IC();

      ic.load("seq r0 0 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sne", function () {
    it ("should set the register to 1 if a != b", function () {
      let ic = new IC();

      ic.load("sne r0 0 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it ("should set the register to 0 if a == b", function () {
      let ic = new IC();

      ic.load("sne r0 1 1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sap", function () {
    it ("should set the register to 1 if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("sap r0 1 1.01 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it ("should set the register to 0 if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("sap r0 1 2.01 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("sna", function () {
    it ("should set the register to 1 if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("sna r0 1 2.01 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it ("should set the register to 0 if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("sna r0 1 1.01 0.1");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("bap", function () {
    it ("should branch if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bap 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bap 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("bna", function () {
    it ("should branch if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bna 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bna 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });
  
  describe("brap", function () {
    it ("should branch relative if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brap 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(10);
    });

    it ("should branch relative if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brap 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("brna", function () {
    it ("should branch relative if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brna 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(10);
    });

    it ("should branch relative if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brna 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("jal", function () {
    it ("should change the program counter and set the return address register", function () {
      let ic = new IC();

      ic.load([
        "yield",
        "yield",
        "jal 9"
      ].join("\n"));

      ic.step();
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(3);
    });

    it ("should ensure that the ra alias is setup", function () {
      let ic = new IC();

      ic.load([
        "move ra 4",
        "move r10 ra"
      ].join("\n"));

      ic.step();
      ic.step();

      expect(ic.getInternalRegisters()[10]).to.equal(4);
    });
  });

  describe("hcf", function () {
    it ("should cause a step to return a notice", function () {
      let ic = new IC();

      ic.load("hcf");
      
      expect(ic.step()).to.equal("HALT_AND_CATCH_FIRE");
    });
  });

  describe("select", function () {
    it ("should store c in a if b != 0", function () {
      let ic = new IC();

      ic.load("select r0 0.01 50 100");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(50);
    });

    it ("should store d in a if b == 0", function () {
      let ic = new IC();

      ic.load("select r0 0.0 50 100");
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(100);
    });
  });

  describe("bltzal", function () {
    it("should change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bltzal -1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bltzal 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });


  describe("bgezal", function () {
    it("should change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bgezal 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bgezal -1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("blezal", function () {
    it("should change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("blezal 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("blezal 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bgtzal", function () {
    it("should change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("bgtzal 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("bgtzal 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("beqal", function () {
    it("should change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("beqal 1 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("beqal 1 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bneal", function () {
    it("should change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("bneal 1 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });

    it("should not change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("bneal 1 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);      
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

  describe("bdse", function () {
    it("should set pc to 9 if device is set/connected", function () {
      let ic = new IC();

      ic.load("bdse d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it("should set pc to 1 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);

      ic.load("bdse d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("bdns", function () {
    it("should set pc to 1 if device is set/connected", function () {
      let ic = new IC();

      ic.load("bdns d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });

    it("should set pc to 9 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);

      ic.load("bdns d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });
  });

  describe("brdse", function () {
    it("should set pc to 10 if device is set/connected", function () {
      let ic = new IC();

      ic.load("brdse d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(10);
    });

    it("should set pc to 1 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);

      ic.load("brdse d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("brdns", function () {
    it("should set pc to 1 if device is set/connected", function () {
      let ic = new IC();

      ic.load("brdns d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });

    it("should set pc to 10 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);

      ic.load("brdns d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(10);
    });
  });

  describe("bdseal", function () {
    it("should set pc to 9 and RA to 1 if device is set/connected", function () {
      let ic = new IC();

      ic.load("bdseal d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should set pc to 1 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);

      ic.load("bdseal d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bdnsal", function () {
    it("should set pc to 1 if device is set/connected", function () {
      let ic = new IC();

      ic.load("bdnsal d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });

    it("should set pc to 9 and RA to 1 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);

      ic.load("bdnsal d0 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
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
