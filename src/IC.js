"use strict";

const NEWLINE = "\n";
const INSTRUCTION_SEPERATOR = /\s+/;
const COMMENT_SEPERATOR = /\s*\/\//;

const INPUT_REGISTER_COUNT = 3;
const OUTPUT_REGISTER_COUNT = 1;
const INTERNAL_REGISTER_COUNT = 5;

const KNOWN_OPCODES = { 

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
    return this._instructions.map((line) => this._validateLine(line)).filter((validatedLine) => validatedLine);
  }

  _validateLine(line) {
    var tokens = this._parseLine(line);
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

    switch(type) {              
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

    switch(type) {              
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
