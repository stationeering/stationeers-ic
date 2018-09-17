"use strict";

const NEWLINE = "\n";
const INSTRUCTION_SEPERATOR = /\s+/;
const COMMENT_SEPERATOR = /\s*(\/\/|#)/;

const IO_REGISTER_COUNT = 6;
const INTERNAL_REGISTER_COUNT = 16;

module.exports = class IC {
  constructor() {
    this._opcodes = {};
    this._instructions = [];

    this._ignoreErrors = false;
    
    this._validProgram = true;    
    this._programErrors = [];
    this._programErrorLines = [];

    this._programCounter = 0;

    this._aliases = {};
    this._aliasesAsigned = [];
    this._ioRegister = [];
    this._jumpTags = {};
    this._ioLabels = Array(IO_REGISTER_COUNT).fill("");
    this._ioLabels[IO_REGISTER_COUNT] = "IC Socket";

    for (var i = 0; i < IO_REGISTER_COUNT + 1; i++) {
      this._ioRegister[i] = {};
    }

    this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);

    this._registerOpcode("move", ["d", "s"], this._instruction_move);
    this._registerOpcode("add", ["d", "s", "s"], this._instruction_add);
    this._registerOpcode("sub", ["d", "s", "s"], this._instruction_sub);
    this._registerOpcode("mul", ["d", "s", "s"], this._instruction_mul);
    this._registerOpcode("div", ["d", "s", "s"], this._instruction_div);
    this._registerOpcode("mod", ["d", "s", "s"], this._instruction_mod);
    this._registerOpcode("slt", ["d", "s", "s"], this._instruction_slt);
    this._registerOpcode("sqrt", ["d", "s"], this._instruction_sqrt);
    this._registerOpcode("round", ["d", "s"], this._instruction_round);
    this._registerOpcode("trunc", ["d", "s"], this._instruction_trunc);
    this._registerOpcode("ceil", ["d", "s"], this._instruction_ceil);
    this._registerOpcode("floor", ["d", "s"], this._instruction_floor);
    this._registerOpcode("max", ["d", "s", "s"], this._instruction_max);
    this._registerOpcode("min", ["d", "s", "s"], this._instruction_min);
    this._registerOpcode("abs", ["d", "s"], this._instruction_abs);
    this._registerOpcode("log", ["d", "s"], this._instruction_log);
    this._registerOpcode("exp", ["d", "s"], this._instruction_exp);
    this._registerOpcode("rand", ["d"], this._instruction_rand);
    this._registerOpcode("and", ["d", "s", "s"], this._instruction_and);
    this._registerOpcode("or", ["d", "s", "s"], this._instruction_or);
    this._registerOpcode("xor", ["d", "s", "s"], this._instruction_xor);
    this._registerOpcode("nor", ["d", "s", "s"], this._instruction_nor);

    this._registerOpcode("yield", [], this._instruction_yield);

    this._registerOpcode("j", ["S"], this._instruction_j);
    this._registerOpcode("bltz", ["s", "S"], this._instruction_bltz);
    this._registerOpcode("blez", ["s", "S"], this._instruction_blez);
    this._registerOpcode("bgez", ["s", "S"], this._instruction_bgez);
    this._registerOpcode("bgtz", ["s", "S"], this._instruction_bgtz);
    this._registerOpcode("beq", ["s", "s", "S"], this._instruction_beq);
    this._registerOpcode("bne", ["s", "s", "S"], this._instruction_bne);

    this._registerOpcode("jr", ["s"], this._instruction_jr);
    this._registerOpcode("brltz", ["s", "s"], this._instruction_brltz);
    this._registerOpcode("brlez", ["s", "s"], this._instruction_brlez);
    this._registerOpcode("brgez", ["s", "s"], this._instruction_brgez);
    this._registerOpcode("brgtz", ["s", "s"], this._instruction_brgtz);
    this._registerOpcode("breq", ["s", "s", "s"], this._instruction_breq);
    this._registerOpcode("brne", ["s", "s", "s"], this._instruction_brne);

    this._registerOpcode("l", ["d", "i", "f"], this._instruction_l);
    this._registerOpcode("s", ["i", "f", "s"], this._instruction_s);

    this._registerOpcode("alias", ["f", "d"], this._instruction_alias);

    this._registerOpcode("label", ["i", "f"], this._instruction_label);
  }

  load(unparsedInstructions) {
    this._instructions = unparsedInstructions.split(NEWLINE);

    this._preProcess();
    this._validate();
  }

  _preProcess() {    
    var parsedLines = this._instructions.map((content) => this._parseLine(content));
    var foundAliases = parsedLines.filter((tokens) => tokens.length >= 2 && tokens[0] === "alias").map((tokens) => tokens[1]);
    var currentAliases = this._aliases;

    for (var alias of foundAliases) {
      if (!Object.keys(currentAliases).includes(alias)) {
        this._aliases[alias] = 0;
      }
    }

    var removedAliases = Object.keys(currentAliases).filter((currentAlias) => !foundAliases.includes(currentAlias));

    for (var toBeRemoved of removedAliases) {
      delete this._aliases[toBeRemoved];
      
      var foundIndex = this._aliasesAsigned.indexOf(toBeRemoved);
      delete this._aliasesAsigned[foundIndex];
    }

    this._jumpTags = {};

    parsedLines.forEach((content, line) => {
      if (content.length > 0) {
        var matches = content[0].match(/(\S+):/);
        if (matches && !Object.keys(this._jumpTags).includes(matches[1])) {
          this._jumpTags[matches[1]] = line;
        }
      }
    });
  }

  _validate() {
    this._programErrors = [].concat.apply([], (this._instructions.map((content, line) => this._validateLine(content, line)).filter((validatedLine) => validatedLine)));

    var errors = this._programErrors.filter((e) => e["type"] === "error");
    this._validProgram = errors.length == 0;

    this._programErrorLines = errors.map((e) => e["line"]);
  }

  _validateLine(content, line) {
    var errors = [];

    if (content.length > 52) {
      errors.push({ line: line, error: "LINE_TOO_LONG", "type": "warning" });
    }

    if (line >= 128) {
      errors.push({ line: line, error: "PROGRAM_TOO_LONG", "type": "warning" });
    }

    var tokens = this._parseLine(content);

    if (tokens.length < 1) {
      return errors;
    }

    var jumpTagMatch = content.match(/^(\S+):/);

    if (jumpTagMatch) {
      if (this._jumpTags[jumpTagMatch[1]] !== line) {
        errors.push({ line: line, error: "INVALID_JUMP_TAG_DUPLICATE", "type": "error" });
      }

      if (tokens.length > 1) {
        errors.push({ line: line, error: "INVALID_JUMP_TAG_CONTENT_AFTER", "type": "error" });
      }          

      return errors;
    }

    var opcode = tokens.shift();

    if (!Object.keys(this._opcodes).includes(opcode)) {
      errors.push({ line: line, error: "UNKNOWN_INSTRUCTION", "type": "error" });
      return errors;
    }

    var opcodeFields = this._opcodes[opcode].fields;

    var fieldErrors = opcodeFields.map((type, i) => {
      if (tokens.length < (i + 1)) {
        return { line: line, error: "MISSING_FIELD", field: i, "type": "error" };
      }

      var typeCheck = this._checkFieldTypes(tokens[i], type);

      if (typeCheck) {
        return { line: line, error: typeCheck, field: i, "type": "error" };
      }

      if (!this._checkRegisterRange(tokens[i]) && type !== "f") {
        return { line: line, error: "INVALID_FIELD_NO_SUCH_REGISTER", field: i, "type": "error" };
      }
    }).filter((error) => error);

    if (tokens.length > opcodeFields.length) {
      for (var i = opcodeFields.length; i < tokens.length; i++) {
        fieldErrors.push({ line: line, error: "EXTRA_FIELD", field: i, "type": "error" });
      }
    }

    return errors.concat(fieldErrors);
  }

  _checkFieldTypes(token, fieldType) {
    var tokenType = token.charAt(0);
    var allowJump = (fieldType === "S");

    if (allowJump) {
      fieldType = "s";
    }

    if (fieldType === "f") {
      return undefined;
    }

    if (tokenType !== "d" && tokenType !== "r") {
      var asFloat = Number.parseFloat(token);

      if (isNaN(asFloat)) {
        if (Object.keys(this._aliases).includes(token) || (allowJump && Object.keys(this._jumpTags).includes(token))) {
          tokenType = "r";
        } else {
          return "INVALID_FIELD_UNKNOWN_TYPE";
        }
      } else {
        tokenType = "f";
      }
    }

    switch (fieldType) {
    case "d":
      return (tokenType === "r") ? undefined : "INVALID_FIELD_NOT_REGISTER";    
    case "s":
      return (tokenType === "r" || tokenType === "f") ? undefined : "INVALID_FIELD_NOT_READABLE";
    case "i":
      return (tokenType === "d") ? undefined : "INVALID_FIELD_NOT_DEVICE";
    }
  }

  _checkRegisterRange(token) {
    var starting = token.charAt(0);
    var number;

    switch (starting) {
    case "d":
      var maxCount = IO_REGISTER_COUNT;

      if (token.charAt(1) === "b") {
        number = IO_REGISTER_COUNT;
      } else {
        var matches = token.match(/d(r*)(\d+)/);

        if (matches) {
          if (matches[1].length > 0) {
            maxCount = INTERNAL_REGISTER_COUNT - 1;
          }

          number = Number.parseInt(matches[2]);
        } 
      }

      return number <= maxCount;
    case "r":
      number = token.match(/r+(\d+)/);

      if (number) {
        return number[1] < INTERNAL_REGISTER_COUNT;
      } else {
        return Object.keys(this._aliases).includes(token);
      }
    default:
      return true;
    }
  }

  _parseLine(line) {
    var withoutComment = line.split(COMMENT_SEPERATOR)[0];
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

  getIORegisters() {
    return this._ioRegister;
  }

  getIONames() {
    var names = [];

    for (var i = 0; i < IO_REGISTER_COUNT; i++) {
      names.push("d" + i);
    }

    names.push("db");

    return names;
  }

  getIOLabels() {
    return this._ioLabels;
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

  getInternalRegisters() {
    return this._internalRegister;
  }

  getInternalLabels() {
    var labels = Array(INTERNAL_REGISTER_COUNT);
    
    for (var i = 0; i < INTERNAL_REGISTER_COUNT; i++) {
      labels[i] = [];
    }

    var aliases = Object.keys(this._aliases);

    for (var alias of aliases) {
      if (this._aliasesAsigned.includes(alias)) {
        labels[this._aliases[alias]].push(alias);
      }
    }

    for (i = 0; i < INTERNAL_REGISTER_COUNT; i++) {
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

  _setRegister(register, value, field) {
    let type = register.charAt(0);
    var number;

    switch (type) {
    case "d":
      if (register.charAt(1) === "b") {
        number = IO_REGISTER_COUNT;
      } else {
        var match = register.match(/d(r*)(\d+)/);

        if (match) {
          if (match[1].length > 0) {
            number = this._getRegister(match[1]+match[2]);
          } else {
            number = Number.parseInt(match[2]);
          }
        } 
        
        if (number >= IO_REGISTER_COUNT) {
          throw "illegal_register_location";
        }
      }

      return this.setIORegister(number, field, value);
    case "r":
      number = this._resolveIndirectRegister(register);

      if (number !== null) {
        return this.setInternalRegister(number, value);
      }
    }

    if (Object.keys(this._aliases).includes(register)) {
      return this._setRegister("r" + this._aliases[register], value, field);
    }
  }

  _getRegister(register, field, includeJumpTags) {
    let type = register.charAt(0);
    var number;

    switch (type) {
    case "d":
      if (register.charAt(1) === "b") {
        number = IO_REGISTER_COUNT;
      } else {
        var match = register.match(/d(r*)(\d+)/);

        if (match) {
          if (match[1].length > 0) {
            number = this._getRegister(match[1]+match[2]);
          } else {
            number = Number.parseInt(match[2]);
          }
        } 

        if (number >= IO_REGISTER_COUNT) {
          throw "illegal_register_location";
        }
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

    var value = Number.parseFloat(register);

    if (Number.isNaN(value)) {
      if (includeJumpTags && Object.keys(this._jumpTags).includes(register)) {
        return this._jumpTags[register];
      }

      if (Object.keys(this._aliases).includes(register)) {
        return this._getRegister("r" + this._aliases[register], field);
      }
      return;
    } else {
      return value;
    }
  }

  _resolveIndirectRegister(register) {
    var matched = register.match(/(r+)(\d+)/);
    
    if (matched === null) {
      return null;
    }

    var registerIndirectionCount = matched[1].length - 1;
    var number = Number.parseInt(matched[2]);

    for (var i = 0; i < registerIndirectionCount; i++) {
      number = this.getInternalRegisters()[number];

      if (number >= INTERNAL_REGISTER_COUNT) {
        throw "illegal_register_location";
      }
    }

    return number;
  }

  step() {
    if (this._validProgram || this._ignoreErrors) {
      var instruction = this._instructions[this._programCounter];
      var isErrorLine = this._programErrorLines.includes(this._programCounter);

      this._programCounter++;

      var lastOpCode;

      try {
        if (!isErrorLine) {
          lastOpCode = this._executeInstruction(instruction);
        }
      } catch (err) {
        lastOpCode = err;
      }

      if (lastOpCode === "yield") {
        return "YIELD";
      } else if (lastOpCode === "illegal_register_location") {
        return "INVALID_REGISTER_LOCATION";
      } else if (this._programCounter >= this.getInstructionCount()) {
        return "END_OF_PROGRAM";
      } else if (this._programCounter < 0) {
        return "INVALID_PROGRAM_COUNTER";
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
    var addr = this._getRegister(fields[0], undefined, true);
    this._programCounter = Math.round(addr);
  }

  _instruction_bltz(fields) {
    if (this._getRegister(fields[0]) < 0) {
      var addr = this._getRegister(fields[1], undefined, true);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_blez(fields) {
    if (this._getRegister(fields[0]) <= 0) {
      var addr = this._getRegister(fields[1], undefined, true);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_bgez(fields) {
    if (this._getRegister(fields[0]) >= 0) {
      var addr = this._getRegister(fields[1], undefined, true);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_bgtz(fields) {
    if (this._getRegister(fields[0]) > 0) {
      var addr = this._getRegister(fields[1], undefined, true);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_beq(fields) {
    if (this._getRegister(fields[0]) === this._getRegister(fields[1])) {
      var addr = this._getRegister(fields[2], undefined, true);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_bne(fields) {
    if (this._getRegister(fields[0]) !== this._getRegister(fields[1])) {
      var addr = this._getRegister(fields[2], undefined, true);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_yield() {
  }

  _instruction_l(fields) {
    this._setRegister(fields[0], this._getRegister(fields[1], fields[2]));
  }

  _instruction_s(fields) {
    this._setRegister(fields[0], this._getRegister(fields[2]), fields[1]);
  }

  _instruction_jr(fields) {
    var addr = this._programCounter - 1 + this._getRegister(fields[0]);
    this._programCounter = Math.round(addr);
  }

  _instruction_brltz(fields) {
    if (this._getRegister(fields[0]) < 0) {
      var addr = this._programCounter - 1 + this._getRegister(fields[1]);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_brlez(fields) {
    if (this._getRegister(fields[0]) <= 0) {
      var addr = this._programCounter - 1 + this._getRegister(fields[1]);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_brgez(fields) {
    if (this._getRegister(fields[0]) >= 0) {
      var addr = this._programCounter - 1 + this._getRegister(fields[1]);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_brgtz(fields) {
    if (this._getRegister(fields[0]) > 0) {
      var addr = this._programCounter - 1 + this._getRegister(fields[1]);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_breq(fields) {
    if (this._getRegister(fields[0]) === this._getRegister(fields[1])) {
      var addr = this._programCounter - 1 + this._getRegister(fields[2]);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_brne(fields) {
    if (this._getRegister(fields[0]) !== this._getRegister(fields[1])) {
      var addr = this._programCounter - 1 + this._getRegister(fields[2]);
      this._programCounter = Math.round(addr);
    }
  }

  _instruction_alias(fields) {
    var number = Number.parseInt(fields[1].split("r")[1]);
    this._aliases[fields[0]] = number;
    this._aliasesAsigned.push(fields[0]);
  }

  _instruction_label(fields) {
    var number = Number.parseInt(fields[0].split("d")[1]);
    this._ioLabels[number] = fields[1];
  }
};
