function info(msg) {
  Logger.log("INFO: " + msg)
}

function debug(msg) {
  Logger.log("DEBUG: " + msg)
}

function error(msg) {
  Logger.log("ERROR: " + msg)
}

function assert(exp, msg) {
  if (!exp) {
    error(msg)
    var x = 1 / 0
  }
}