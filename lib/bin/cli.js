#! /usr/bin/env node
"use strict";

require("isomorphic-fetch");

var _jsdom = require("jsdom");

var _jsdom2 = _interopRequireDefault(_jsdom);

var _chordify = require("../chordify");

var _chordify2 = _interopRequireDefault(_chordify);

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _package = require("../../package.json");

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function afterFetched(timerId, text) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(text);
  clearTimeout(timerId);
}

function log(msg, color) {
  var delimeter = '\n\n'; //new Array(url.length + 1).join('-');
  var string = "" + delimeter + msg + delimeter;
  process.stdout.write(color ? string[color] : string);
}

var warn = function warn(msg) {
  return log(msg, 'red');
};

function grabAndChordify(url) {
  var selector = arguments.length <= 1 || arguments[1] === undefined ? 'pre' : arguments[1];
  var pre = arguments[2];
  var after = arguments[3];
  var gutter = arguments[4];
  var debug = arguments[5];


  var dotsCount = 0;
  var isFetching = setTimeout(function tick() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    dotsCount = (dotsCount + 1) % 4;
    var dots = new Array(dotsCount + 1).join(".");
    process.stdout.write(("FETCHING" + dots).magenta);
    isFetching = setTimeout(tick, 500);
  }, 500);

  log("Trying to find some chords at:\n" + url.underline.cyan, '');

  function afterFetch() {}

  fetch(url).then(function (response) {
    var status = response.status;
    var statusText = response.statusText;


    if (response.status < 200 || response.status > 300) {
      throw status + " " + statusText;
    }

    afterFetched(isFetching, "FETCHED ".green.bold + (status + " " + statusText + "\n").green);

    return response.text();
  }).then(function (html) {
    _jsdom2.default.env(html, function (err, _ref) {
      var document = _ref.document;


      var results = [];
      var elements = document.querySelectorAll(selector);
      if (!elements.length) {
        log("NOT FOUND".bold.red + (" any elements matching selector \"" + selector + "\" in the document").red);
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var textContent = _step.value.textContent;

          // console.log(textContent);
          results.push((0, _chordify2.default)(textContent, pre, after, gutter, debug));
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

      results.forEach(function (result, i) {
        log(("RESULT " + (i + 1)).magenta.bold);
        log(result);
      });
    });
  }).catch(function (error) {
    afterFetched(isFetching, "FETCHING ERROR ".red.bold + (error + "\n").red);
  });
}

// concole.log(grabAndChordify(process.argv));

var FLAGS = {
  '--url': "URL where perform search for chords. Protocol must be provided",
  '--selector': "CSS selector for element(s) where chords live, default: \"pre\"",
  '--pre': "String to be placed before chord's target character. {chord} will be replaced with actual chord signature",
  '--after': "String to be placed after chord's target character. {chord} will be replaced with actual chord signature",
  '--gutter': "String to be appended to the end of after in chords-only lines",
  '--debug': "If set, outputs object with parsing info"
};

function getParam(flag) {
  var flagIndex = process.argv.indexOf(flag);
  var param = process.argv[flagIndex + 1];
  var paramProvided = flagIndex > 0 && typeof param !== 'undefined' && Object.keys(FLAGS).indexOf(param) < 0;

  return paramProvided ? param : undefined;
}

function getParams() {
  var params = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.keys(FLAGS)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var flag = _step2.value;

      var paramName = flag.replace(/^--?/, '');
      params[paramName] = getParam(flag);
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

  return params;
}

function cli() {
  var _getParams = getParams();

  var url = _getParams.url;
  var pre = _getParams.pre;
  var after = _getParams.after;
  var selector = _getParams.selector;
  var gutter = _getParams.gutter;
  var debug = _getParams.debug;


  var urlEx = "(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)?$";
  var urlReg = new RegExp(urlEx, 'gi');
  var withProtoReg = new RegExp("^https?:\\/\\/" + urlEx, 'gi');

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

function help() {
  var header = "\n\n  " + new Array(30).join(' ') + "CHORDIFY v" + _package2.default.version + "\n\n  ";
  var output = [header];
  for (var flag in FLAGS) {
    output.push(flag + ": " + FLAGS[flag]);
  }
  console.log(output.join('\n\n'));
}

if (process.argv.length < 3 || process.argv.indexOf('--help') > 0) {
  help();
} else {
  cli();
}