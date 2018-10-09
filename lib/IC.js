"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    this._ioRegisterConnected = [];

    for (var i = 0; i <= IO_REGISTER_COUNT; i++) {
      this._ioRegister[i] = {};
      this._ioRegisterConnected[i] = true;
    }

    this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);

    this._stack = Array(STACK_SIZE).fill(0);

    this._registerOpcode("move", [["r", "a"], ["r", "i", "f", "a"]], this._instruction_move);
    this._registerOpcode("add", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_add);
    this._registerOpcode("sub", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_sub);
    this._registerOpcode("mul", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_mul);
    this._registerOpcode("div", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_div);
    this._registerOpcode("mod", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_mod);

    this._registerOpcode("slt", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_slt);
    this._registerOpcode("sgt", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_sgt);
    this._registerOpcode("sle", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_sle);
    this._registerOpcode("sge", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_sge);
    this._registerOpcode("seq", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_seq);
    this._registerOpcode("sne", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_sne);

    this._registerOpcode("sap", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_sap);
    this._registerOpcode("sna", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_sna);

    this._registerOpcode("select", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_select);

    this._registerOpcode("sdse", [["r", "a"], ["d", "a"]], this._instruction_sdse);
    this._registerOpcode("sdns", [["r", "a"], ["d", "a"]], this._instruction_sdns);

    this._registerOpcode("bdse", [["d", "a"], ["r", "i", "a", "j"]], this._instruction_bdse);
    this._registerOpcode("bdns", [["d", "a"], ["r", "i", "a", "j"]], this._instruction_bdns);
    this._registerOpcode("brdse", [["d", "a"], ["r", "i", "a", "j"]], this._instruction_brdse);
    this._registerOpcode("brdns", [["d", "a"], ["r", "i", "a", "j"]], this._instruction_brdns);
    this._registerOpcode("bdseal", [["d", "a"], ["r", "i", "a", "j"]], this._instruction_bdseal);
    this._registerOpcode("bdnsal", [["d", "a"], ["r", "i", "a", "j"]], this._instruction_bdnsal);

    this._registerOpcode("sqrt", [["r", "a"], ["r", "i", "f", "a"]], this._instruction_sqrt);
    this._registerOpcode("round", [["r", "a"], ["r", "i", "f", "a"]], this._instruction_round);
    this._registerOpcode("trunc", [["r", "a"], ["r", "i", "f", "a"]], this._instruction_trunc);
    this._registerOpcode("ceil", [["r", "a"], ["r", "i", "f", "a"]], this._instruction_ceil);
    this._registerOpcode("floor", [["r", "a"], ["r", "i", "f", "a"]], this._instruction_floor);
    this._registerOpcode("max", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_max);
    this._registerOpcode("min", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_min);
    this._registerOpcode("abs", [["r", "a"], ["r", "i", "f", "a"]], this._instruction_abs);
    this._registerOpcode("log", [["r", "a"], ["r", "i", "f", "a"]], this._instruction_log);
    this._registerOpcode("exp", [["r", "a"], ["r", "i", "f", "a"]], this._instruction_exp);
    this._registerOpcode("rand", [["r", "a"]], this._instruction_rand);
    this._registerOpcode("and", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_and);
    this._registerOpcode("or", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_or);
    this._registerOpcode("xor", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_xor);
    this._registerOpcode("nor", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], this._instruction_nor);

    this._registerOpcode("yield", [], this._instruction_yield);

    this._registerOpcode("j", [["r", "i", "a", "j"]], this._instruction_j);
    this._registerOpcode("bltz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bltz);
    this._registerOpcode("blez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_blez);
    this._registerOpcode("bgez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bgez);
    this._registerOpcode("bgtz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bgtz);
    this._registerOpcode("beq", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_beq);
    this._registerOpcode("bne", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bne);
    this._registerOpcode("bna", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bna);
    this._registerOpcode("bap", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bap);

    this._registerOpcode("jal", [["r", "i", "a", "j"]], this._instruction_jal);
    this._registerOpcode("bltzal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bltzal);
    this._registerOpcode("blezal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_blezal);
    this._registerOpcode("bgezal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bgezal);
    this._registerOpcode("bgtzal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bgtzal);
    this._registerOpcode("beqal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_beqal);
    this._registerOpcode("bneal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], this._instruction_bneal);

    this._registerOpcode("jr", [["r", "i", "a"]], this._instruction_jr);
    this._registerOpcode("brltz", [["r", "i", "f", "a"], ["r", "i", "a"]], this._instruction_brltz);
    this._registerOpcode("brlez", [["r", "i", "f", "a"], ["r", "i", "a"]], this._instruction_brlez);
    this._registerOpcode("brgez", [["r", "i", "f", "a"], ["r", "i", "a"]], this._instruction_brgez);
    this._registerOpcode("brgtz", [["r", "i", "f", "a"], ["r", "i", "a"]], this._instruction_brgtz);
    this._registerOpcode("breq", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], this._instruction_breq);
    this._registerOpcode("brne", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], this._instruction_brne);
    this._registerOpcode("brna", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], this._instruction_brna);
    this._registerOpcode("brap", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], this._instruction_brap);

    this._registerOpcode("l", [["r", "a"], ["d", "a"], ["s"]], this._instruction_l);
    this._registerOpcode("s", [["d", "a"], ["s"], ["r", "i", "f", "a"]], this._instruction_s);

    this._registerOpcode("alias", [["s"], ["r", "d", "a"]], this._instruction_alias);

    this._registerOpcode("push", [["r", "i", "f", "a"]], this._instruction_push);
    this._registerOpcode("pop", [["r", "a"]], this._instruction_pop);
    this._registerOpcode("peek", [["r", "a"]], this._instruction_peek);

    this._registerOpcode("hcf", [], this._instruction_hcf);

    this._instruction_alias(["db", "d" + IO_REGISTER_COUNT]);
    this._instruction_alias(["sp", "r" + STACK_POINTER_REGISTER]);
    this._instruction_alias(["ra", "r" + RETURN_ADDRESS_REGISTER]);
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
    key: "getIORegisters",
    value: function getIORegisters() {
      return this._ioRegister;
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

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = aliases[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var alias = _step3.value;

          if (this._aliasesAsigned.includes(alias) && this._aliases[alias]["type"] === "d") {
            labels[this._aliases[alias]["value"]].push(alias);
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

      for (i = 0; i <= IO_REGISTER_COUNT; i++) {
        labels[i] = labels[i].join(",");
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

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = aliases[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var alias = _step4.value;

          if (this._aliasesAsigned.includes(alias) && this._aliases[alias]["type"] === "r") {
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
    key: "_isDeviceConnected",
    value: function _isDeviceConnected(register, allowedTypes) {
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

        return this._ioRegisterConnected[number];
      } else {
        return false;
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
      var number;

      switch (type) {
        case "d":
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
      var number;

      switch (type) {
        case "d":
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

      var value = Number.parseFloat(register);

      if (Number.isNaN(value)) {
        if (allowedTypes && Object.keys(this._jumpTags).includes(register)) {
          return this._jumpTags[register];
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
        opcodeData.func(fields, opcodeData.fields);
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
    value: function _instruction_move(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]);
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_add",
    value: function _instruction_add(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) + this._getRegister(fields[2], undefined, allowedTypes[2]);
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sub",
    value: function _instruction_sub(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) - this._getRegister(fields[2], undefined, allowedTypes[2]);
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_mul",
    value: function _instruction_mul(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) * this._getRegister(fields[2], undefined, allowedTypes[2]);
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_div",
    value: function _instruction_div(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) / this._getRegister(fields[2], undefined, allowedTypes[2]);
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_mod",
    value: function _instruction_mod(fields, allowedTypes) {
      var valueOne = this._getRegister(fields[1], undefined, allowedTypes[1]);
      var valueTwo = this._getRegister(fields[2], undefined, allowedTypes[2]);

      var outputValue = valueOne % valueTwo;
      if (outputValue < 0) {
        outputValue += valueTwo;
      }

      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_slt",
    value: function _instruction_slt(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) < this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sle",
    value: function _instruction_sle(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) <= this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sgt",
    value: function _instruction_sgt(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) > this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sge",
    value: function _instruction_sge(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) >= this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_seq",
    value: function _instruction_seq(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) === this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sne",
    value: function _instruction_sne(fields, allowedTypes) {
      var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) !== this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sna",
    value: function _instruction_sna(fields, allowedTypes) {
      var a = this._getRegister(fields[1], undefined, allowedTypes[1]);
      var b = this._getRegister(fields[2], undefined, allowedTypes[2]);
      var c = this._getRegister(fields[3], undefined, allowedTypes[3]);

      var outputValue = Math.abs(a - b) > c * Math.max(Math.abs(a), Math.abs(b)) ? 1 : 0;

      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sap",
    value: function _instruction_sap(fields, allowedTypes) {
      var a = this._getRegister(fields[1], undefined, allowedTypes[1]);
      var b = this._getRegister(fields[2], undefined, allowedTypes[2]);
      var c = this._getRegister(fields[3], undefined, allowedTypes[3]);

      var outputValue = Math.abs(a - b) <= c * Math.max(Math.abs(a), Math.abs(b)) ? 1 : 0;

      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sqrt",
    value: function _instruction_sqrt(fields, allowedTypes) {
      this._setRegister(fields[0], Math.sqrt(this._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_round",
    value: function _instruction_round(fields, allowedTypes) {
      this._setRegister(fields[0], Math.round(this._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_trunc",
    value: function _instruction_trunc(fields, allowedTypes) {
      this._setRegister(fields[0], Math.trunc(this._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_ceil",
    value: function _instruction_ceil(fields, allowedTypes) {
      this._setRegister(fields[0], Math.ceil(this._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_floor",
    value: function _instruction_floor(fields, allowedTypes) {
      this._setRegister(fields[0], Math.floor(this._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_max",
    value: function _instruction_max(fields, allowedTypes) {
      var outputValue = Math.max(this._getRegister(fields[1], undefined, allowedTypes[1]), this._getRegister(fields[2], undefined, allowedTypes[2]));
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_min",
    value: function _instruction_min(fields, allowedTypes) {
      var outputValue = Math.min(this._getRegister(fields[1], undefined, allowedTypes[1]), this._getRegister(fields[2], undefined, allowedTypes[2]));
      this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_abs",
    value: function _instruction_abs(fields, allowedTypes) {
      this._setRegister(fields[0], Math.abs(this._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_log",
    value: function _instruction_log(fields, allowedTypes) {
      this._setRegister(fields[0], Math.log(this._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_exp",
    value: function _instruction_exp(fields, allowedTypes) {
      this._setRegister(fields[0], Math.exp(this._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_rand",
    value: function _instruction_rand(fields, allowedTypes) {
      this._setRegister(fields[0], Math.random(), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_and",
    value: function _instruction_and(fields, allowedTypes) {
      var valueOne = this._getRegister(fields[1], undefined, allowedTypes[1]) != 0;
      var valueTwo = this._getRegister(fields[2], undefined, allowedTypes[2]) != 0;
      var result = valueOne && valueTwo ? 1 : 0;
      this._setRegister(fields[0], result, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_or",
    value: function _instruction_or(fields, allowedTypes) {
      var valueOne = this._getRegister(fields[1], undefined, allowedTypes[1]) != 0;
      var valueTwo = this._getRegister(fields[2], undefined, allowedTypes[2]) != 0;
      var result = valueOne || valueTwo ? 1 : 0;
      this._setRegister(fields[0], result, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_xor",
    value: function _instruction_xor(fields, allowedTypes) {
      var valueOne = this._getRegister(fields[1], undefined, allowedTypes[1]) != 0;
      var valueTwo = this._getRegister(fields[2], undefined, allowedTypes[2]) != 0;
      var result = valueOne ^ valueTwo ? 1 : 0;
      this._setRegister(fields[0], result, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_nor",
    value: function _instruction_nor(fields, allowedTypes) {
      var valueOne = this._getRegister(fields[1], undefined, allowedTypes[1]) != 0;
      var valueTwo = this._getRegister(fields[2], undefined, allowedTypes[2]) != 0;
      var result = !valueOne && !valueTwo ? 1 : 0;
      this._setRegister(fields[0], result, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_j",
    value: function _instruction_j(fields, allowedTypes) {
      var addr = this._getRegister(fields[0], undefined, allowedTypes[0]);
      this._programCounter = Math.round(addr);
    }
  }, {
    key: "_instruction_jal",
    value: function _instruction_jal(fields, allowedTypes) {
      var addr = this._getRegister(fields[0], undefined, allowedTypes[0]);
      this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
      this._programCounter = Math.round(addr);
    }
  }, {
    key: "_instruction_bltzal",
    value: function _instruction_bltzal(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) < 0) {
        var addr = this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_blezal",
    value: function _instruction_blezal(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) <= 0) {
        var addr = this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bgezal",
    value: function _instruction_bgezal(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) >= 0) {
        var addr = this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bgtzal",
    value: function _instruction_bgtzal(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) > 0) {
        var addr = this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_beqal",
    value: function _instruction_beqal(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) === this._getRegister(fields[1], undefined, allowedTypes[1])) {
        var addr = this._getRegister(fields[2], undefined, allowedTypes[2]);
        this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bneal",
    value: function _instruction_bneal(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) !== this._getRegister(fields[1], undefined, allowedTypes[1])) {
        var addr = this._getRegister(fields[2], undefined, allowedTypes[2]);
        this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bltz",
    value: function _instruction_bltz(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) < 0) {
        var addr = this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_blez",
    value: function _instruction_blez(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) <= 0) {
        var addr = this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bgez",
    value: function _instruction_bgez(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) >= 0) {
        var addr = this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bgtz",
    value: function _instruction_bgtz(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) > 0) {
        var addr = this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_beq",
    value: function _instruction_beq(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) === this._getRegister(fields[1], undefined, allowedTypes[1])) {
        var addr = this._getRegister(fields[2], undefined, allowedTypes[2]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_bne",
    value: function _instruction_bne(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) !== this._getRegister(fields[1], undefined, allowedTypes[1])) {
        var addr = this._getRegister(fields[2], undefined, allowedTypes[2]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_yield",
    value: function _instruction_yield() {
      throw "YIELD";
    }
  }, {
    key: "_instruction_hcf",
    value: function _instruction_hcf() {
      throw "HALT_AND_CATCH_FIRE";
    }
  }, {
    key: "_instruction_l",
    value: function _instruction_l(fields, allowedTypes) {
      this._setRegister(fields[0], this._getRegister(fields[1], fields[2], allowedTypes[1]), undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_s",
    value: function _instruction_s(fields, allowedTypes) {
      this._setRegister(fields[0], this._getRegister(fields[2], undefined, allowedTypes[2]), fields[1], allowedTypes[0]);
    }
  }, {
    key: "_instruction_jr",
    value: function _instruction_jr(fields, allowedTypes) {
      var addr = this._programCounter - 1 + this._getRegister(fields[0], undefined, allowedTypes[0]);
      this._programCounter = Math.round(addr);
    }
  }, {
    key: "_instruction_brltz",
    value: function _instruction_brltz(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) < 0) {
        var addr = this._programCounter - 1 + this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_brlez",
    value: function _instruction_brlez(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) <= 0) {
        var addr = this._programCounter - 1 + this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_brgez",
    value: function _instruction_brgez(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) >= 0) {
        var addr = this._programCounter - 1 + this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_brgtz",
    value: function _instruction_brgtz(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) > 0) {
        var addr = this._programCounter - 1 + this._getRegister(fields[1], undefined, allowedTypes[1]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_breq",
    value: function _instruction_breq(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) === this._getRegister(fields[1], undefined, allowedTypes[1])) {
        var addr = this._programCounter - 1 + this._getRegister(fields[2], undefined, allowedTypes[2]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
    key: "_instruction_brne",
    value: function _instruction_brne(fields, allowedTypes) {
      if (this._getRegister(fields[0], undefined, allowedTypes[0]) !== this._getRegister(fields[1], undefined, allowedTypes[1])) {
        var addr = this._programCounter - 1 + this._getRegister(fields[2], undefined, allowedTypes[2]);
        this._programCounter = Math.round(addr);
      }
    }
  }, {
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
    key: "_instruction_push",
    value: function _instruction_push(fields, allowedTypes) {
      var stackPosition = this._internalRegister[STACK_POINTER_REGISTER];

      if (stackPosition >= STACK_SIZE) {
        throw "STACK_OVERFLOW";
      }

      this._stack[stackPosition] = this._getRegister(fields[0], undefined, allowedTypes[0]);
      this._internalRegister[STACK_POINTER_REGISTER] = stackPosition + 1;
    }
  }, {
    key: "_instruction_pop",
    value: function _instruction_pop(fields, allowedTypes) {
      var stackPosition = this._internalRegister[STACK_POINTER_REGISTER];

      if (stackPosition <= 0) {
        throw "STACK_UNDERFLOW";
      }

      stackPosition -= 1;
      this._internalRegister[STACK_POINTER_REGISTER] = stackPosition;
      this._setRegister(fields[0], this._stack[stackPosition], undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_peek",
    value: function _instruction_peek(fields, allowedTypes) {
      var stackPosition = this._internalRegister[STACK_POINTER_REGISTER];

      if (stackPosition <= 0) {
        throw "STACK_UNDERFLOW";
      }

      this._setRegister(fields[0], this._stack[stackPosition - 1], undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_bna",
    value: function _instruction_bna(fields, allowedTypes) {
      var a = this._getRegister(fields[0], undefined, allowedTypes[0]);
      var b = this._getRegister(fields[1], undefined, allowedTypes[1]);
      var c = this._getRegister(fields[2], undefined, allowedTypes[2]);
      var d = this._getRegister(fields[3], undefined, allowedTypes[3]);

      if (Math.abs(a - b) > c * Math.max(Math.abs(a), Math.abs(b))) {
        this._programCounter = d;
      }
    }
  }, {
    key: "_instruction_bap",
    value: function _instruction_bap(fields, allowedTypes) {
      var a = this._getRegister(fields[0], undefined, allowedTypes[0]);
      var b = this._getRegister(fields[1], undefined, allowedTypes[1]);
      var c = this._getRegister(fields[2], undefined, allowedTypes[2]);
      var d = this._getRegister(fields[3], undefined, allowedTypes[3]);

      if (Math.abs(a - b) <= c * Math.max(Math.abs(a), Math.abs(b))) {
        this._programCounter = d;
      }
    }
  }, {
    key: "_instruction_brna",
    value: function _instruction_brna(fields, allowedTypes) {
      var a = this._getRegister(fields[0], undefined, allowedTypes[0]);
      var b = this._getRegister(fields[1], undefined, allowedTypes[1]);
      var c = this._getRegister(fields[2], undefined, allowedTypes[2]);
      var d = this._getRegister(fields[3], undefined, allowedTypes[3]);

      if (Math.abs(a - b) > c * Math.max(Math.abs(a), Math.abs(b))) {
        this._programCounter += d;
      }
    }
  }, {
    key: "_instruction_brap",
    value: function _instruction_brap(fields, allowedTypes) {
      var a = this._getRegister(fields[0], undefined, allowedTypes[0]);
      var b = this._getRegister(fields[1], undefined, allowedTypes[1]);
      var c = this._getRegister(fields[2], undefined, allowedTypes[2]);
      var d = this._getRegister(fields[3], undefined, allowedTypes[3]);

      if (Math.abs(a - b) <= c * Math.max(Math.abs(a), Math.abs(b))) {
        this._programCounter += d;
      }
    }
  }, {
    key: "_instruction_select",
    value: function _instruction_select(fields, allowedTypes) {
      var b = this._getRegister(fields[1], undefined, allowedTypes[1]);
      var c = this._getRegister(fields[2], undefined, allowedTypes[2]);
      var d = this._getRegister(fields[3], undefined, allowedTypes[3]);

      var result = b === 0 ? d : c;

      this._setRegister(fields[0], result, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sdse",
    value: function _instruction_sdse(fields, allowedTypes) {
      var value = this._isDeviceConnected(fields[1], allowedTypes[1]) ? 1 : 0;
      this._setRegister(fields[0], value, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_sdns",
    value: function _instruction_sdns(fields, allowedTypes) {
      var value = this._isDeviceConnected(fields[1], allowedTypes[1]) ? 0 : 1;
      this._setRegister(fields[0], value, undefined, allowedTypes[0]);
    }
  }, {
    key: "_instruction_bdse",
    value: function _instruction_bdse(fields, allowedTypes) {
      var value = this._isDeviceConnected(fields[0], allowedTypes[0]) ? 1 : 0;

      if (value) {
        this._programCounter = this._getRegister(fields[1], undefined, allowedTypes[1]);
      }
    }
  }, {
    key: "_instruction_bdns",
    value: function _instruction_bdns(fields, allowedTypes) {
      var value = this._isDeviceConnected(fields[0], allowedTypes[0]) ? 0 : 1;

      if (value) {
        this._programCounter = this._getRegister(fields[1], undefined, allowedTypes[1]);
      }
    }
  }, {
    key: "_instruction_brdse",
    value: function _instruction_brdse(fields, allowedTypes) {
      var value = this._isDeviceConnected(fields[0], allowedTypes[0]) ? 1 : 0;

      if (value) {
        this._programCounter += this._getRegister(fields[1], undefined, allowedTypes[1]);
      }
    }
  }, {
    key: "_instruction_brdns",
    value: function _instruction_brdns(fields, allowedTypes) {
      var value = this._isDeviceConnected(fields[0], allowedTypes[0]) ? 0 : 1;

      if (value) {
        this._programCounter += this._getRegister(fields[1], undefined, allowedTypes[1]);
      }
    }
  }, {
    key: "_instruction_bdseal",
    value: function _instruction_bdseal(fields, allowedTypes) {
      var value = this._isDeviceConnected(fields[0], allowedTypes[0]) ? 1 : 0;

      if (value) {
        this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
        this._programCounter = this._getRegister(fields[1], undefined, allowedTypes[1]);
      }
    }
  }, {
    key: "_instruction_bdnsal",
    value: function _instruction_bdnsal(fields, allowedTypes) {
      var value = this._isDeviceConnected(fields[0], allowedTypes[0]) ? 0 : 1;

      if (value) {
        this._internalRegister[RETURN_ADDRESS_REGISTER] = this._programCounter;
        this._programCounter = this._getRegister(fields[1], undefined, allowedTypes[1]);
      }
    }
  }]);

  return IC;
}();