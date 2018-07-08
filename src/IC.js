"use strict";

const NEWLINE = "\n";
const INSTRUCTION_SEPERATOR = " ";

const INPUT_REGISTER_COUNT = 3;
const OUTPUT_REGISTER_COUNT = 3;
const INTERNAL_REGISTER_COUNT = 5;
const MAXIMUM_INSTRUCTIONS = 10;

const KNOWN_OPCODES = { 
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

module.exports = class IC {  
  constructor() {
    this._instructions = [];
    this._programCounter = 0;
    this._inputRegister = Array(INPUT_REGISTER_COUNT).fill(0);
    this._outputRegister = Array(OUTPUT_REGISTER_COUNT).fill(0);
    this._internalRegister = Array(INTERNAL_REGISTER_COUNT).fill(0);
    this._literalRegister = [];
  }

  load(unparsedInstructions) {
    let lineByLineInstructions = unparsedInstructions.split(NEWLINE);
   
    this._instructions = [];
    this._literalRegister = [];
    let errors = [];

    for (const [i, instruction] of lineByLineInstructions.entries()) {
      let trimmedInstruction = instruction.split("//", 1)[0].trim().toLowerCase();

      if (trimmedInstruction.length == 0) {
        continue;
      }

      let splitInstruction = trimmedInstruction.split(INSTRUCTION_SEPERATOR);

      let opCode = splitInstruction.shift();

      let valid = true;

      if (KNOWN_OPCODES.hasOwnProperty(opCode)) {
        if (this._instructions.length >= MAXIMUM_INSTRUCTIONS) {
          valid = false;
          errors.push({ "line": i + 1, "error": "TOO_MANY_INSTRUCTIONS" });
        }
        
        let fieldCount = KNOWN_OPCODES[opCode];

        if (splitInstruction.length != fieldCount) {          
          valid = false;
          errors.push({ "line": i + 1, "error": "FIELD_COUNT_MISMATCH" });
        } else {
          for (const [j, field] of splitInstruction.entries()) {
            let type = field.charAt(0);

            switch(type) {              
            case "i":          
              if (j == (fieldCount - 1)) {
                valid = false;
                errors.push({ "line": i + 1, "error": "READ_ONLY_REGISTER", "field": j });
              }
              // falls through

            case "r":
            case "o":
              var stringNumber = field.slice(1);
              var number = parseInt(stringNumber);
              var maxValue = 0;

              switch(type) {
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

              if (number > (maxValue - 1) || stringNumber.length == 0) {
                valid = false;
                errors.push({ "line": i + 1, "error": "OUT_OF_BOUND_REGISTER", "field": j });
              }
              break;

            default:
              var parsedField = Number.parseFloat(field);

              if (!Number.isNaN(parsedField)) {
                if (j == (fieldCount - 1)) {
                  valid = false;
                  errors.push({ "line": i + 1, "error": "READ_ONLY_REGISTER", "field": j });
                } else {
                  let newSize = this._literalRegister.push(parsedField);
                  splitInstruction[j] = `l${newSize - 1}`;
                }
              } else {
                valid = false;
                errors.push({ "line": i + 1, "error": "UNKNOWN_REGISTER", "field": j });  
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

    return errors;
  }

  instructionCount() {
    return this._instructions.length;
  }

  getInstructions() {
    return this._instructions.map((instruction) => {
      let result = [];
      result[0] = instruction.opCode.toUpperCase();
      
      let demapped = instruction.fields.map((field) => {
        if (field.charAt(0) === "l") {
          return this._getRegister(field).toString();
        }
        return field;
      });

      result = result.concat(demapped);
      
      return result;
    });
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
    case "l":
      return this._literalRegister[number];
    }
  }

  step() {    
    this._execute(this._instructions[this._programCounter]);
    this._programCounter++;

    return this._programCounter < this.instructionCount();
  }

  restart() {
    this._programCounter = 0;
  }

  _execute(instruction) {
    switch(instruction["opCode"]) {
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

  _execute_sel(fields) {  
    let compared = this._getRegister(fields[0]);
    let valueRegister = (compared < 1.0 ? fields[1] : fields[2]);
    this._setRegister(fields[3], this._getRegister(valueRegister));
  }

  _execute_max(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    let maxValue = Math.max(valueOne, valueTwo);
    this._setRegister(fields[2], maxValue);
  }  

  _execute_min(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    let minValue = Math.min(valueOne, valueTwo);
    this._setRegister(fields[2], minValue);
  } 
  
  _execute_add(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    this._setRegister(fields[2], valueOne + valueTwo);
  } 

  _execute_sub(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    this._setRegister(fields[2], valueOne - valueTwo);
  } 

  _execute_mul(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    this._setRegister(fields[2], valueOne * valueTwo);
  } 

  _execute_div(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    this._setRegister(fields[2], valueOne / valueTwo);
  } 

  _execute_mod(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    this._setRegister(fields[2], valueOne % valueTwo);
  } 

  _execute_eq(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    this._setRegister(fields[2], valueOne == valueTwo ? 1 : 0);
  } 

  _execute_neq(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    this._setRegister(fields[2], valueOne != valueTwo ? 1 : 0);
  } 

  _execute_gt(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    this._setRegister(fields[2], valueOne > valueTwo ? 1 : 0);
  } 

  _execute_lt(fields) {  
    let valueOne = this._getRegister(fields[0]);
    let valueTwo = this._getRegister(fields[1]);
    this._setRegister(fields[2], valueOne < valueTwo ? 1 : 0);
  } 

  _execute_ceil(fields) {  
    let value = this._getRegister(fields[0]);
    this._setRegister(fields[1], Math.ceil(value));
  } 

  _execute_flor(fields) {  
    let value = this._getRegister(fields[0]);
    this._setRegister(fields[1], Math.floor(value));
  } 

  _execute_abs(fields) {  
    let value = this._getRegister(fields[0]);
    this._setRegister(fields[1], Math.abs(value));
  } 

  _execute_log(fields) {  
    let value = this._getRegister(fields[0]);
    this._setRegister(fields[1], Math.log(value));
  } 

  _execute_exp(fields) {  
    let value = this._getRegister(fields[0]);
    this._setRegister(fields[1], Math.exp(value));
  } 

  _execute_rou(fields) {  
    let value = this._getRegister(fields[0]);
    this._setRegister(fields[1], Math.round(value));
  } 

  _execute_rand(fields) {  
    let value = this._getRegister(fields[0]);
    this._setRegister(fields[1], Math.random() * value);
  } 
  
  _execute_stor(fields) {  
    let value = this._getRegister(fields[0]);
    this._setRegister(fields[1], value);
  } 
};
