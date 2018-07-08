"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NEWLINE = "\n";
var INSTRUCTION_SEPERATOR = " ";

var INPUT_REGISTER_COUNT = 3;
var OUTPUT_REGISTER_COUNT = 3;
var INTERNAL_REGISTER_COUNT = 5;
var MAXIMUM_INSTRUCTIONS = 10;

var KNOWN_OPCODES = {
  "sel": 4,
  "max": 3,
  "min": 3,
  "add": 3,
  "sub": 3,
  "mul": 3,
  "div": 3,
  "mod": 3,
  "eq": 3,
  "neq": 3,
  "gt": 3,
  "lt": 3,
  "ceil": 2,
  "flor": 2,
  "abs": 2,
  "log": 2,
  "exp": 2,
  "rou": 2,
  "rand": 2,
  "stor": 2
};

module.exports = function () {
  function IC() {
    _classCallCheck(this, IC);

    this._instructions = [];
    this._programCounter = 0;
    this._inputRegister = Array(INPUT_REGISTER_COUNT).fill(0);
    this._outputRegister = Array(OUTPUT_REGISTER_COUNT).fill(0);
    this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);
    this._literalRegister = [];
  }

  _createClass(IC, [{
    key: "load",
    value: function load(unparsedInstructions) {
      var lineByLineInstructions = unparsedInstructions.split(NEWLINE);

      this._instructions = [];
      this._literalRegister = [];
      var errors = [];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = lineByLineInstructions.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              i = _step$value[0],
              instruction = _step$value[1];

          var trimmedInstruction = instruction.split("//", 1)[0].trim().toLowerCase();

          if (trimmedInstruction.length == 0) {
            continue;
          }

          var splitInstruction = trimmedInstruction.split(INSTRUCTION_SEPERATOR);

          var opCode = splitInstruction.shift();

          var valid = true;

          if (KNOWN_OPCODES.hasOwnProperty(opCode)) {
            if (this._instructions.length >= MAXIMUM_INSTRUCTIONS) {
              valid = false;
              errors.push({ "line": i + 1, "error": "TOO_MANY_INSTRUCTIONS" });
            }

            var fieldCount = KNOWN_OPCODES[opCode];

            if (splitInstruction.length != fieldCount) {
              valid = false;
              errors.push({ "line": i + 1, "error": "FIELD_COUNT_MISMATCH" });
            } else {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = splitInstruction.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var _step2$value = _slicedToArray(_step2.value, 2),
                      j = _step2$value[0],
                      field = _step2$value[1];

                  var type = field.charAt(0);

                  switch (type) {
                    case "i":
                      if (j == fieldCount - 1) {
                        valid = false;
                        errors.push({ "line": i + 1, "error": "READ_ONLY_REGISTER", "field": j });
                      }
                    // falls through

                    case "r":
                    case "o":
                      var stringNumber = field.slice(1);
                      var number = parseInt(stringNumber);
                      var maxValue = 0;

                      switch (type) {
                        case "i":
                          maxValue = INPUT_REGISTER_COUNT;
                          break;
                        case "o":
                          maxValue = OUTPUT_REGISTER_COUNT;
                          break;
                        case "r":
                          maxValue = INTERNAL_REGISTER_COUNT;
                          break;
                      }

                      if (number > maxValue - 1 || stringNumber.length == 0) {
                        valid = false;
                        errors.push({ "line": i + 1, "error": "OUT_OF_BOUND_REGISTER", "field": j });
                      }
                      break;

                    default:
                      var parsedField = Number.parseFloat(field);

                      if (!Number.isNaN(parsedField)) {
                        if (j == fieldCount - 1) {
                          valid = false;
                          errors.push({ "line": i + 1, "error": "READ_ONLY_REGISTER", "field": j });
                        } else {
                          var newSize = this._literalRegister.push(parsedField);
                          splitInstruction[j] = "l" + (newSize - 1);
                        }
                      } else {
                        valid = false;
                        errors.push({ "line": i + 1, "error": "UNKNOWN_REGISTER", "field": j });
                      }
                  }
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
          } else {
            valid = false;
            errors.push({ "line": i + 1, "error": "UNKNOWN_INSTRUCTION" });
          }

          if (valid) {
            this._instructions.push({ "opCode": opCode, "fields": splitInstruction });
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

      return errors;
    }
  }, {
    key: "instructionCount",
    value: function instructionCount() {
      return this._instructions.length;
    }
  }, {
    key: "getInputRegisters",
    value: function getInputRegisters() {
      return this._inputRegister;
    }
  }, {
    key: "setInputRegister",
    value: function setInputRegister(index, value) {
      if (index < INPUT_REGISTER_COUNT) {
        this._inputRegister[index] = value;
      }
    }
  }, {
    key: "getOutputRegisters",
    value: function getOutputRegisters() {
      return this._outputRegister;
    }
  }, {
    key: "setOutputRegister",
    value: function setOutputRegister(index, value) {
      if (index < OUTPUT_REGISTER_COUNT) {
        this._outputRegister[index] = value;
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
    key: "_setRegister",
    value: function _setRegister(field, value) {
      var type = field.charAt(0);
      var number = parseInt(field.slice(1));

      switch (type) {
        case "i":
          return this.setInputRegister(number, value);
        case "r":
          return this.setInternalRegister(number, value);
        case "o":
          return this.setOutputRegister(number, value);
      }
    }
  }, {
    key: "_getRegister",
    value: function _getRegister(field) {
      var type = field.charAt(0);
      var number = parseInt(field.slice(1));

      switch (type) {
        case "i":
          return this.getInputRegisters()[number];
        case "r":
          return this.getInternalRegisters()[number];
        case "o":
          return this.getOutputRegisters()[number];
        case "l":
          return this._literalRegister[number];
      }
    }
  }, {
    key: "step",
    value: function step() {
      this._execute(this._instructions[this._programCounter]);
      this._programCounter++;

      return this._programCounter < this.instructionCount();
    }
  }, {
    key: "restart",
    value: function restart() {
      this._programCounter = 0;
    }
  }, {
    key: "_execute",
    value: function _execute(instruction) {
      switch (instruction["opCode"]) {
        case "sel":
          return this._execute_sel(instruction["fields"]);

        case "max":
          return this._execute_max(instruction["fields"]);
        case "min":
          return this._execute_min(instruction["fields"]);

        case "add":
          return this._execute_add(instruction["fields"]);
        case "sub":
          return this._execute_sub(instruction["fields"]);
        case "mul":
          return this._execute_mul(instruction["fields"]);
        case "div":
          return this._execute_div(instruction["fields"]);
        case "mod":
          return this._execute_mod(instruction["fields"]);

        case "eq":
          return this._execute_eq(instruction["fields"]);
        case "neq":
          return this._execute_neq(instruction["fields"]);
        case "gt":
          return this._execute_gt(instruction["fields"]);
        case "lt":
          return this._execute_lt(instruction["fields"]);

        case "ceil":
          return this._execute_ceil(instruction["fields"]);
        case "flor":
          return this._execute_flor(instruction["fields"]);
        case "abs":
          return this._execute_abs(instruction["fields"]);
        case "log":
          return this._execute_log(instruction["fields"]);
        case "exp":
          return this._execute_exp(instruction["fields"]);
        case "rou":
          return this._execute_rou(instruction["fields"]);
        case "rand":
          return this._execute_rand(instruction["fields"]);
        case "stor":
          return this._execute_stor(instruction["fields"]);
      }
    }
  }, {
    key: "_execute_sel",
    value: function _execute_sel(fields) {
      var compared = this._getRegister(fields[0]);
      var valueRegister = compared < 1.0 ? fields[1] : fields[2];
      this._setRegister(fields[3], this._getRegister(valueRegister));
    }
  }, {
    key: "_execute_max",
    value: function _execute_max(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      var maxValue = Math.max(valueOne, valueTwo);
      this._setRegister(fields[2], maxValue);
    }
  }, {
    key: "_execute_min",
    value: function _execute_min(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      var minValue = Math.min(valueOne, valueTwo);
      this._setRegister(fields[2], minValue);
    }
  }, {
    key: "_execute_add",
    value: function _execute_add(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      this._setRegister(fields[2], valueOne + valueTwo);
    }
  }, {
    key: "_execute_sub",
    value: function _execute_sub(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      this._setRegister(fields[2], valueOne - valueTwo);
    }
  }, {
    key: "_execute_mul",
    value: function _execute_mul(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      this._setRegister(fields[2], valueOne * valueTwo);
    }
  }, {
    key: "_execute_div",
    value: function _execute_div(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      this._setRegister(fields[2], valueOne / valueTwo);
    }
  }, {
    key: "_execute_mod",
    value: function _execute_mod(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      this._setRegister(fields[2], valueOne % valueTwo);
    }
  }, {
    key: "_execute_eq",
    value: function _execute_eq(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      this._setRegister(fields[2], valueOne == valueTwo ? 1 : 0);
    }
  }, {
    key: "_execute_neq",
    value: function _execute_neq(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      this._setRegister(fields[2], valueOne != valueTwo ? 1 : 0);
    }
  }, {
    key: "_execute_gt",
    value: function _execute_gt(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      this._setRegister(fields[2], valueOne > valueTwo ? 1 : 0);
    }
  }, {
    key: "_execute_lt",
    value: function _execute_lt(fields) {
      var valueOne = this._getRegister(fields[0]);
      var valueTwo = this._getRegister(fields[1]);
      this._setRegister(fields[2], valueOne < valueTwo ? 1 : 0);
    }
  }, {
    key: "_execute_ceil",
    value: function _execute_ceil(fields) {
      var value = this._getRegister(fields[0]);
      this._setRegister(fields[1], Math.ceil(value));
    }
  }, {
    key: "_execute_flor",
    value: function _execute_flor(fields) {
      var value = this._getRegister(fields[0]);
      this._setRegister(fields[1], Math.floor(value));
    }
  }, {
    key: "_execute_abs",
    value: function _execute_abs(fields) {
      var value = this._getRegister(fields[0]);
      this._setRegister(fields[1], Math.abs(value));
    }
  }, {
    key: "_execute_log",
    value: function _execute_log(fields) {
      var value = this._getRegister(fields[0]);
      this._setRegister(fields[1], Math.log(value));
    }
  }, {
    key: "_execute_exp",
    value: function _execute_exp(fields) {
      var value = this._getRegister(fields[0]);
      this._setRegister(fields[1], Math.exp(value));
    }
  }, {
    key: "_execute_rou",
    value: function _execute_rou(fields) {
      var value = this._getRegister(fields[0]);
      this._setRegister(fields[1], Math.round(value));
    }
  }, {
    key: "_execute_rand",
    value: function _execute_rand(fields) {
      var value = this._getRegister(fields[0]);
      this._setRegister(fields[1], Math.random() * value);
    }
  }, {
    key: "_execute_stor",
    value: function _execute_stor(fields) {
      var value = this._getRegister(fields[0]);
      this._setRegister(fields[1], value);
    }
  }]);

  return IC;
}();