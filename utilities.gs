function info(msg) {
  Logger.log("INFO: \t\t" + msg);
}

function debug(msg) {
  Logger.log("DEBUG: \t\t" + msg);
}

function error(msg) {
  Logger.log("ERROR: \t\t" + msg + "! == ! == ! == ! == ! == ! == !");
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

