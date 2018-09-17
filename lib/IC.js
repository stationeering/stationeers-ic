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

    this._aliases = {};
    this._ioRegister = [];
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

    this._registerOpcode("j", ["s"], this._instruction_j);
    this._registerOpcode("bltz", ["s", "s"], this._instruction_bltz);
    this._registerOpcode("blez", ["s", "s"], this._instruction_blez);
    this._registerOpcode("bgez", ["s", "s"], this._instruction_bgez);
    this._registerOpcode("bgtz", ["s", "s"], this._instruction_bgtz);
    this._registerOpcode("beq", ["s", "s", "s"], this._instruction_beq);
    this._registerOpcode("bne", ["s", "s", "s"], this._instruction_bne);

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

  _createClass(IC, [{
    key: "load",
    value: function load(unparsedInstructions) {
      this._instructions = unparsedInstructions.split(NEWLINE);

      this._preProcess();
      this._validate();
    }
  }, {
    key: "_preProcess",
    value: function _preProcess() {
      var _this = this;

      var foundAliases = this._instructions.map(function (content) {
        return _this._parseLine(content);
      }).filter(function (tokens) {
        return tokens.length >= 2 && tokens[0] === "alias";
      }).map(function (tokens) {
        return tokens[1];
      });
      var currentAliases = this._aliases;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = foundAliases[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var alias = _step.value;

          if (!Object.keys(currentAliases).includes(alias)) {
            this._aliases[alias] = 0;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var removedAliases = Object.keys(currentAliases).filter(function (currentAlias) {
        return !foundAliases.includes(currentAlias);
      });

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = removedAliases[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var toBeRemoved = _step2.value;

          delete this._aliases[toBeRemoved];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "_validate",
    value: function _validate() {
      var _this2 = this;

      this._programErrors = [].concat.apply([], this._instructions.map(function (content, line) {
        return _this2._validateLine(content, line);
      }).filter(function (validatedLine) {
        return validatedLine;
      }));
      this._validProgram = this._programErrors.length == 0;
    }
  }, {
    key: "_validateLine",
    value: function _validateLine(content, line) {
      var _this3 = this;

      if (content.length > 52) {
        return [{ line: line, error: "LINE_TOO_LONG" }];
      }

      if (line >= 128) {
        return [{ line: line, error: "PROGRAM_TOO_LONG" }];
      }

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

        var typeCheck = _this3._checkFieldTypes(tokens[i], type);

        if (typeCheck) {
          return { line: line, error: typeCheck, field: i };
        }

        if (!_this3._checkRegisterRange(tokens[i]) && type !== "f") {
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
    value: function _checkFieldTypes(token, fieldType) {
      var tokenType = token.charAt(0);

      if (fieldType === "f") {
        return undefined;
      }

      if (tokenType !== "d" && tokenType !== "r") {
        var asFloat = Number.parseFloat(token);

        if (isNaN(asFloat)) {
          if (Object.keys(this._aliases).includes(token)) {
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
          return tokenType === "r" ? undefined : "INVALID_FIELD_NOT_REGISTER";
        case "s":
          return tokenType === "r" || tokenType === "f" ? undefined : "INVALID_FIELD_NOT_READABLE";
        case "i":
          return tokenType === "d" ? undefined : "INVALID_FIELD_NOT_DEVICE";
      }
    }
  }, {
    key: "_checkRegisterRange",
    value: function _checkRegisterRange(token) {
      var starting = token.charAt(0);
      var number;

      switch (starting) {
        case "d":
          number = Number.parseInt(token.slice(1));

          if (token.charAt(1) === "b") {
            number = IO_REGISTER_COUNT;
          }

          return number <= IO_REGISTER_COUNT;
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
    key: "getIONames",
    value: function getIONames() {
      var names = [];

      for (var i = 0; i < IO_REGISTER_COUNT; i++) {
        names.push("d" + i);
      }

      names.push("db");

      return names;
    }
  }, {
    key: "getIOLabels",
    value: function getIOLabels() {
      return this._ioLabels;
    }
  }, {
    key: "setIORegister",
    value: function setIORegister(index, field, value) {
      if (index <= IO_REGISTER_COUNT) {
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
    key: "getInternalLabels",
    value: function getInternalLabels() {
      var labels = Array(INTERNAL_REGISTER_COUNT);

      for (var i = 0; i < INTERNAL_REGISTER_COUNT; i++) {
        labels[i] = [];
      }

      var aliases = Object.keys(this._aliases);

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = aliases[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var alias = _step3.value;

          labels[this._aliases[alias]].push(alias);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      for (i = 0; i < INTERNAL_REGISTER_COUNT; i++) {
        labels[i] = labels[i].join(",");
      }
      return labels;
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
      var number;

      switch (type) {
        case "d":
          number = Number.parseInt(register.slice(1));

          if (register.charAt(1) === "b") {
            number = IO_REGISTER_COUNT;
          }

          if (Number.isNaN(number)) {
            return;
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
  }, {
    key: "_getRegister",
    value: function _getRegister(register, field) {
      var type = register.charAt(0);
      var number;

      switch (type) {
        case "d":
          number = Number.parseInt(register.slice(1));

          if (register.charAt(1) === "b") {
            number = IO_REGISTER_COUNT;
          }

          if (Number.isNaN(number)) {
            return;
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
        if (Object.keys(this._aliases).includes(register)) {
          return this._getRegister("r" + this._aliases[register], field);
        }
        return;
      } else {
        return value;
      }
    }
  }, {
    key: "_resolveIndirectRegister",
    value: function _resolveIndirectRegister(register) {
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
  }, {
    key: "step",
    value: function step() {
      if (this._validProgram) {
        var instruction = this._instructions[this._programCounter];
        this._programCounter++;

        var lastOpCode;

        try {
          lastOpCode = this._executeInstruction(instruction);
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
      this._programCounter = Math.round(addr);
    }
  }, {
    key: "_instruction_bltz",
    value: function _instruction_bltz(fields) {
      if (this._getRegister(fields[0]) < 0) {
        var addr = this._getRegister(fields[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_blez",
    value: function _instruction_blez(fields) {
      if (this._getRegister(fields[0]) <= 0) {
        var addr = this._getRegister(fields[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bgez",
    value: function _instruction_bgez(fields) {
      if (this._getRegister(fields[0]) >= 0) {
        var addr = this._getRegister(fields[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bgtz",
    value: function _instruction_bgtz(fields) {
      if (this._getRegister(fields[0]) > 0) {
        var addr = this._getRegister(fields[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_beq",
    value: function _instruction_beq(fields) {
      if (this._getRegister(fields[0]) === this._getRegister(fields[1])) {
        var addr = this._getRegister(fields[2]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bne",
    value: function _instruction_bne(fields) {
      if (this._getRegister(fields[0]) !== this._getRegister(fields[1])) {
        var addr = this._getRegister(fields[2]);
        this._programCounter = Math.round(addr);
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
  }, {
    key: "_instruction_jr",
    value: function _instruction_jr(fields) {
      var addr = this._programCounter - 1 + this._getRegister(fields[0]);
      this._programCounter = Math.round(addr);
    }
  }, {
    key: "_instruction_brltz",
    value: function _instruction_brltz(fields) {
      if (this._getRegister(fields[0]) < 0) {
        var addr = this._programCounter - 1 + this._getRegister(fields[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_brlez",
    value: function _instruction_brlez(fields) {
      if (this._getRegister(fields[0]) <= 0) {
        var addr = this._programCounter - 1 + this._getRegister(fields[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_brgez",
    value: function _instruction_brgez(fields) {
      if (this._getRegister(fields[0]) >= 0) {
        var addr = this._programCounter - 1 + this._getRegister(fields[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_brgtz",
    value: function _instruction_brgtz(fields) {
      if (this._getRegister(fields[0]) > 0) {
        var addr = this._programCounter - 1 + this._getRegister(fields[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_breq",
    value: function _instruction_breq(fields) {
      if (this._getRegister(fields[0]) === this._getRegister(fields[1])) {
        var addr = this._programCounter - 1 + this._getRegister(fields[2]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_brne",
    value: function _instruction_brne(fields) {
      if (this._getRegister(fields[0]) !== this._getRegister(fields[1])) {
        var addr = this._programCounter - 1 + this._getRegister(fields[2]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_alias",
    value: function _instruction_alias(fields) {
      var number = Number.parseInt(fields[1].split("r")[1]);
      this._aliases[fields[0]] = number;
    }
  }, {
    key: "_instruction_label",
    value: function _instruction_label(fields) {
      var number = Number.parseInt(fields[0].split("d")[1]);
      this._ioLabels[number] = fields[1];
    }
  }]);

  return IC;
}();