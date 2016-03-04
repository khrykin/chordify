'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.default = chordify;
String.prototype.splice = function (idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function parse(string) {
  var debug = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var lines = string.split('\n');
  var data = [];

  for (var index in lines) {
    var line = lines[index];
    var hasChordsReg = /^\s*(\[?([A-Z]{1}[a-z\d]*#?)(\s*\/\s*)?([A-Z]{1}#?)?\s*(?![a-z])\]?)+$/;
    var hasChords = hasChordsReg.test(line);
    var isEmpty = /^\s*$/.test(line);

    var obj = {
      hasChords: hasChords,
      isEmpty: isEmpty,
      line: line
    };

    if (hasChords) {
      obj.chords = [];
      var re = /(\[?([A-Z]{1}[a-z\d]*#?)(\s*\/\s*)?([A-Z]{1}#?)?\]?)/g;

      var chord = undefined;

      while ((chord = re.exec(line)) != null) {
        if (chord) {
          obj.chords[chord[0]] = chord.index;
        }
      }
    }

    data.push(obj);
  }
  debug && console.log(data);
  return data;
}

function decorateCharWithChord(char, chord, pre, after) {
  var gutter = arguments.length <= 4 || arguments[4] === undefined ? '' : arguments[4];

  var preStr = pre.replace('{chord}', chord);
  var afterStr = after.replace('{chord}', chord);

  if (/^\s?$/.test(char)) char = gutter;

  return '' + preStr + char + afterStr + gutter;
}

/**
Main chrodifying function
@param string {string} - string to inspect for chords
@param pre {string} - string to be placed before chord's target character
@param before {string} - string to be placed before chord's target character. `{chord}` will be replaced with actual chord signature.
@param after {string} - string to be placed after before chord's target character. `{chord}` will be replaced with actual chord signature.
@param gutter {string} - string to be appended to the end of `after` in chords-only lines

@returns output {string}
*/

function chordify(string) {
  var pre = arguments.length <= 1 || arguments[1] === undefined ? "{chord}" : arguments[1];
  var after = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
  var gutter = arguments.length <= 3 || arguments[3] === undefined ? "&nbsp;" : arguments[3];
  var debug = arguments[4];

  var data = parse(string, debug);

  var result = [];

  for (var index in data) {

    var obj = data[index];
    var prevObj = data[index - 1] || {};
    var nextObj = data[index + 1] || {};

    var line = obj.line;
    var hasChords = obj.hasChords;
    var isEmpty = obj.isEmpty;


    var chordsOnly = hasChords && nextObj.hasChords || hasChords && prevObj.hasChords;
    var afterHasChords = prevObj.hasChords && !chordsOnly && !isEmpty;

    if (afterHasChords) {
      var chords = prevObj.chords;

      var numberOfCharsAdded = 0;
      var editedLine = line;

      for (var chord in chords) {
        var _index = numberOfCharsAdded + chords[chord];
        var stringToInsert = decorateCharWithChord(editedLine[_index] || '', chord, pre, after);

        editedLine = editedLine.splice(_index, 1, stringToInsert);
        numberOfCharsAdded += stringToInsert.length - chord.length;
      }
      result.push(editedLine);
    } else {
      if (!hasChords) {
        result.push(line);
      } else if (!isEmpty && chordsOnly) {
        var newLine = "";
        for (var chord in obj.chords) {
          var stringToInsert = decorateCharWithChord('', chord, pre, after);
          newLine += stringToInsert;
        }
        result.push(newLine);
      }
    }
  }
  return result.join("\n");
}