#! /usr/bin/env node

import "isomorphic-fetch";
import  jsdom from "jsdom";

import chordify from '../chordify';
import colors from 'colors'

import pkg from '../../package.json';

function afterFetched(timerId, text) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(text);
  clearTimeout(timerId);
}

function log(msg, color) {
  const delimeter = '\n\n';//new Array(url.length + 1).join('-');
  const string = `${delimeter}${msg}${delimeter}`;
  process.stdout.write(color ? string[color] : string);
}


const warn = (msg) => log(msg, 'red');

function grabAndChordify(url, selector='pre', pre, after, gutter, debug) {

  let dotsCount = 0;
  let isFetching = setTimeout(function tick() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    dotsCount = (dotsCount + 1) % 4;
    let dots = new Array(dotsCount + 1).join(".");
    process.stdout.write(`FETCHING${dots}`.magenta);
    isFetching = setTimeout(tick, 500);
  }, 500);

  log(
    "Trying to find some chords at:\n" +
    url.underline.cyan, '');

  function afterFetch () {}

  fetch(url)
  .then(response => {

    const {
      status,
      statusText
    } = response;

    if (response.status < 200 || response.status > 300) {
      throw `${status} ${statusText}`;
    }

    afterFetched(isFetching, `FETCHED `.green.bold
      +  `${status} ${statusText}\n`.green);

    return response.text();
  })
  .then(html => {
    jsdom.env(html, (err, { document }) => {

      const results = [];
      const elements = document.querySelectorAll(selector);
      if ( !elements.length ) {
        log(`NOT FOUND`.bold.red +
          ` any elements matching selector "${selector}" in the document`.red
        );
      }
      for (let { textContent } of elements) {
        // console.log(textContent);
        results.push(chordify(textContent, pre, after, gutter, debug));
      }
      results.forEach((result, i) => {
        log(`RESULT ${i+1}`.magenta.bold);
        log(result);
      })
    });
  })
  .catch(error => {
    afterFetched(isFetching, `FETCHING ERROR `.red.bold
      +  `${error}\n`.red);
  });
}

// concole.log(grabAndChordify(process.argv));

const FLAGS = {
  '--url': "URL where perform search for chords. Protocol must be provided",
  '--selector': "CSS selector for element(s) where chords live, default: \"pre\"",
  '--pre': "String to be placed before chord's target character. {chord} will be replaced with actual chord signature",
  '--after': "String to be placed after chord's target character. {chord} will be replaced with actual chord signature",
  '--gutter': "String to be appended to the end of after in chords-only lines",
  '--debug': "If set, outputs object with parsing info",
};


function getParam(flag) {
  const flagIndex = process.argv.indexOf(flag);
  const param = process.argv[flagIndex + 1];
  const paramProvided
    = flagIndex > 0 &&
    typeof param !== 'undefined' &&
    Object.keys(FLAGS).indexOf(param) < 0;

  return paramProvided ? param : undefined;
}

function getParams() {
  let params = {};
  for (let flag of Object.keys(FLAGS)) {
    const paramName = flag.replace(/^--?/, '');
    params[paramName] = getParam(flag)
  }
  return params;
}

function cli() {

  const {
    url,
    pre,
    after,
    selector,
    gutter,
    debug
  } = getParams();


  const urlEx = `(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)?$`;
  const urlReg = new RegExp(urlEx, 'gi');
  const withProtoReg = new RegExp(`^https?:\\/\\/${urlEx}`, 'gi');

  if (!url) {
    warn('ERROR --url parameter must be provided');
    return;
  } else if (!url.match(urlReg)) {
    warn('ERROR invalid url');
    return;
  } else if (!url.match(withProtoReg)) {
    warn('ERROR protocol must be included in the url');
    return;
  }

  grabAndChordify(url, selector, pre, after, gutter, debug);

}

function help () {
  const header = `

  ${new Array(30).join(' ')}CHORDIFY v${pkg.version}

  `
  let output = [header];
  for ( let flag in FLAGS ) {
    output.push(`${flag}: ${FLAGS[flag]}`);
  }
  console.log(output.join('\n\n'))
}

if (process.argv.length < 3 || process.argv.indexOf('--help') > 0) {
  help();
} else {
  cli();
}
