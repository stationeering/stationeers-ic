"use strict";

const NEWLINE = "\n";
const INSTRUCTION_SEPERATOR = /\s+/;
const COMMENT_SEPERATOR = /\s*(\/\/|#)/;

const IO_REGISTER_COUNT = 6;
const INTERNAL_REGISTER_COUNT = 10;

module.exports = class IC {
  constructor() {
    this._opcodes = {};
    this._instructions = [];

    this._validProgram = true;
    this._programErrors = [];

    this._programCounter = 0;
    this._ioRegister = Array(IO_REGISTER_COUNT).fill(0);
    this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);

    this._inputRegistersWriteable = false;

    this._registerOpcode("move", ["d", "s"], this._instruction_move);
    this._registerOpcode("add", ["d", "s", "t"], this._instruction_add);
    this._registerOpcode("sub", ["d", "s", "t"], this._instruction_sub);
    this._registerOpcode("mul", ["d", "s", "t"], this._instruction_mul);
    this._registerOpcode("div", ["d", "s", "t"], this._instruction_div);
    this._registerOpcode("mod", ["d", "s", "t"], this._instruction_mod);
    this._registerOpcode("slt", ["d", "s", "t"], this._instruction_slt);
    this._registerOpcode("sqrt", ["d", "s"], this._instruction_sqrt);
    this._registerOpcode("round", ["d", "s"], this._instruction_round);
    this._registerOpcode("trunc", ["d", "s"], this._instruction_trunc);
    this._registerOpcode("ceil", ["d", "s"], this._instruction_ceil);
    this._registerOpcode("floor", ["d", "s"], this._instruction_floor);
    this._registerOpcode("max", ["d", "s", "t"], this._instruction_max);
    this._registerOpcode("min", ["d", "s", "t"], this._instruction_min);
    this._registerOpcode("abs", ["d", "s"], this._instruction_abs);
    this._registerOpcode("log", ["d", "s"], this._instruction_log);
    this._registerOpcode("exp", ["d", "s"], this._instruction_exp);
    this._registerOpcode("rand", ["d"], this._instruction_rand);
    this._registerOpcode("and", ["d", "s", "t"], this._instruction_and);
    this._registerOpcode("or", ["d", "s", "t"], this._instruction_or);
    this._registerOpcode("xor", ["d", "s", "t"], this._instruction_xor);
    this._registerOpcode("nor", ["d", "s", "t"], this._instruction_nor);
    this._registerOpcode("j", ["a"], this._instruction_j);
    this._registerOpcode("bltz", ["s", "a"], this._instruction_bltz);
    this._registerOpcode("blez", ["s", "a"], this._instruction_blez);
    this._registerOpcode("bgez", ["s", "a"], this._instruction_bgez);
    this._registerOpcode("bgtz", ["s", "a"], this._instruction_bgtz);
    this._registerOpcode("beq", ["s", "t", "a"], this._instruction_beq);
    this._registerOpcode("bne", ["s", "t", "a"], this._instruction_bne);
    this._registerOpcode("yield", [], this._instruction_yield);
  }

  load(unparsedInstructions) {
    this._instructions = unparsedInstructions.split(NEWLINE);
    this._validate();
  }

  _validate() {
    this._programErrors = [].concat.apply([], (this._instructions.map((content, line) => this._validateLine(content, line)).filter((validatedLine) => validatedLine)));
    this._validProgram = this._programErrors.length == 0;
  }

  _validateLine(content, line) {
    var tokens = this._parseLine(content);

    if (tokens.length < 1) {
      return [];
    }

    var opcode = tokens.shift();

    if (!Object.keys(this._opcodes).includes(opcode)) {
      return [{ line: line, error: "UNKNOWN_INSTRUCTION" }];
    }

    var opcodeFields = this._opcodes[opcode].fields;

    var fieldErrors = opcodeFields.map((type, i) => {
      if (tokens.length < (i + 1)) {
        return { line: line, error: "MISSING_FIELD", field: i };
      }

      var typeCheck = this._checkFieldTypes(tokens[i], type);

      if (typeCheck) {
        return { line: line, error: typeCheck, field: i };
      }

      if (!this._checkRegisterRange(tokens[i])) {
        return { line: line, error: "INVALID_FIELD_NO_SUCH_REGISTER", field: i };
      }
    }).filter((error) => error);

    if (tokens.length > opcodeFields.length) {
      for (var i = opcodeFields.length; i < tokens.length; i++) {
        fieldErrors.push({ line: line, error: "EXTRA_FIELD", field: i });
      }
    }

    return fieldErrors;
  }

  _checkFieldTypes(token, type) {
    var tokenType = token.charAt(0);

    if (tokenType !== "i" && tokenType !== "r") {
      var asFloat = Number.parseFloat(token);

      if (isNaN(asFloat)) {
        return "INVALID_FIELD_UNKNOWN_TYPE";
      }

      var isInteger = (Number.parseInt(token) === asFloat) && asFloat >= 0;

      tokenType = isInteger ? "a" : "f";
    }

    switch (type) {
    case "d":
      return (tokenType === "r" || (this._inputRegistersWriteable && tokenType === "i")) ? undefined : "INVALID_FIELD_READONLY";

    case "s":
      return (tokenType === "i" || tokenType === "r" || tokenType === "a" || tokenType === "f") ? undefined : "INVALID_FIELD_WRITEONLY";

    case "t":
      return (tokenType === "i" || tokenType === "r" || tokenType === "a" || tokenType === "f") ? undefined : "INVALID_FIELD_WRITEONLY";

    case "a":
      return (tokenType === "a") ? undefined : "INVALID_FIELD_NOT_ADDRESS";
    }
  }

  _checkRegisterRange(token) {
    var starting = token.charAt(0);
    let number = Number.parseInt(token.slice(1));

    switch (starting) {
    case "i":
      return number < IO_REGISTER_COUNT;
    case "r":
      return number < INTERNAL_REGISTER_COUNT;
    default:
      return true;
    }
  }

  _parseLine(line) {
    var withoutComment = line.split(COMMENT_SEPERATOR)[0];
    return withoutComment.split(INSTRUCTION_SEPERATOR).filter((token) => token.trim());
  }

  getProgramErrors() {
    return this._programErrors;
  }

  getInstructionCount() {
    return this._instructions.length;
  }

  getIORegisters() {
    return this._ioRegister;
  }

  setIORegister(index, value) {
    if (index < IO_REGISTER_COUNT) {
      this._ioRegister[index] = value;
    }
  }

  setInputRegistersWriteable(writeable) {
    this._inputRegistersWriteable = writeable;
    this._validate();
  }

  getInternalRegisters() {
    return this._internalRegister;
  }

  setInternalRegister(index, value) {
    if (index < INTERNAL_REGISTER_COUNT) {
      this._internalRegister[index] = value;
    }
  }

  programCounter() {
    return this._programCounter;
  }

  isValidProgram() {
    return this._validProgram;
  }

  _setRegister(field, value) {
    let type = field.charAt(0);
    let number = parseInt(field.slice(1));

    switch (type) {
    case "i":
      return this.setIORegister(number, value);
    case "r":
      return this.setInternalRegister(number, value);
    }
  }

  _getRegister(field) {
    let type = field.charAt(0);
    let number = parseInt(field.slice(1));

    switch (type) {
    case "i":
      return this.getIORegisters()[number];
    case "r":
      return this.getInternalRegisters()[number];
    default:
      var value = Number.parseFloat(field);

      if (Number.isNaN(value)) {
        return;
      } else {
        return value;
      }
    }
  }

  step() {
    if (this._validProgram) {
      var instruction = this._instructions[this._programCounter];
      this._programCounter++;

      var lastOpCode = this._executeInstruction(instruction);

      if (lastOpCode === "yield") {
        return "YIELD";
      } else if (this._programCounter >= this.getInstructionCount()) {
        return "END_OF_PROGRAM";
      } else {
        return undefined;
      }
    } else {
      return "INVALID_PROGRAM";
    }
  }

  restart() {
    this._programCounter = 0;
  }

  _executeInstruction(instruction) {
    var fields = this._parseLine(instruction);
    var opcode = fields.shift();

    var opcodeData = this._opcodes[opcode];

    if (opcodeData) {
      opcodeData.func(fields);
    }

    return opcode;
  }

  _registerOpcode(name, fields, func) {
    func = func.bind(this);
    this._opcodes[name] = { fields, func };
  }

  _instruction_move(fields) {
    let outputValue = this._getRegister(fields[1]);
    this._setRegister(fields[0], outputValue);
  }

  _instruction_add(fields) {
    let outputValue = this._getRegister(fields[1]) + this._getRegister(fields[2]);
    this._setRegister(fields[0], outputValue);
  }

  _instruction_sub(fields) {
    let outputValue = this._getRegister(fields[1]) - this._getRegister(fields[2]);
    this._setRegister(fields[0], outputValue);
  }

  _instruction_mul(fields) {
    let outputValue = this._getRegister(fields[1]) * this._getRegister(fields[2]);
    this._setRegister(fields[0], outputValue);
  }

  _instruction_div(fields) {
    let outputValue = this._getRegister(fields[1]) / this._getRegister(fields[2]);
    this._setRegister(fields[0], outputValue);
  }

  _instruction_mod(fields) {
    let outputValue = Math.abs(this._getRegister(fields[1]) % this._getRegister(fields[2]));
    this._setRegister(fields[0], outputValue);
  }

  _instruction_slt(fields) {
    let outputValue = this._getRegister(fields[1]) < this._getRegister(fields[2]) ? 1 : 0;
    this._setRegister(fields[0], outputValue);
  }

  _instruction_sqrt(fields) {
    this._setRegister(fields[0], Math.sqrt(this._getRegister(fields[1])));
  }

  _instruction_round(fields) {
    this._setRegister(fields[0], Math.round(this._getRegister(fields[1])));
  }

  _instruction_trunc(fields) {
    this._setRegister(fields[0], Math.trunc(this._getRegister(fields[1])));
  }

  _instruction_ceil(fields) {
    this._setRegister(fields[0], Math.ceil(this._getRegister(fields[1])));
  }

  _instruction_floor(fields) {
    this._setRegister(fields[0], Math.floor(this._getRegister(fields[1])));
  }

  _instruction_max(fields) {
    let outputValue = Math.max(this._getRegister(fields[1]), this._getRegister(fields[2]));
    this._setRegister(fields[0], outputValue);
  }

  _instruction_min(fields) {
    let outputValue = Math.min(this._getRegister(fields[1]), this._getRegister(fields[2]));
    this._setRegister(fields[0], outputValue);
  }

  _instruction_abs(fields) {
    this._setRegister(fields[0], Math.abs(this._getRegister(fields[1])));
  }

  _instruction_log(fields) {
    this._setRegister(fields[0], Math.log(this._getRegister(fields[1])));
  }

  _instruction_exp(fields) {
    this._setRegister(fields[0], Math.exp(this._getRegister(fields[1])));
  }

  _instruction_rand(fields) {
    this._setRegister(fields[0], Math.random());
  }

  _instruction_and(fields) {
    var valueOne = this._getRegister(fields[1]) > 0;
    var valueTwo = this._getRegister(fields[2]) > 0;
    var result = (valueOne && valueTwo ? 1 : 0);
    this._setRegister(fields[0], result);
  }

  _instruction_or(fields) {
    var valueOne = this._getRegister(fields[1]) > 0;
    var valueTwo = this._getRegister(fields[2]) > 0;
    var result = (valueOne || valueTwo ? 1 : 0);
    this._setRegister(fields[0], result);
  }

  _instruction_xor(fields) {
    var valueOne = this._getRegister(fields[1]) > 0;
    var valueTwo = this._getRegister(fields[2]) > 0;
    var result = (valueOne ^ valueTwo ? 1 : 0);
    this._setRegister(fields[0], result);
  }

  _instruction_nor(fields) {
    var valueOne = this._getRegister(fields[1]) > 0;
    var valueTwo = this._getRegister(fields[2]) > 0;
    var result = (!valueOne && !valueTwo) ? 1 : 0;
    this._setRegister(fields[0], result);
  }

  _instruction_j(fields) {
    var addr = this._getRegister(fields[0]);
    this._programCounter = Math.ceil(addr);
  }

  _instruction_bltz(fields) {
    if (this._getRegister(fields[0]) < 0) {
      var addr = this._getRegister(fields[1]);
      this._programCounter = Math.ceil(addr);
    }
  }

  _instruction_blez(fields) {
    if (this._getRegister(fields[0]) <= 0) {
      var addr = this._getRegister(fields[1]);
      this._programCounter = Math.ceil(addr);
    }
  }

  _instruction_bgez(fields) {
    if (this._getRegister(fields[0]) >= 0) {
      var addr = this._getRegister(fields[1]);
      this._programCounter = Math.ceil(addr);
    }
  }

  _instruction_bgtz(fields) {
    if (this._getRegister(fields[0]) > 0) {
      var addr = this._getRegister(fields[1]);
      this._programCounter = Math.ceil(addr);
    }
  }

  _instruction_beq(fields) {
    if (this._getRegister(fields[0]) === this._getRegister(fields[1])) {
      var addr = this._getRegister(fields[2]);
      this._programCounter = Math.ceil(addr);
    }
  }

  _instruction_bne(fields) {
    if (this._getRegister(fields[0]) !== this._getRegister(fields[1])) {
      var addr = this._getRegister(fields[2]);
      this._programCounter = Math.ceil(addr);
    }
  }

  _instruction_yield() {
  }
};
