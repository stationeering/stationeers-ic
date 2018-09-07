"use strict";

const NEWLINE = "\n";
const INSTRUCTION_SEPERATOR = /\s+/;
const COMMENT_SEPERATOR = /\s*\/\//;

const INPUT_REGISTER_COUNT = 3;
const OUTPUT_REGISTER_COUNT = 1;
const INTERNAL_REGISTER_COUNT = 5;

// - d is a register or output
// - s and t are registers, inputs, or floats
// - a is a non-negative integer value

const KNOWN_OPCODES = {
  move: { fields: ["d", "s"] },
  add: { fields: ["d", "s", "t"] },
  j: { fields: ["a"] },
  yield: { fields: [] }
};

module.exports = class IC {
  constructor() {
    this._instructions = [];
    this._programCounter = 0;
    this._inputRegister = Array(INPUT_REGISTER_COUNT).fill(0);
    this._outputRegister = Array(OUTPUT_REGISTER_COUNT).fill(0);
    this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);
  }

  load(unparsedInstructions) {
    this._instructions = unparsedInstructions.split(NEWLINE);
  }

  validate() {
    return this._instructions.map((content, line) => this._validateLine(content, line)).filter((validatedLine) => validatedLine);
  }

  _validateLine(content, line) {
    var tokens = this._parseLine(content);

    if (tokens.length < 1) {
      return [];
    }

    var opcode = tokens.shift();

    if (!Object.keys(KNOWN_OPCODES).includes(opcode)) {
      return [{ line: line, error: "UNKNOWN_INSTRUCTION" }];
    }

    var opcodeFields = KNOWN_OPCODES[opcode].fields;

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
        fieldErrors.push({line: line, error: "EXTRA_FIELD", field: i });
      }
    }

    return fieldErrors;
  }

  _checkFieldTypes(token, type) {
    var tokenType = token.charAt(0);

    if (tokenType !== "i" && tokenType !== "o" && tokenType !== "r") {
      var asFloat = Number.parseFloat(token);

      if (isNaN(asFloat)) {
        return "INVALID_FIELD_UNKNOWN_TYPE";
      }

      var isInteger = (Number.parseInt(token) === asFloat) && asFloat >= 0;

      tokenType = isInteger ? "a" : "f";
    }

    switch(type) {
      case "d":      
        return (tokenType === "o" || tokenType === "r") ? undefined : "INVALID_FIELD_READONLY";

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

    switch(starting) {
      case "i":
        return number < INPUT_REGISTER_COUNT;
      case "o":
        if (Number.isNaN(number)) {
          number = 0;
        }

        return number < OUTPUT_REGISTER_COUNT;
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

  getInstructionCount() {
    return this._instructions.length;
  }

  getInputRegisters() {
    return this._inputRegister;
  }

  setInputRegister(index, value) {
    if (index < INPUT_REGISTER_COUNT) {
      this._inputRegister[index] = value;
    }
  }

  getOutputRegisters() {
    return this._outputRegister;
  }

  setOutputRegister(index, value) {
    if (index < OUTPUT_REGISTER_COUNT) {
      this._outputRegister[index] = value;
    }
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

  _setRegister(field, value) {
    let type = field.charAt(0);
    let number = parseInt(field.slice(1));

    switch (type) {
      case "i":
        return this.setInputRegister(number, value);
      case "r":
        return this.setInternalRegister(number, value);
      case "o":
        return this.setOutputRegister(number, value);
    }
  }

  _getRegister(field) {
    let type = field.charAt(0);
    let number = parseInt(field.slice(1));

    switch (type) {
      case "i":
        return this.getInputRegisters()[number];
      case "r":
        return this.getInternalRegisters()[number];
      case "o":
        return this.getOutputRegisters()[number];
    }
  }

  step() {
    var instruction = this._instructions[this._programCounter];
    this._programCounter++;

    this._execute(instruction);

    return this._programCounter < this.getInstructionCount();
  }

  restart() {
    this._programCounter = 0;
  }

  _execute(instruction) {
  }
};
