"use strict";

const expect = require("chai").expect;

const IC = require("../src/IC");

describe("IC Tests", function () {
  const VALID_MULTIPLE_INSTRUCTION = "yield\nyield\nyield\n";

  describe("Loading instructions", function () {
    it("reads a string with instructions and can return the number of lines/instructions read", function () {
      let ic = new IC();
      ic.load(VALID_MULTIPLE_INSTRUCTION);

      expect(ic.getInstructionCount()).to.equal(4);
    });
  });

  describe("Parsing a line", function () {
    it("should handle a command with random spacing", function () {
      let ic = new IC();

      var input = "TOKEN a0   a1   b0";

      var output = ic._parseLine(input);

      expect(output).to.deep.equal(["TOKEN", "a0", "a1", "b0"]);
    });

    it("should handle a command followed by a comment", function () {
      let ic = new IC();

      var input = "TOKEN a0 // This is a comment";

      var output = ic._parseLine(input);

      expect(output).to.deep.equal(["TOKEN", "a0"]);
    });

    it("should handle a command followed by a alternative comment", function () {
      let ic = new IC();

      var input = "TOKEN a0 # This is a comment";

      var output = ic._parseLine(input);

      expect(output).to.deep.equal(["TOKEN", "a0"]);
    });

    it("should handle a command followed by a comment, but with no space", function () {
      let ic = new IC();

      var input = "TOKEN a0// This is a comment";

      var output = ic._parseLine(input);

      expect(output).to.deep.equal(["TOKEN", "a0"]);
    });

    it("should handle a comment on it's own", function () {
      let ic = new IC();

      var input = " // This is a comment";

      var output = ic._parseLine(input);

      expect(output).to.deep.equal([]);
    });
  });

  describe("Validating program", function () {
    it("will allow an empty line", function () {
      let ic = new IC();

      var input = "";

      var output = ic._validateLine(input, 0);

      expect(output.length).to.equal(0);
    });

    it("will allow a comment line", function () {
      let ic = new IC();

      var input = "// This is a comment, ignore me.";

      var output = ic._validateLine(input, 0);

      expect(output.length).to.equal(0);
    });

    it("will return an error for an unknown instruction", function () {
      let ic = new IC();

      var input = "unknown";

      var output = ic._validateLine(input, 123);

      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("UNKNOWN_INSTRUCTION");
    });

    it("will not return an error if a valid instruction with no arguements is passed", function () {
      let ic = new IC();

      var input = "yield";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(0);
    });

    it("will return a errors if parameters are missing", function () {
      let ic = new IC();

      var input = "move";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(2);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("MISSING_FIELD");
      expect(output[0]["field"]).to.equal(0);
      expect(output[0]["type"]).to.equal("error");
      expect(output[1]["line"]).to.equal(123);
      expect(output[1]["error"]).to.equal("MISSING_FIELD");
      expect(output[1]["field"]).to.equal(1);
      expect(output[1]["type"]).to.equal("error");
    });

    it("will return errors if parameters are provided when not needed", function () {
      let ic = new IC();

      var input = "yield i0 i2";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(2);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("EXTRA_FIELD");
      expect(output[0]["field"]).to.equal(0);
      expect(output[0]["type"]).to.equal("error");
      expect(output[1]["line"]).to.equal(123);
      expect(output[1]["error"]).to.equal("EXTRA_FIELD");
      expect(output[1]["field"]).to.equal(1);
      expect(output[1]["type"]).to.equal("error");
    });

    it("will return errors if valid type is beyond the range", function () {
      let ic = new IC();

      var input = "move r99 r98";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(2);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_NO_SUCH_REGISTER");
      expect(output[0]["field"]).to.equal(0);
      expect(output[0]["type"]).to.equal("error");
      expect(output[1]["line"]).to.equal(123);
      expect(output[1]["error"]).to.equal("INVALID_FIELD_NO_SUCH_REGISTER");
      expect(output[1]["field"]).to.equal(1);
      expect(output[1]["type"]).to.equal("error");
    });
  });

  describe("Inputs, outputs and registers", function () {
    it("has IO registers which can be read", function () {
      let ic = new IC();
      let ioRegisters = ic.getIORegisters();

      expect(ioRegisters.length).to.equal(7);
      expect(ioRegisters[0]).to.deep.equal({});
      expect(ioRegisters[5]).to.deep.equal({});
    });

    it("has internal registers which can be read", function () {
      let ic = new IC();
      let internalRegisters = ic.getInternalRegisters();

      expect(internalRegisters.length).to.equal(18);
      expect(internalRegisters[0]).to.equal(0);
      expect(internalRegisters[17]).to.equal(0);
    });

    it("has IO registers which can be written and read", function () {
      let ic = new IC();

      ic.setIORegister(1, "field", 100);
      expect(ic.getIORegisters()[1]["field"]).to.equal(100);
      expect(ic.getIORegisters()[2]).to.deep.equal({});
    });

    it("has IO registers which when written with a value other than a number will not change", function() {
      let ic = new IC();

      ic.setIORegister(1, "field", "bob");
      expect(ic.getIORegisters()[1]["field"]).to.equal(0);
    });

    it("has internal registers which can be written and read", function () {
      let ic = new IC();

      ic.setInternalRegister(3, 100);
      expect(ic.getInternalRegisters()[3]).to.equal(100);
    });

    it("has internal registers which when written with a value other than a number will not change", function() {
      let ic = new IC();

      ic.setInternalRegister(3, 1);
      ic.setInternalRegister(3, "bob");
      expect(ic.getInternalRegisters()[3]).to.equal(0);
    });

    it("requesting a field on an IO register which doesn't exist will default it to 0", function () {
      let ic = new IC();
      ic._getRegister("d0", "Test", ["d"]);

      var keys = Object.keys(ic.getIORegisters()[0]);

      expect(keys).contains("Test");
    });

    it("will remove IO register fields when they are set to undefined", function () {
      let ic = new IC();

      ic.setIORegister(1, "field", 100);
      expect(ic.getIORegisters()[1]["field"]).to.equal(100);

      ic.setIORegister(1, "field", undefined);
      expect(Object.keys(ic.getIORegisters()[1])).not.to.contains("field");
    });
  });

  describe("Step and flow behaviour", function () {
    it("increases the programme counter to increase", function () {
      let ic = new IC();
      ic.load(VALID_MULTIPLE_INSTRUCTION);

      expect(ic.programCounter()).to.equal(0);
      ic.step();
      expect(ic.programCounter()).to.equal(1);
      ic.step();
      expect(ic.programCounter()).to.equal(2);
    });

    it("restart sets programme counter to 0", function () {
      let ic = new IC();
      ic.load(VALID_MULTIPLE_INSTRUCTION);
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      ic.restart();
      expect(ic.programCounter()).to.equal(0);
    });

    it("restart sets internal registers to 0", function () {
      let ic = new IC();
      ic.load(VALID_MULTIPLE_INSTRUCTION);
      ic.step();

      for (var i = 0; i < 6; i++) {
        ic.setInternalRegister(i, i);
      }

      ic.restart();

      var internalRegisters = ic.getInternalRegisters();

      for (i = 0; i < internalRegisters.length; i++) {
        expect(internalRegisters[i]).to.equal(0);
      }
    });

    it("restart sets stack values to 0", function () {
      let ic = new IC();
      ic.load("push 1\nj 0");

      for (var i = 0; i < 128; i++) {
        ic.step();
      }

      ic.restart();

      var stack = ic.getStack();

      for (i = 0; i < stack.length; i++) {
        expect(stack[i]).to.equal(0);
      }
    });

    it("does not increase the programme counter if the program is invalid", function () {
      let ic = new IC();
      ic.load("invalid");
      expect(ic.programCounter()).to.equal(0);

      expect(ic.step()).to.equal("INVALID_PROGRAM");

      expect(ic.programCounter()).to.equal(0);
    });

    it("returns YIELD if the step executed a yield instruction", function () {
      let ic = new IC();
      ic.load("yield");

      var output = ic.step();

      expect(output).to.equal("YIELD");
    });

    it("returns END_OF_PROGRAM if the step executed the last line and is not a YIELD", function () {
      let ic = new IC();
      ic.load("move r0 20");

      var output = ic.step();

      expect(output).to.equal("END_OF_PROGRAM");
    });
  });

  describe("IO ports", function () {
    it("should have names which return d0 for 0, d1 for 1, etc.", function () {
      let ic = new IC();
      expect(ic.getIONames()[0]).to.equal("d0");
      expect(ic.getIONames()[1]).to.equal("d1");
    });

    it("should have a valid register called db for the base", function () {
      let ic = new IC();

      ic.load("s db Setting 10\nl r0 db Setting");

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      ic.step();

      expect(ic.getIORegisters()[6]["Setting"]).to.equal(10);
      expect(ic.getInternalRegisters()[0]).to.equal(10);
    });

    it("should have db as the last register on IO, and have a name of db", function () {
      let ic = new IC();

      expect(ic.getIONames()[6]).to.equal("db");
    });
  });

  describe("jump labels", function () {
    it("should jump back to the instruction that was labeled", function () {
      let ic = new IC();

      ic.load("start:\nj start");

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      expect(ic.step()).to.equal(undefined);
      expect(ic._programCounter).to.equal(1);

      expect(ic.step()).to.equal(undefined);
      expect(ic._programCounter).to.equal(0);
    });

    it("should error when a jump tag is duplicated", function () {
      let ic = new IC();

      ic.load("start:\nj start\nstart:");

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(1);

      expect(output[0]["line"]).to.equal(2);
      expect(output[0]["error"]).to.equal("INVALID_JUMP_TAG_DUPLICATE");
      expect(output[0]["type"]).to.equal("error");
    });

    it("should error when a jump tag is missing", function () {
      let ic = new IC();

      ic.load("j start");

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(1);

      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_INVALID_TYPE");
      expect(output[0]["validTypes"]).to.deep.equal(["r", "i", "a", "j"]);
    });

    it("should error when a jump tag is passed to a relative jump", function () {
      let ic = new IC();

      ic.load("start:\njr start");

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(1);

      expect(output[0]["line"]).to.equal(1);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_INVALID_TYPE");
      expect(output[0]["type"]).to.equal("error");
      expect(output[0]["validTypes"]).to.deep.equal(["r", "i", "a"]);
    });

    it("should error when there is content after a jump tag", function () {
      let ic = new IC();

      ic.load("start: move r0 1");

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(1);

      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("INVALID_JUMP_TAG_CONTENT_AFTER");
      expect(output[0]["type"]).to.equal("error");
    });
  });

  describe("alias", function () {
    it("should create an entry in aliases inside the IC and store the register index when run", function () {
      let ic = new IC();

      ic.load("alias bob r5");

      expect(Object.keys(ic._aliases)).to.contains("bob");

      ic.step();

      expect(ic._aliases["bob"]).to.deep.equal({ value: 5, type: "r" });
    });

    it("should allow programs to reference an alias rather than a register in code", function () {
      let ic = new IC();

      ic.load([
        "alias test r5",
        "move test 7"
      ].join("\n"));

      expect(ic.getProgramErrors().length).to.equal(0);
    });

    it("should still error if an unused alias is found", function () {
      let ic = new IC();

      ic.load([
        "move test 7"
      ].join("\n"));

      var output = ic.getProgramErrors();

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_INVALID_TYPE");
      expect(output[0]["field"]).to.equal(0);
      expect(output[0]["type"]).to.equal("error");
    });

    it("should cause substitutions of aliases with registers when an alias is encountered in a command being writen to", function () {
      let ic = new IC();

      ic.load([
        "alias red r5",
        "move red 7"
      ].join("\n"));

      ic.step();
      ic.step();

      expect(ic.getInternalRegisters()[5]).to.equal(7);
    });

    it("should cause substitutions of aliases with registers when an alias is encountered in a command being read from", function () {
      let ic = new IC();

      ic.load([
        "move r0 7",
        "alias red r0",
        "move r1 red"
      ].join("\n"));

      ic.step();
      ic.step();
      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(7);
    });

    it("should fail to parse the aliases when register field is not a register", function () {
      let ic = new IC();

      ic.load([
        "alias red 1",
      ].join("\n"));

      var output = ic.getProgramErrors();

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_INVALID_TYPE");
      expect(output[0]["field"]).to.equal(1);
      expect(output[0]["type"]).to.equal("error");
    });

    it("should allow an alias to be made from another alias", function () {
      let ic = new IC();

      ic.load([
        "alias red r1",
        "alias green red"
      ].join("\n"));

      ic.step();
      ic.step();

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      var labels = ic.getInternalLabels();
      expect(labels[1]).to.equal("red,green");
    });

    it ("should make internal register aliases available for labels", function () {
      let ic = new IC();

      ic.load([
        "alias red r1",
        "alias green r2",
        "alias blue r1",
        "alias purple r1"
      ].join("\n"));

      ic.step();
      ic.step();
      ic.step();

      var labels = ic.getInternalLabels();
      expect(labels[0]).to.equal("");
      expect(labels[1]).to.equal("red,blue");
      expect(labels[2]).to.equal("green");
    });

    it ("should accept alias names which start with d (like a device)", function () {
      let ic = new IC();

      ic.load([
        "alias dialSetting r1"
      ].join("\n"));

      var output = ic.getProgramErrors();

      expect(output.length).to.equal(0);
    });

    it ("should alias a device number to a name and be in the labels output", function () {
      let ic = new IC();

      ic.load([
        "alias heater d3"
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();

      expect(ic.getIOLabels()[3]).to.equal("heater");
    });

    it ("should alias a device number to a name and be usable in load commands", function () {
      let ic = new IC();

      ic.load([
        "alias GasSensor d3",
        "l r0 GasSensor Temperature"
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.setIORegister(3, "Temperature", 280);

      ic.step();
      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(280);
    });

    it ("should alias a device number to a name and be usable in save commands", function () {
      let ic = new IC();

      ic.load([
        "alias Heater d3",
        "s Heater On r0"
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.setInternalRegister(0, 1);

      ic.step();
      ic.step();

      expect(ic.getIORegisters()[3]["On"]).to.equal(1);
    });

    it ("should throw an error when trying to use the wrong kind of alias for loads", function () {
      let ic = new IC();

      ic.load([
        "alias Heater r3",
        "l r0 Heater On"
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      var result = ic.step();

      expect(result).to.equal("ALIAS_TYPE_MISMATCH");
    });

    it ("should throw an error when trying to use the wrong kind of alias for saves", function () {
      let ic = new IC();

      ic.load([
        "alias Heater r3",
        "s Heater On r0"
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      var result = ic.step();

      expect(result).to.equal("ALIAS_TYPE_MISMATCH");
    });

    it ("should successfully jump if the alias begins with a d", function() {
      let ic = new IC();

      ic.load([
        "start:",
        "bgtz 1.0 dump",
        "yield",
        "j start",
        "dump:",
        "yield",
        "j start"
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(4);
    });
  });

  describe("Checking program limits", function () {
    it("should verify the program can not be longer than permitted", function () {
      let ic = new IC();

      let program = Array(129).fill("move r0 1").join("\n");
      ic.load(program);

      var output = ic.getProgramErrors();

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(128);
      expect(output[0]["error"]).to.equal("PROGRAM_TOO_LONG");
      expect(output[0]["type"]).to.equal("warning");
    });

    it("should verify an individual line can not be longer than permitted", function () {
      let ic = new IC();

      let program = Array(53).fill("#").join("");
      ic.load(program);

      var output = ic.getProgramErrors();

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("LINE_TOO_LONG");
      expect(output[0]["type"]).to.equal("warning");

      expect(ic.isValidProgram()).to.equal(true);
    });

    it("should verify an individual line can not be longer than permitted and still check for other errors", function () {
      let ic = new IC();

      let program = Array(53).fill("#").join("");
      ic.load("l 1 d0 Setting " + program);

      var output = ic.getProgramErrors();

      expect(output.length).to.equal(2);
      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("LINE_TOO_LONG");
      expect(output[0]["type"]).to.equal("warning");
      expect(output[1]["line"]).to.equal(0);
      expect(output[1]["error"]).to.equal("INVALID_FIELD_INVALID_TYPE");
      expect(output[1]["type"]).to.equal("error");
      expect(output[1]["field"]).to.equal(0);

      expect(ic.isValidProgram()).to.equal(false);
    });
  });

  describe("Indirect register access", function () {
    it("reading from a register", function () {
      let ic = new IC();

      ic.load([
        "move r0 99",
        "move r1 0",
        "move r2 1",
        "move r3 2",
        "move r4 3",
        "move r15 rrrrr4"
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      ic.step();
      ic.step();
      ic.step();
      ic.step();
      ic.step();

      var registers = ic.getInternalRegisters();

      expect(registers[15]).to.equal(99);
    });

    it("writing to a register", function () {
      let ic = new IC();

      ic.load([
        "move r0 1",
        "move rr0 2",
        "move rrr0 3",
        "move rrrr0 4",
        "move rrrrr0 5",
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      ic.step();
      ic.step();
      ic.step();
      ic.step();

      var registers = ic.getInternalRegisters();

      expect(registers[0]).to.equal(1);
      expect(registers[1]).to.equal(2);
      expect(registers[2]).to.equal(3);
      expect(registers[3]).to.equal(4);
      expect(registers[4]).to.equal(5);
    });

    it("reading from a register which references an illegal indirection should error the IC", function () {
      let ic = new IC();

      ic.load([
        "move r0 99",
        "move r3 rr0",
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      var result = ic.step();

      expect(result).to.equal("INVALID_REGISTER_LOCATION");
    });
  });

  describe("Indirect device access", function () {
    it("reading from a device via a register", function () {
      let ic = new IC();

      ic.load([
        "move r0 1",
        "move r1 2",
        "move r2 3",
        "move r3 4",
        "move r4 5",
        "l r15 drrrrr0 Setting"
      ].join("\n"));

      ic.setIORegister(5, "Setting", 99);

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      ic.step();
      ic.step();
      ic.step();
      ic.step();
      ic.step();

      var registers = ic.getInternalRegisters();

      expect(registers[15]).to.equal(99);
    });

    it("writing to a device via register", function () {
      let ic = new IC();

      ic.load([
        "move r0 1",
        "move r1 2",
        "move r2 3",
        "move r3 4",
        "move r4 5",
        "s drrrrr0 Setting 99"
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      ic.step();
      ic.step();
      ic.step();
      ic.step();
      ic.step();

      var registers = ic.getIORegisters();

      expect(registers[5]["Setting"]).to.equal(99);
    });

    it("reading from a register which references an illegal indirection should error the IC", function () {
      let ic = new IC();

      ic.load([
        "move r0 99",
        "l r15 dr0 Setting",
      ].join("\n"));

      var output = ic.getProgramErrors();
      expect(output.length).to.equal(0);

      ic.step();
      var result = ic.step();

      expect(result).to.equal("INVALID_REGISTER_LOCATION");
    });
  });

  describe("Running with errors", function () {
    it("should allow you to run an IC even if there are errors, resulting in noops for invalid lines", function () {
      let ic = new IC();

      ic.load([
        "move r0 99",
        "this is junk",
        "move r2 r0"
      ].join("\n"));

      ic.setIgnoreErrors(true);

      ic.step();
      ic.step();
      ic.step();

      var registers = ic.getInternalRegisters();
      expect(registers[2]).to.equal(99);
    });
  });

  describe("Devices can be marked as connected or disconnected", function () {
    it("should allow you to make a device as connected", function () {
      let ic = new IC();

      expect(ic.getIOConnected()[0]).to.equal(true);
      ic.setIOConnected(0, false);
      expect(ic.getIOConnected()[0]).to.equal(false);
      ic.setIOConnected(0, true);
      expect(ic.getIOConnected()[0]).to.equal(true);
    });

    it("should throw an error when trying to save to a disconnected device", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);

      ic.load("s d0 Setting 1.0");

      var result = ic.step();

      expect(result).to.equal("INTERACTION_WITH_DISCONNECTED_DEVICE");
    });

    it("should throw an error when trying to save to a disconnected device", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);

      ic.load("l r0 d0 Setting");

      var result = ic.step();

      expect(result).to.equal("INTERACTION_WITH_DISCONNECTED_DEVICE");
    });
  });

  describe("Devices can store and provide slot logic values", function () {
    it("should store and return a new slot logic value", function () {
      let ic = new IC();
      ic.setIOSlot(0, 1, "Setting", 100);

      var result = ic.getIOSlots();
      expect(result[0][1]["Setting"]).to.equal(100);
    });

    it("should store and return a two slot logic values", function () {
      let ic = new IC();
      ic.setIOSlot(0, 1, "Setting", 100);
      ic.setIOSlot(0, 1, "On", 50);

      var result = ic.getIOSlots();
      expect(result[0][1]["Setting"]).to.equal(100);
      expect(result[0][1]["On"]).to.equal(50);
    });

    it ("should remove any slot logic values set to undefined", function () {
      let ic = new IC();
      ic.setIOSlot(0, 1, "Setting", 100);
      ic.setIOSlot(0, 1, "Setting", undefined);

      var result = ic.getIOSlots();
      expect(result[0][1]).to.equal(undefined);
    });
  });

  describe("Devices can store and provide reagent mode values", function () {
    it("should store and return a new reagent mode value", function () {
      let ic = new IC();
      ic.setIOReagent(0, "Iron", "Quantity", 10);

      var result = ic.getIOReagents();
      expect(result[0]["Iron"]["Quantity"]).to.equal(10);
    });

    it ("should remove any reagent mode values set to undefined", function () {
      let ic = new IC();
      ic.setIOReagent(0, "Iron", "Quantity", 10);
      ic.setIOReagent(0, "Iron", "Quantity", undefined);

      var result = ic.getIOReagents();
      expect(result[0]["Iron"]).to.equal(undefined);
    });
  });

  describe("Programs can define constants which can be used throughout a program", function () {
    it("should create an entry in defines inside the IC and store provided value when run", function () {
      let ic = new IC();

      ic.load("define CONST 5");

      expect(Object.keys(ic._defines)).to.contains("CONST");

      ic.step();

      expect(ic._defines["CONST"]).to.equal(5);
    });

    it("should substitute the defined value when the define is used in a statement", function () {
      let ic = new IC();

      ic.load([
        "define CONST 5",
        "move r0 CONST"
      ].join("\n"));

      ic.step();      
      expect(ic.step()).to.equal("END_OF_PROGRAM");

      expect(ic.getInternalRegisters()[0]).to.equal(5);
    });
  });

  describe("Exporting instructions", function() {
    describe("ICs should be able to export which instructions they support and a category for that instruction.", function () {
      let ic = new IC();

      let instructions = ic.getInstructions();

      expect(instructions.jr.category).to.equal("flow");
      expect(instructions.jr.fields).to.deep.equal([["r", "i", "a"]]);
    });
  });

  describe("Exporting internal program structures and state", function () {
    describe("ICs should be able to export a list of aliases", function () {
      let ic = new IC();

      ic.load([
        "alias bob r0",
        "alias alice r0"
      ].join("\n"));

      expect(ic.getAliases()).to.deep.equal(["bob", "alice"]);
    });

    describe("ICs should be able to export a list of defined", function () {
      let ic = new IC();

      ic.load([
        "define bob 1",
        "define alice 2"
      ].join("\n"));

      expect(ic.getDefines()).to.deep.equal(["bob", "alice"]);
    });

    describe("ICs should be able to export a list of jump tags", function () {
      let ic = new IC();

      ic.load([
        "bob:",
        "alice:"
      ].join("\n"));

      expect(ic.getJumpTags()).to.deep.equal({ "bob": 0, "alice": 1 });
    });

    describe("ICs should be able to export a tokenised version of the program", function () {
      let ic = new IC();

      ic.load([
        "MOVE r0 1 # Comment",
        "",
        "alias:"
      ].join("\n"));

      let expected = [
        ["MOVE", "r0", "1"],
        [],
        ["alias:"]
      ];

      expect(ic.getTokenisedInstructions()).to.deep.equal(expected);
    });
  });
  
  describe("Programs can use the HASH preprocessor which can be used throughout a program", function () {
    it("should hash the value inside the IC and store provided value when run", function () {
      let ic = new IC();

      ic.load("define IRON HASH(\"ItemIronIngot\")");

      expect(Object.keys(ic._defines)).to.contains("IRON");

      ic.step();

      expect(ic._defines["IRON"]).to.equal(-1301215609);
    });

    it("should substitute the hashed value when the define is used in a statement", function () {
      let ic = new IC();

      ic.load([
        "define IRON HASH(\"ItemIronIngot\")",
        "move r0 IRON"
      ].join("\n"));

      ic.step();      
      expect(ic.step()).to.equal("END_OF_PROGRAM");

      expect(ic.getInternalRegisters()[0]).to.equal(-1301215609);
    });
  });
});
