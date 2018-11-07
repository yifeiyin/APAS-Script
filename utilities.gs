function info(msg) {
  Logger.log("INFO: \t\t" + msg);
}

function debug(msg) {
  Logger.log("DEBUG: \t\t" + msg);
}

function error(msg) {
  Logger.log("ERROR: \t\t" + msg); // "! == ! == ! == ! == ! == ! == !"
}

function warning(msg) {
  Logger.log("WARNING: \t" + msg);
}

function assert(exp, msg) {
  if (!exp) {
    error(msg);
    var x = 1 / 0;
  }
}

function quotes(str) {
  return '"' + str + '"';
}

function cquotes(str) {
  return "「" + str + "」";
}

function startsWithHash(str) {
  return str.indexOf("#") == 0;
}


function _isTimeAlmostUp() {
  var now = new Date();
  return now.getTime() - _program_start_time.getTime() > 300000; // 5 minutes
}


function throwExceptionIfTimeIsAlmostUp() {
  if (_isTimeAlmostUp()) {
    throw "Time is almost up. Exiting.";
  }
}
