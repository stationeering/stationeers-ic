"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NEWLINE = "\n";
var INSTRUCTION_SEPERATOR = /\s+/;
var COMMENT_SEPERATOR = /\s*(\/\/|#)/;

var IO_REGISTER_COUNT = 6;
var INTERNAL_REGISTER_COUNT = 16;

module.exports = function () {
  function IC() {
    _classCallCheck(this, IC);

    this._opcodes = {};
    this._instructions = [];

    this._validProgram = true;
    this._programErrors = [];

    this._programCounter = 0;

    this._ioRegister = [];

    for (var i = 0; i < IO_REGISTER_COUNT; i++) {
      this._ioRegister[i] = {};
    }

    this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);

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

    this._registerOpcode("l", ["d", "i", "f"], this._instruction_l);
    this._registerOpcode("s", ["i", "f", "s"], this._instruction_s);
  }

  _createClass(IC, [{
    key: "load",
    value: function load(unparsedInstructions) {
      this._instructions = unparsedInstructions.split(NEWLINE);
      this._validate();
    }
  }, {
    key: "_validate",
    value: function _validate() {
      var _this = this;

      this._programErrors = [].concat.apply([], this._instructions.map(function (content, line) {
        return _this._validateLine(content, line);
      }).filter(function (validatedLine) {
        return validatedLine;
      }));
      this._validProgram = this._programErrors.length == 0;
    }
  }, {
    key: "_validateLine",
    value: function _validateLine(content, line) {
      var _this2 = this;

      var tokens = this._parseLine(content);

      if (tokens.length < 1) {
        return [];
      }

      var opcode = tokens.shift();

      if (!Object.keys(this._opcodes).includes(opcode)) {
        return [{ line: line, error: "UNKNOWN_INSTRUCTION" }];
      }

      var opcodeFields = this._opcodes[opcode].fields;

      var fieldErrors = opcodeFields.map(function (type, i) {
        if (tokens.length < i + 1) {
          return { line: line, error: "MISSING_FIELD", field: i };
        }

        var typeCheck = _this2._checkFieldTypes(tokens[i], type);

        if (typeCheck) {
          return { line: line, error: typeCheck, field: i };
        }

        if (!_this2._checkRegisterRange(tokens[i])) {
          return { line: line, error: "INVALID_FIELD_NO_SUCH_REGISTER", field: i };
        }
      }).filter(function (error) {
        return error;
      });

      if (tokens.length > opcodeFields.length) {
        for (var i = opcodeFields.length; i < tokens.length; i++) {
          fieldErrors.push({ line: line, error: "EXTRA_FIELD", field: i });
        }
      }

      return fieldErrors;
    }
  }, {
    key: "_checkFieldTypes",
    value: function _checkFieldTypes(token, type) {
      var tokenType = token.charAt(0);

      if (tokenType !== "d" && tokenType !== "r" && type !== "f") {
        var asFloat = Number.parseFloat(token);

        if (isNaN(asFloat)) {
          return "INVALID_FIELD_UNKNOWN_TYPE";
        }

        var isInteger = Number.parseInt(token) === asFloat && asFloat >= 0;

        tokenType = isInteger ? "a" : "f";
      }

      switch (type) {
        case "d":
          return tokenType === "r" ? undefined : "INVALID_FIELD_READONLY";

        case "s":
        case "t":
          return tokenType === "r" || tokenType === "a" || tokenType === "f" ? undefined : "INVALID_FIELD_WRITEONLY";

        case "a":
          return tokenType === "a" ? undefined : "INVALID_FIELD_NOT_ADDRESS";
        case "f":
          return undefined;
      }
    }
  }, {
    key: "_checkRegisterRange",
    value: function _checkRegisterRange(token) {
      var starting = token.charAt(0);
      var number = Number.parseInt(token.slice(1));

      switch (starting) {
        case "d":
          return number < IO_REGISTER_COUNT;
        case "r":
          return number < INTERNAL_REGISTER_COUNT;
        default:
          return true;
      }
    }
  }, {
    key: "_parseLine",
    value: function _parseLine(line) {
      var withoutComment = line.split(COMMENT_SEPERATOR)[0];
      return withoutComment.split(INSTRUCTION_SEPERATOR).filter(function (token) {
        return token.trim();
      });
    }
  }, {
    key: "getProgramErrors",
    value: function getProgramErrors() {
      return this._programErrors;
    }
  }, {
    key: "getInstructionCount",
    value: function getInstructionCount() {
      return this._instructions.length;
    }
  }, {
    key: "getIORegisters",
    value: function getIORegisters() {
      return this._ioRegister;
    }
  }, {
    key: "setIORegister",
    value: function setIORegister(index, field, value) {
      if (index < IO_REGISTER_COUNT) {
        if (value !== undefined) {
          this._ioRegister[index][field] = value;
        } else {
          delete this._ioRegister[index][field];
        }
      }
    }
  }, {
    key: "getInternalRegisters",
    value: function getInternalRegisters() {
      return this._internalRegister;
    }
  }, {
    key: "setInternalRegister",
    value: function setInternalRegister(index, value) {
      if (index < INTERNAL_REGISTER_COUNT) {
        this._internalRegister[index] = value;
      }
    }
  }, {
    key: "programCounter",
    value: function programCounter() {
      return this._programCounter;
    }
  }, {
    key: "isValidProgram",
    value: function isValidProgram() {
      return this._validProgram;
    }
  }, {
    key: "_setRegister",
    value: function _setRegister(register, value, field) {
      var type = register.charAt(0);
      var number = parseInt(register.slice(1));

      switch (type) {
        case "d":
          return this.setIORegister(number, field, value);
        case "r":
          return this.setInternalRegister(number, value);
      }
    }
  }, {
    key: "_getRegister",
    value: function _getRegister(register, field) {
      var type = register.charAt(0);
      var number = parseInt(register.slice(1));

      switch (type) {
        case "d":
          if (!this.getIORegisters()[number][field]) {
            this.setIORegister(number, field, 0);
          }

          return this.getIORegisters()[number][field];
        case "r":
          return this.getInternalRegisters()[number];
        default:
          var value = Number.parseFloat(register);

          if (Number.isNaN(value)) {
            return;
          } else {
            return value;
          }
      }
    }
  }, {
    key: "step",
    value: function step() {
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
  }, {
    key: "restart",
    value: function restart() {
      this._programCounter = 0;
    }
  }, {
    key: "_executeInstruction",
    value: function _executeInstruction(instruction) {
      var fields = this._parseLine(instruction);
      var opcode = fields.shift();

      var opcodeData = this._opcodes[opcode];

      if (opcodeData) {
        opcodeData.func(fields);
      }

      return opcode;
    }
  }, {
    key: "_registerOpcode",
    value: function _registerOpcode(name, fields, func) {
      func = func.bind(this);
      this._opcodes[name] = { fields: fields, func: func };
    }
  }, {
    key: "_instruction_move",
    value: function _instruction_move(fields) {
      var outputValue = this._getRegister(fields[1]);
      this._setRegister(fields[0], outputValue);
    }
  }, {
    key: "_instruction_add",
    value: function _instruction_add(fields) {
      var outputValue = this._getRegister(fields[1]) + this._getRegister(fields[2]);
      this._setRegister(fields[0], outputValue);
    }
  }, {
    key: "_instruction_sub",
    value: function _instruction_sub(fields) {
      var outputValue = this._getRegister(fields[1]) - this._getRegister(fields[2]);
      this._setRegister(fields[0], outputValue);
    }
  }, {
    key: "_instruction_mul",
    value: function _instruction_mul(fields) {
      var outputValue = this._getRegister(fields[1]) * this._getRegister(fields[2]);
      this._setRegister(fields[0], outputValue);
    }
  }, {
    key: "_instruction_div",
    value: function _instruction_div(fields) {
      var outputValue = this._getRegister(fields[1]) / this._getRegister(fields[2]);
      this._setRegister(fields[0], outputValue);
    }
  }, {
    key: "_instruction_mod",
    value: function _instruction_mod(fields) {
      var outputValue = Math.abs(this._getRegister(fields[1]) % this._getRegister(fields[2]));
      this._setRegister(fields[0], outputValue);
    }
  }, {
    key: "_instruction_slt",
    value: function _instruction_slt(fields) {
      var outputValue = this._getRegister(fields[1]) < this._getRegister(fields[2]) ? 1 : 0;
      this._setRegister(fields[0], outputValue);
    }
  }, {
    key: "_instruction_sqrt",
    value: function _instruction_sqrt(fields) {
      this._setRegister(fields[0], Math.sqrt(this._getRegister(fields[1])));
    }
  }, {
    key: "_instruction_round",
    value: function _instruction_round(fields) {
      this._setRegister(fields[0], Math.round(this._getRegister(fields[1])));
    }
  }, {
    key: "_instruction_trunc",
    value: function _instruction_trunc(fields) {
      this._setRegister(fields[0], Math.trunc(this._getRegister(fields[1])));
    }
  }, {
    key: "_instruction_ceil",
    value: function _instruction_ceil(fields) {
      this._setRegister(fields[0], Math.ceil(this._getRegister(fields[1])));
    }
  }, {
    key: "_instruction_floor",
    value: function _instruction_floor(fields) {
      this._setRegister(fields[0], Math.floor(this._getRegister(fields[1])));
    }
  }, {
    key: "_instruction_max",
    value: function _instruction_max(fields) {
      var outputValue = Math.max(this._getRegister(fields[1]), this._getRegister(fields[2]));
      this._setRegister(fields[0], outputValue);
    }
  }, {
    key: "_instruction_min",
    value: function _instruction_min(fields) {
      var outputValue = Math.min(this._getRegister(fields[1]), this._getRegister(fields[2]));
      this._setRegister(fields[0], outputValue);
    }
  }, {
    key: "_instruction_abs",
    value: function _instruction_abs(fields) {
      this._setRegister(fields[0], Math.abs(this._getRegister(fields[1])));
    }
  }, {
    key: "_instruction_log",
    value: function _instruction_log(fields) {
      this._setRegister(fields[0], Math.log(this._getRegister(fields[1])));
    }
  }, {
    key: "_instruction_exp",
    value: function _instruction_exp(fields) {
      this._setRegister(fields[0], Math.exp(this._getRegister(fields[1])));
    }
  }, {
    key: "_instruction_rand",
    value: function _instruction_rand(fields) {
      this._setRegister(fields[0], Math.random());
    }
  }, {
    key: "_instruction_and",
    value: function _instruction_and(fields) {
      var valueOne = this._getRegister(fields[1]) > 0;
      var valueTwo = this._getRegister(fields[2]) > 0;
      var result = valueOne && valueTwo ? 1 : 0;
      this._setRegister(fields[0], result);
    }
  }, {
    key: "_instruction_or",
    value: function _instruction_or(fields) {
      var valueOne = this._getRegister(fields[1]) > 0;
      var valueTwo = this._getRegister(fields[2]) > 0;
      var result = valueOne || valueTwo ? 1 : 0;
      this._setRegister(fields[0], result);
    }
  }, {
    key: "_instruction_xor",
    value: function _instruction_xor(fields) {
      var valueOne = this._getRegister(fields[1]) > 0;
      var valueTwo = this._getRegister(fields[2]) > 0;
      var result = valueOne ^ valueTwo ? 1 : 0;
      this._setRegister(fields[0], result);
    }
  }, {
    key: "_instruction_nor",
    value: function _instruction_nor(fields) {
      var valueOne = this._getRegister(fields[1]) > 0;
      var valueTwo = this._getRegister(fields[2]) > 0;
      var result = !valueOne && !valueTwo ? 1 : 0;
      this._setRegister(fields[0], result);
    }
  }, {
    key: "_instruction_j",
    value: function _instruction_j(fields) {
      var addr = this._getRegister(fields[0]);
      this._programCounter = Math.ceil(addr);
    }
  }, {
    key: "_instruction_bltz",
    value: function _instruction_bltz(fields) {
      if (this._getRegister(fields[0]) < 0) {
        var addr = this._getRegister(fields[1]);
        this._programCounter = Math.ceil(addr);
      }
    }
  }, {
    key: "_instruction_blez",
    value: function _instruction_blez(fields) {
      if (this._getRegister(fields[0]) <= 0) {
        var addr = this._getRegister(fields[1]);
        this._programCounter = Math.ceil(addr);
      }
    }
  }, {
    key: "_instruction_bgez",
    value: function _instruction_bgez(fields) {
      if (this._getRegister(fields[0]) >= 0) {
        var addr = this._getRegister(fields[1]);
        this._programCounter = Math.ceil(addr);
      }
    }
  }, {
    key: "_instruction_bgtz",
    value: function _instruction_bgtz(fields) {
      if (this._getRegister(fields[0]) > 0) {
        var addr = this._getRegister(fields[1]);
        this._programCounter = Math.ceil(addr);
      }
    }
  }, {
    key: "_instruction_beq",
    value: function _instruction_beq(fields) {
      if (this._getRegister(fields[0]) === this._getRegister(fields[1])) {
        var addr = this._getRegister(fields[2]);
        this._programCounter = Math.ceil(addr);
      }
    }
  }, {
    key: "_instruction_bne",
    value: function _instruction_bne(fields) {
      if (this._getRegister(fields[0]) !== this._getRegister(fields[1])) {
        var addr = this._getRegister(fields[2]);
        this._programCounter = Math.ceil(addr);
      }
    }
  }, {
    key: "_instruction_yield",
    value: function _instruction_yield() {}
  }, {
    key: "_instruction_l",
    value: function _instruction_l(fields) {
      this._setRegister(fields[0], this._getRegister(fields[1], fields[2]));
    }
  }, {
    key: "_instruction_s",
    value: function _instruction_s(fields) {
      this._setRegister(fields[0], this._getRegister(fields[2]), fields[1]);
    }
  }]);

  return IC;
}();