var LOG_FILE_ID = "1gaxnWeGbGk3RXzU0sCVySvOedm1ttZYqEciowK7eDg4";
var __first_log = true;
  
function _log(prompt, msg) {
  var sheet = SpreadsheetApp.openById(LOG_FILE_ID).getSheets()[0];
  if (__first_log) {
    __first_log = false;
    sheet.clearContents();
  }
  var date = new Date();
  sheet.appendRow([date, prompt, msg]);
}

function info(msg) {
  _log("info", msg);
  Logger.log("INFO: \t\t" + msg);
}

function debug(msg) {
  _log("debug", msg);
  Logger.log("DEBUG: \t\t" + msg);
}

function error(msg) {
  _log("error", msg);
  Logger.log("ERROR: \t\t" + msg);
}

function warning(msg) {
  _log("warning", msg);
  Logger.log("WARNING: \t\t" + msg);
}

function assert(exp, msg) {
  if (!exp)
    error("Assertion Failed: " + msg);
}

function quotes(str) { return '"' + str + '"'; }
function cquotes(str) { return "「" + str + "」"; }
function startsWithHash(str) { return str.indexOf("#") == 0; }
function getProperty(key) { return PropertiesService.getScriptProperties().getProperty(key); }
function setProperty(key, value) { return PropertiesService.getScriptProperties().setProperty(key, value); }


function _isTimeAlmostUp() {
  var now = new Date();
  var FIVE_MINS = 300000;
  var DEBUG_USE = 20 * 1000;
  return now.getTime() - _program_start_time.getTime() > DEBUG_USE; // 5 minutes
}


function throwExceptionIfTimeIsAlmostUp() {
  if (_isTimeAlmostUp()) {
    throw "Time is almost up. Exiting.";
  }
}
