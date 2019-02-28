"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BranchInstructions = require("./instructions/Branch");
var SelectInstructions = require("./instructions/Select");
var MathInstructions = require("./instructions/Math");
var LogicInstructions = require("./instructions/Logic");
var DeviceInstructions = require("./instructions/Device");
var StackInstructions = require("./instructions/Stack");
var MiscInstructions = require("./instructions/Misc");

"use strict";

var NEWLINE = "\n";
var INSTRUCTION_SEPERATOR = /\s+/;
var COMMENT_SEPERATOR = /\s*(\/\/|#)/;

var IO_REGISTER_COUNT = 6;
var INTERNAL_REGISTER_COUNT = 18;

var STACK_SIZE = 512;
var STACK_POINTER_REGISTER = 16;

var RETURN_ADDRESS_REGISTER = 17;

var INITIAL_ALIASES = ["db", "sp", "ra"];

module.exports = function () {
  function IC() {
    _classCallCheck(this, IC);

    this.STACK_SIZE = STACK_SIZE;
    this.STACK_POINTER_REGISTER = STACK_POINTER_REGISTER;

    this._opcodes = {};
    this._instructions = [];

    this._ignoreErrors = false;

    this._validProgram = true;
    this._programErrors = [];
    this._programErrorLines = [];

    this._programCounter = 0;

    this._sleepPeriod = 0;

    this._aliases = {};
    this._aliasesAsigned = [];

    this._defines = {};

    this._jumpTags = {};

    this._ioRegister = [];
    this._ioSlot = [];
    this._ioReagent = [];
    this._ioRegisterConnected = [];

    for (var i = 0; i <= IO_REGISTER_COUNT; i++) {
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

    this._registerOpcode("alias", [["s"], ["r", "d", "a"]], this._instruction_alias, "misc");
    this._registerOpcode("define", [["s"], ["i", "f"]], this._instruction_define, "misc");

    this._instruction_alias(["db", "d" + IO_REGISTER_COUNT]);
    this._instruction_alias(["sp", "r" + STACK_POINTER_REGISTER]);
    this._instruction_alias(["ra", "r" + RETURN_ADDRESS_REGISTER]);
  }

  _createClass(IC, [{
    key: "_instruction_alias",
    value: function _instruction_alias(fields) {
      var matches = fields[1].match(/^([dr])(\d+)$/);

      if (matches) {
        var number = Number.parseInt(matches[2]);
        this._aliases[fields[0]] = { value: number, type: matches[1] };
        this._aliasesAsigned.push(fields[0]);
      } else {
        var foundAlias = this._aliases[fields[1]];

        if (foundAlias) {
          this._aliases[fields[0]] = { value: foundAlias.value, type: foundAlias.type };
          this._aliasesAsigned.push(fields[0]);
        }
      }
    }
  }, {
    key: "_instruction_define",
    value: function _instruction_define(fields, allowedTypes) {
      var value = this._getRegister(fields[1], undefined, allowedTypes[1]);
      this._defines[fields[0]] = value;
    }
  }, {
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

      var parsedLines = this._instructions.map(function (content) {
        return _this._parseLine(content);
      });
      var foundAliases = parsedLines.filter(function (tokens) {
        return tokens.length >= 2 && tokens[0] === "alias";
      }).map(function (tokens) {
        return tokens[1];
      }).concat(INITIAL_ALIASES);
      var currentAliases = this._aliases;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = foundAliases[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var alias = _step.value;

          if (!Object.keys(currentAliases).includes(alias)) {
            this._aliases[alias] = { value: 0 };
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

          var foundIndex = this._aliasesAsigned.indexOf(toBeRemoved);
          delete this._aliasesAsigned[foundIndex];
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

      var foundDefines = parsedLines.filter(function (tokens) {
        return tokens.length >= 2 && tokens[0] === "define";
      }).map(function (tokens) {
        return tokens[1];
      });

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = foundDefines[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var define = _step3.value;

          if (!Object.keys(this._defines).includes(define)) {
            this._defines[define] = 0;
          }
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

      this._jumpTags = {};

      parsedLines.forEach(function (content, line) {
        if (content.length > 0) {
          var matches = content[0].match(/(\S+):/);
          if (matches && !Object.keys(_this._jumpTags).includes(matches[1])) {
            _this._jumpTags[matches[1]] = line;
          }
        }
      });
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

      var errors = this._programErrors.filter(function (e) {
        return e["type"] === "error";
      });
      this._validProgram = errors.length == 0;

      this._programErrorLines = errors.map(function (e) {
        return e["line"];
      });
    }
  }, {
    key: "_validateLine",
    value: function _validateLine(content, line) {
      var _this3 = this;

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

      var fieldErrors = opcodeFields.map(function (type, i) {
        if (tokens.length < i + 1) {
          return { line: line, error: "MISSING_FIELD", field: i, "type": "error" };
        }

        var typeCheck = _this3._checkFieldTypes(tokens[i], type);

        if (typeCheck) {
          return { line: line, error: typeCheck, validTypes: type, field: i, "type": "error" };
        }
      }).filter(function (error) {
        return error;
      });

      if (tokens.length > opcodeFields.length) {
        for (var i = opcodeFields.length; i < tokens.length; i++) {
          fieldErrors.push({ line: line, error: "EXTRA_FIELD", field: i, "type": "error" });
        }
      }

      return errors.concat(fieldErrors);
    }
  }, {
    key: "_checkFieldTypes",
    value: function _checkFieldTypes(token, fieldTypes) {
      // Alias
      if (fieldTypes.includes("a")) {
        if (Object.keys(this._aliases).includes(token)) {
          return undefined;
        }
      }

      // Jump Label
      if (fieldTypes.includes("j")) {
        if (Object.keys(this._jumpTags).includes(token)) {
          return undefined;
        }
      }

      // Register
      if (fieldTypes.includes("r")) {
        var registerMatches = token.match(/^r+(\d+)$/);

        if (registerMatches) {
          var registerNumber = Number.parseInt(registerMatches[1]);

          if (registerNumber >= INTERNAL_REGISTER_COUNT) {
            return "INVALID_FIELD_NO_SUCH_REGISTER";
          }

          return undefined;
        }
      }

      // Device
      if (fieldTypes.includes("d")) {
        var deviceMatches = token.match(/^d(r*)(\d)+$/);

        if (deviceMatches) {
          var maxRegister = deviceMatches[1].length > 0 ? INTERNAL_REGISTER_COUNT : IO_REGISTER_COUNT;
          var actualRegister = Number.parseInt(deviceMatches[2]);

          if (actualRegister >= maxRegister) {
            return "INVALID_FIELD_NO_SUCH_REGISTER";
          }

          return undefined;
        }
      }

      // Number Handling
      var asNumber = Number.parseFloat(token);

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
      } else {
        // Float from a define.
        if (fieldTypes.includes("f")) {
          if (Object.keys(this._defines).includes(token)) {
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
  }, {
    key: "_parseLine",
    value: function _parseLine(line) {
      var withoutComment = line.split(COMMENT_SEPERATOR)[0];
      return withoutComment.split(INSTRUCTION_SEPERATOR).filter(function (token) {
        return token.trim();
      });
    }
  }, {
    key: "setIgnoreErrors",
    value: function setIgnoreErrors(value) {
      this._ignoreErrors = value;
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
    key: "getIONames",
    value: function getIONames() {
      var names = [];

      for (var i = 0; i < IO_REGISTER_COUNT; i++) {
        names.push(["d"] + i);
      }

      names.push("db");

      return names;
    }
  }, {
    key: "getIOLabels",
    value: function getIOLabels() {
      var labels = Array(IO_REGISTER_COUNT + 1);

      for (var i = 0; i <= IO_REGISTER_COUNT; i++) {
        labels[i] = [];
      }

      var aliases = Object.keys(this._aliases);

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = aliases[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var alias = _step4.value;

          if (this._aliasesAsigned.includes(alias) && this._aliases[alias]["type"] === "d") {
            labels[this._aliases[alias]["value"]].push(alias);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      for (var _i = 0; _i <= IO_REGISTER_COUNT; _i++) {
        labels[_i] = labels[_i].join(",");
      }

      return labels;
    }
  }, {
    key: "getIOConnected",
    value: function getIOConnected() {
      return this._ioRegisterConnected;
    }
  }, {
    key: "setIOConnected",
    value: function setIOConnected(index, value) {
      this._ioRegisterConnected[index] = value;
    }
  }, {
    key: "getIORegisters",
    value: function getIORegisters() {
      return this._ioRegister;
    }
  }, {
    key: "setIORegister",
    value: function setIORegister(index, field, value) {
      if (value !== undefined) {
        value = Number.parseFloat(value);

        if (Number.isNaN(value)) {
          value = 0;
        }
      }

      if (index <= IO_REGISTER_COUNT) {
        if (value !== undefined) {
          this._ioRegister[index][field] = value;
        } else {
          delete this._ioRegister[index][field];
        }
      }
    }
  }, {
    key: "getIOSlots",
    value: function getIOSlots() {
      return this._ioSlot;
    }
  }, {
    key: "setIOSlot",
    value: function setIOSlot(index, slot, logicType, value) {
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
  }, {
    key: "getIOReagents",
    value: function getIOReagents() {
      return this._ioReagent;
    }
  }, {
    key: "setIOReagent",
    value: function setIOReagent(index, reagent, logicReagentMode, value) {
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
  }, {
    key: "getStack",
    value: function getStack() {
      return this._stack;
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

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = aliases[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var alias = _step5.value;

          if (this._aliasesAsigned.includes(alias) && this._aliases[alias]["type"] === "r") {
            labels[this._aliases[alias]["value"]].push(alias);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      for (var _i2 = 0; _i2 < INTERNAL_REGISTER_COUNT; _i2++) {
        labels[_i2] = labels[_i2].join(",");
      }

      return labels;
    }
  }, {
    key: "setInternalRegister",
    value: function setInternalRegister(index, value) {
      value = Number.parseFloat(value);

      if (Number.isNaN(value)) {
        value = 0;
      }

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
    key: "getInstructions",
    value: function getInstructions() {
      var _this4 = this;

      return Object.keys(this._opcodes).reduce(function (acc, opcode) {
        acc[opcode] = { category: _this4._opcodes[opcode].category, fields: _this4._opcodes[opcode].fields };
        return acc;
      }, {});
    }
  }, {
    key: "_resolveDeviceNumber",
    value: function _resolveDeviceNumber(register, allowedTypes) {
      if (allowedTypes.includes("a")) {
        var foundAlias = this._aliases[register];

        if (foundAlias) {
          if (!allowedTypes.includes(foundAlias.type)) {
            throw "ALIAS_TYPE_MISMATCH";
          } else {
            register = foundAlias.type + foundAlias.value;
          }
        }
      }

      if (register.charAt(0) === "d") {
        var number = 0;
        var match = register.match(/d(r*)(\d+)/);

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
  }, {
    key: "_isDeviceConnected",
    value: function _isDeviceConnected(register, allowedTypes) {
      var deviceNumber = this._resolveDeviceNumber(register, allowedTypes);

      if (deviceNumber === undefined) {
        return false;
      } else {
        return this._ioRegisterConnected[deviceNumber];
      }
    }
  }, {
    key: "_setRegister",
    value: function _setRegister(register, value, field, allowedTypes) {
      if (allowedTypes.includes("a")) {
        var foundAlias = this._aliases[register];

        if (foundAlias) {
          if (!allowedTypes.includes(foundAlias.type)) {
            throw "ALIAS_TYPE_MISMATCH";
          } else {
            register = foundAlias.type + foundAlias.value;
          }
        }
      }

      var type = register.charAt(0);
      var number = void 0;
      var match = void 0;

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
  }, {
    key: "_getRegister",
    value: function _getRegister(register, field, allowedTypes) {
      if (allowedTypes.includes("a")) {
        var foundAlias = this._aliases[register];

        if (foundAlias) {
          if (!allowedTypes.includes(foundAlias.type)) {
            throw "ALIAS_TYPE_MISMATCH";
          } else {
            register = foundAlias.type + foundAlias.value;
          }
        }
      }

      var type = register.charAt(0);
      var number = void 0;
      var match = void 0;

      switch (type) {
        case "d":
          match = register.match(/d(r*)(\d+)/);

          if (match) {
            if (match[1].length > 0) {
              number = this._getRegister(match[1] + match[2], undefined, ["r"]);
            } else {
              number = Number.parseInt(match[2]);
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
          }

          break;

        case "r":
          number = this._resolveIndirectRegister(register);

          if (number !== null) {
            return this.getInternalRegisters()[number];
          }
      }

      var value = Number.parseFloat(register);

      if (Number.isNaN(value)) {
        if (Object.keys(this._jumpTags).includes(register)) {
          return this._jumpTags[register];
        }

        if (Object.keys(this._defines).includes(register)) {
          return this._defines[register];
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
          throw "INVALID_REGISTER_LOCATION";
        }
      }

      return number;
    }
  }, {
    key: "step",
    value: function step() {
      if (this._validProgram || this._ignoreErrors) {
        var instruction = this._instructions[this._programCounter];
        var isErrorLine = this._programErrorLines.includes(this._programCounter);

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
  }, {
    key: "restart",
    value: function restart() {
      this._programCounter = 0;
      this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);
      this._stack = Array(STACK_SIZE).fill(0);
    }
  }, {
    key: "_executeInstruction",
    value: function _executeInstruction(instruction) {
      var fields = this._parseLine(instruction);
      var opcode = fields.shift();

      var opcodeData = this._opcodes[opcode];

      if (opcodeData) {
        opcodeData.func(fields, opcodeData.fields, this);
      }

      return opcode;
    }
  }, {
    key: "_registerOpcode",
    value: function _registerOpcode(name, fields, func, category) {
      func = func.bind(this);
      this._opcodes[name] = { fields: fields, func: func, category: category };
    }
  }, {
    key: "_jumper",
    value: function _jumper(condition, destination, relative, and_link) {
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
  }]);

  return IC;
}();