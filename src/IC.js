const BranchInstructions = require("./instructions/Branch");
const SelectInstructions = require("./instructions/Select");
const MathInstructions = require("./instructions/Math");
const LogicInstructions = require("./instructions/Logic");
const DeviceInstructions = require("./instructions/Device");
const StackInstructions = require("./instructions/Stack");
const MiscInstructions = require("./instructions/Misc");

"use strict";

const NEWLINE = "\n";
const INSTRUCTION_SEPERATOR = /\s+/;
const COMMENT_SEPERATOR = /\s*(\/\/|#)/;

const IO_REGISTER_COUNT = 6;
const INTERNAL_REGISTER_COUNT = 18;

const STACK_SIZE = 512;
const STACK_POINTER_REGISTER = 16;

const RETURN_ADDRESS_REGISTER = 17;

const INITIAL_ALIASES = ["db", "sp", "ra"];

module.exports = class IC {
  constructor() {
    this.STACK_SIZE = STACK_SIZE;
    this.STACK_POINTER_REGISTER = STACK_POINTER_REGISTER;

    this._opcodes = {};
    this._instructions = [];

    this._ignoreErrors = false;

    this._validProgram = true;
    this._programErrors = [];
    this._programErrorLines = [];

    this._programCounter = 0;

    this._aliases = {};
    this._aliasesAsigned = [];

    this._jumpTags = {};

    this._ioRegister = [];
    this._ioSlot = [];
    this._ioReagent = [];
    this._ioRegisterConnected = [];

    for (let i = 0; i <= IO_REGISTER_COUNT; i++) {
      this._ioRegister[i] = {};
      this._ioSlot[i] = {};
      this._ioReagent[i] = {};
      this._ioRegisterConnected[i] = true;
    }

    this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);

    this._stack = Array(STACK_SIZE).fill(0);

    BranchInstructions(this);
    SelectInstructions(this);
    MathInstructions(this);
    LogicInstructions(this);
    DeviceInstructions(this);
    StackInstructions(this);
    MiscInstructions(this);

    this._registerOpcode("alias", [["s"], ["r", "d", "a"]], this._instruction_alias);

    this._instruction_alias(["db", "d" + IO_REGISTER_COUNT]);
    this._instruction_alias(["sp", "r" + STACK_POINTER_REGISTER]);
    this._instruction_alias(["ra", "r" + RETURN_ADDRESS_REGISTER]);
  }

  _instruction_alias(fields) {
    let matches = fields[1].match(/^([dr])(\d+)$/);
  
    if (matches) {
      let number = Number.parseInt(matches[2]);
      this._aliases[fields[0]] = { value: number, type: matches[1] };
      this._aliasesAsigned.push(fields[0]);
    } else {
      let foundAlias = this._aliases[fields[1]];
      
      if (foundAlias) {
        this._aliases[fields[0]] = { value: foundAlias.value, type: foundAlias.type };
        this._aliasesAsigned.push(fields[0]);
      }
    }
  }

  load(unparsedInstructions) {
    this._instructions = unparsedInstructions.split(NEWLINE);

    this._preProcess();
    this._validate();
  }

  _preProcess() {
    let parsedLines = this._instructions.map((content) => this._parseLine(content));
    let foundAliases = parsedLines.filter((tokens) => tokens.length >= 2 && tokens[0] === "alias").map((tokens) => tokens[1]).concat(INITIAL_ALIASES);
    let currentAliases = this._aliases;

    for (let alias of foundAliases) {
      if (!Object.keys(currentAliases).includes(alias)) {
        this._aliases[alias] = { value: 0 };
      }
    }

    let removedAliases = Object.keys(currentAliases).filter((currentAlias) => !foundAliases.includes(currentAlias));

    for (let toBeRemoved of removedAliases) {
      delete this._aliases[toBeRemoved];

      let foundIndex = this._aliasesAsigned.indexOf(toBeRemoved);
      delete this._aliasesAsigned[foundIndex];
    }

    this._jumpTags = {};

    parsedLines.forEach((content, line) => {
      if (content.length > 0) {
        let matches = content[0].match(/(\S+):/);
        if (matches && !Object.keys(this._jumpTags).includes(matches[1])) {
          this._jumpTags[matches[1]] = line;
        }
      }
    });
  }

  _validate() {
    this._programErrors = [].concat.apply([], (this._instructions.map((content, line) => this._validateLine(content, line)).filter((validatedLine) => validatedLine)));

    let errors = this._programErrors.filter((e) => e["type"] === "error");
    this._validProgram = errors.length == 0;

    this._programErrorLines = errors.map((e) => e["line"]);
  }

  _validateLine(content, line) {
    let errors = [];

    if (content.length > 52) {
      errors.push({ line: line, error: "LINE_TOO_LONG", "type": "warning" });
    }

    if (line >= 128) {
      errors.push({ line: line, error: "PROGRAM_TOO_LONG", "type": "warning" });
    }

    let tokens = this._parseLine(content);

    if (tokens.length < 1) {
      return errors;
    }

    let jumpTagMatch = content.match(/^(\S+):/);

    if (jumpTagMatch) {
      if (this._jumpTags[jumpTagMatch[1]] !== line) {
        errors.push({ line: line, error: "INVALID_JUMP_TAG_DUPLICATE", "type": "error" });
      }

      if (tokens.length > 1) {
        errors.push({ line: line, error: "INVALID_JUMP_TAG_CONTENT_AFTER", "type": "error" });
      }

      return errors;
    }

    let opcode = tokens.shift();

    if (!Object.keys(this._opcodes).includes(opcode)) {
      errors.push({ line: line, error: "UNKNOWN_INSTRUCTION", "type": "error" });
      return errors;
    }

    let opcodeFields = this._opcodes[opcode].fields;

    let fieldErrors = opcodeFields.map((type, i) => {
      if (tokens.length < (i + 1)) {
        return { line: line, error: "MISSING_FIELD", field: i, "type": "error" };
      }

      let typeCheck = this._checkFieldTypes(tokens[i], type);

      if (typeCheck) {
        return { line: line, error: typeCheck, validTypes: type, field: i, "type": "error" };
      }
    }).filter((error) => error);

    if (tokens.length > opcodeFields.length) {
      for (let i = opcodeFields.length; i < tokens.length; i++) {
        fieldErrors.push({ line: line, error: "EXTRA_FIELD", field: i, "type": "error" });
      }
    }

    return errors.concat(fieldErrors);
  }

  _checkFieldTypes(token, fieldTypes) {
    // Jump Label
    if (fieldTypes.includes("j")) {
      if (Object.keys(this._jumpTags).includes(token)) {
        return undefined;
      }
    }

    // Alias
    if (fieldTypes.includes("a")) {
      if (Object.keys(this._aliases).includes(token)) {
        return undefined;
      }
    }

    // Register
    if (fieldTypes.includes("r")) {
      let registerMatches = token.match(/^r+(\d+)$/);

      if (registerMatches) {
        let registerNumber = Number.parseInt(registerMatches[1]);

        if (registerNumber >= INTERNAL_REGISTER_COUNT) {
          return "INVALID_FIELD_NO_SUCH_REGISTER";
        }

        return undefined;
      }
    }

    // Device
    if (fieldTypes.includes("d")) {
      let deviceMatches = token.match(/^d(r*)(\d)+$/);

      if (deviceMatches) {
        let maxRegister = deviceMatches[1].length > 0 ? INTERNAL_REGISTER_COUNT : IO_REGISTER_COUNT;
        let actualRegister = Number.parseInt(deviceMatches[2]);

        if (actualRegister >= maxRegister) {
          return "INVALID_FIELD_NO_SUCH_REGISTER";
        }

        return undefined;
      }
    }

    // Number Handling
    let asNumber = Number.parseFloat(token);

    if (!Number.isNaN(asNumber)) {
      // Float
      if (fieldTypes.includes("f")) {
        return undefined;
      }

      // Integer
      if (fieldTypes.includes("i")) {
        if (asNumber === Number.parseInt(token)) {
          return undefined;
        }
      }
    }

    // String
    if (fieldTypes.includes("s")) {
      return undefined;
    }

    return "INVALID_FIELD_INVALID_TYPE";
  }

  _parseLine(line) {
    let withoutComment = line.split(COMMENT_SEPERATOR)[0];
    return withoutComment.split(INSTRUCTION_SEPERATOR).filter((token) => token.trim());
  }

  setIgnoreErrors(value) {
    this._ignoreErrors = value;
  }

  getProgramErrors() {
    return this._programErrors;
  }

  getInstructionCount() {
    return this._instructions.length;
  }

  getIONames() {
    let names = [];

    for (let i = 0; i < IO_REGISTER_COUNT; i++) {
      names.push(["d"] + i);
    }

    names.push("db");

    return names;
  }

  getIOLabels() {
    let labels = Array(IO_REGISTER_COUNT + 1);

    for (let i = 0; i <= IO_REGISTER_COUNT; i++) {
      labels[i] = [];
    }

    let aliases = Object.keys(this._aliases);

    for (let alias of aliases) {
      if (this._aliasesAsigned.includes(alias) && this._aliases[alias]["type"] === "d") {
        labels[this._aliases[alias]["value"]].push(alias);
      }
    }

    for (let i = 0; i <= IO_REGISTER_COUNT; i++) {
      labels[i] = labels[i].join(",");
    }

    return labels;
  }

  getIOConnected() {
    return this._ioRegisterConnected;
  }

  setIOConnected(index, value) {
    this._ioRegisterConnected[index] = value;
  }

  getIORegisters() {
    return this._ioRegister;
  }

  setIORegister(index, field, value) {
    if (index <= IO_REGISTER_COUNT) {
      if (value !== undefined) {
        this._ioRegister[index][field] = value;
      } else {
        delete this._ioRegister[index][field];
      }
    }
  }

  getIOSlots() {
    return this._ioSlot;
  }

  setIOSlot(index, slot, logicType, value) {
    if (index <= IO_REGISTER_COUNT) {
      if (value !== undefined) {
        if (!Object.keys(this._ioSlot[index]).includes(slot.toString())) {
          this._ioSlot[index][slot] = {};
        }

        this._ioSlot[index][slot][logicType] = value;
      } else {
        delete this._ioSlot[index][slot][logicType];

        if (Object.keys(this._ioSlot[index][slot]).length === 0) {
          delete this._ioSlot[index][slot];
        }
      }
    }
  }

  getIOReagents() {
    return this._ioReagent;
  }

  setIOReagent(index, reagent, logicReagentMode, value) {
    if (index <= IO_REGISTER_COUNT) {
      if (value !== undefined) {
        if (!Object.keys(this._ioReagent[index]).includes(reagent)) {
          this._ioReagent[index][reagent] = {};
        }

        this._ioReagent[index][reagent][logicReagentMode] = value;
      } else {
        delete this._ioReagent[index][reagent][logicReagentMode];

        if (Object.keys(this._ioReagent[index][reagent]).length === 0) {
          delete this._ioReagent[index][reagent];
        }
      }
    }    
  }

  getStack() {
    return this._stack;
  }

  getInternalRegisters() {
    return this._internalRegister;
  }

  getInternalLabels() {
    let labels = Array(INTERNAL_REGISTER_COUNT);

    for (let i = 0; i < INTERNAL_REGISTER_COUNT; i++) {
      labels[i] = [];
    }

    let aliases = Object.keys(this._aliases);

    for (let alias of aliases) {
      if (this._aliasesAsigned.includes(alias) && this._aliases[alias]["type"] === "r") {
        labels[this._aliases[alias]["value"]].push(alias);
      }
    }

    for (let i = 0; i < INTERNAL_REGISTER_COUNT; i++) {
      labels[i] = labels[i].join(",");
    }

    return labels;
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

  _resolveDeviceNumber(register, allowedTypes) {
    if (allowedTypes.includes("a")) {
      let foundAlias = this._aliases[register];

      if (foundAlias) {
        if (!allowedTypes.includes(foundAlias.type)) {
          throw "ALIAS_TYPE_MISMATCH";
        } else {
          register = foundAlias.type + foundAlias.value;
        }
      }
    }

    if (register.charAt(0) === "d") {
      let number = 0;
      let match = register.match(/d(r*)(\d+)/);

      if (match) {
        if (match[1].length > 0) {
          number = this._getRegister(match[1] + match[2], undefined, ["r"]);
        } else {
          number = Number.parseInt(match[2]);
        }
      }

      if (number > IO_REGISTER_COUNT) {
        throw "INVALID_REGISTER_LOCATION";      
      } 
      
      return number;
    }

    throw undefined;      
  }

  _isDeviceConnected(register, allowedTypes) {
    let deviceNumber = this._resolveDeviceNumber(register, allowedTypes);

    if (deviceNumber === undefined) {
      return false;
    } else {
      return this._ioRegisterConnected[deviceNumber];
    }
  }

  _setRegister(register, value, field, allowedTypes) {
    if (allowedTypes.includes("a")) {
      let foundAlias = this._aliases[register];

      if (foundAlias) {
        if (!allowedTypes.includes(foundAlias.type)) {
          throw "ALIAS_TYPE_MISMATCH";
        } else {
          register = foundAlias.type + foundAlias.value;
        }
      }
    }

    let type = register.charAt(0);
    let number;
    let match;

    switch (type) {
    case "d":
      match = register.match(/d(r*)(\d+)/);

      if (match) {
        if (match[1].length > 0) {
          number = this._getRegister(match[1] + match[2], undefined, ["r"]);
        } else {
          number = Number.parseInt(match[2]);
        }
      }

      if (number > IO_REGISTER_COUNT) {
        throw "INVALID_REGISTER_LOCATION";
      }

      if (!this._ioRegisterConnected[number]) {
        throw "INTERACTION_WITH_DISCONNECTED_DEVICE";
      }

      return this.setIORegister(number, field, value);
    case "r":
      number = this._resolveIndirectRegister(register);

      if (number !== null) {
        return this.setInternalRegister(number, value);
      }
    }
  }

  _getRegister(register, field, allowedTypes) {
    if (allowedTypes.includes("a")) {
      let foundAlias = this._aliases[register];

      if (foundAlias) {
        if (!allowedTypes.includes(foundAlias.type)) {
          throw "ALIAS_TYPE_MISMATCH";
        } else {
          register = foundAlias.type + foundAlias.value;
        }
      }
    }

    let type = register.charAt(0);
    let number;
    let match;

    switch (type) {
    case "d":
      match = register.match(/d(r*)(\d+)/);

      if (match) {
        if (match[1].length > 0) {
          number = this._getRegister(match[1] + match[2], undefined, ["r"]);
        } else {
          number = Number.parseInt(match[2]);
        }
      }

      if (number > IO_REGISTER_COUNT) {
        throw "INVALID_REGISTER_LOCATION";
      }

      if (!this._ioRegisterConnected[number]) {
        throw "INTERACTION_WITH_DISCONNECTED_DEVICE";
      }

      if (!this.getIORegisters()[number][field]) {
        this.setIORegister(number, field, 0);
      }

      return this.getIORegisters()[number][field];

    case "r":
      number = this._resolveIndirectRegister(register);

      if (number !== null) {
        return this.getInternalRegisters()[number];
      }
    }

    let value = Number.parseFloat(register);

    if (Number.isNaN(value)) {
      if (allowedTypes && Object.keys(this._jumpTags).includes(register)) {
        return this._jumpTags[register];
      }

      return;
    } else {
      return value;
    }
  }

  _resolveIndirectRegister(register) {
    let matched = register.match(/(r+)(\d+)/);

    if (matched === null) {
      return null;
    }

    let registerIndirectionCount = matched[1].length - 1;
    let number = Number.parseInt(matched[2]);

    for (let i = 0; i < registerIndirectionCount; i++) {
      number = this.getInternalRegisters()[number];

      if (number >= INTERNAL_REGISTER_COUNT) {
        throw "INVALID_REGISTER_LOCATION";
      }
    }

    return number;
  }

  step() {
    if (this._validProgram || this._ignoreErrors) {
      let instruction = this._instructions[this._programCounter];
      let isErrorLine = this._programErrorLines.includes(this._programCounter);

      this._programCounter++;

      if (!isErrorLine) {
        try {
          this._executeInstruction(instruction);
        } catch (err) {
          return err;
        }
      }

      if (this._programCounter >= this.getInstructionCount()) {
        return "END_OF_PROGRAM";
      } else if (this._programCounter < 0) {
        return "INVALID_PROGRAM_COUNTER";
      }
    } else {
      return "INVALID_PROGRAM";
    }
  }

  restart() {
    this._programCounter = 0;
    this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);
    this._stack = Array(STACK_SIZE).fill(0);
  }

  _executeInstruction(instruction) {
    let fields = this._parseLine(instruction);
    let opcode = fields.shift();

    let opcodeData = this._opcodes[opcode];

    if (opcodeData) {
      opcodeData.func(fields, opcodeData.fields, this);
    }

    return opcode;
  }

  _registerOpcode(name, fields, func) {
    func = func.bind(this);
    this._opcodes[name] = { fields, func };
  }

  _jumper(condition, destination, relative, and_link) {
    if (condition) {
      if (and_link) {
        this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
      }

      if (relative) {
        // -1 is required becaused we increment the the PC before we execute the instruction.
        this._programCounter += Math.round(destination) - 1;
      } else {
        this._programCounter = Math.round(destination);
      }      
    }
  }
};
