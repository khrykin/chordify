import "isomorphic-fetch";

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function decorateCharWithChord(char, chord, pre, after, gutter='') {
  let preStr = pre.replace('{chord}', chord);
  let afterStr = after.replace('{chord}', chord);

  return`${preStr}${char}${afterStr}${gutter}`;
}

export function parse(string) {
  let lines = string.split('\n');
  let data = [];

  for (let index in lines) {
    const line = lines[index];
    const hasChords = /^\s*(([A-Z]{1}[a-z\d]*#?)(\s*\/\s*)?([A-Z]{1}#?)?\s*(?![a-z]))+$/.test(line)
    const isEmpty = /^\s*$/.test(line);

    let obj = {
      hasChords,
      isEmpty,
      line
    };

    if (hasChords) {
      obj.chords = [];
      const re = /(([A-Z]{1}[a-z\d]*#?)(\s*\/\s*)?([A-Z]{1}#?)?)/g;

      let chord;

      while (( chord = re.exec(line)) != null) {
        if (chord) {
          obj.chords[chord[0]] = chord.index;
        }
      }
    }

    data.push(obj);
  }
  return data;
}

export function grabAndChordify(url, cb) {
  return fetch(url)
  .then(response => response.text())
  .then(html => console.log(html))
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

export default function chordify(string, pre="{chord}", after="", gutter="&nbsp;") {
  const data = parse(string);

  let result = [];

  for (let index in data) {

    const obj = data[index];
    const prevObj = data[index - 1] || {};
    const nextObj = data[index + 1] || {};

    const { line, hasChords, isEmpty }  = obj;

    const chordsOnly = hasChords && nextObj.hasChords ||  hasChords && prevObj.hasChords;
    const afterHasChords = prevObj.hasChords && !chordsOnly && !isEmpty;

    if (afterHasChords) {
      let chords = prevObj.chords;

      let numberOfCharsAdded = 0;
      let editedLine = line;

      for (let chord in chords) {
        const index = numberOfCharsAdded + chords[chord];
        const stringToInsert = decorateCharWithChord(editedLine[index], chord, pre, after);

        editedLine = editedLine.splice(index, 1, stringToInsert);
        numberOfCharsAdded += stringToInsert.length - chord.length;
      }
      result.push(editedLine);
    } else {
      if (!hasChords) {
        result.push(line);
      } else if (!isEmpty && chordsOnly) {
        let newLine = "";
        for (let chord in obj.chords) {
          const stringToInsert = decorateCharWithChord('', chord, pre, after);
          newLine += stringToInsert;
        }
        result.push(newLine);
      }
    }
  }
  return result.join("\n");
}
