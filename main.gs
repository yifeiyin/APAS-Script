// super constants
var APAS_WORKING_FOLDER_ID = "1odbTvpwksnSYvZ8RapMSXKVHJQh3TBkf"



// // // // // // // // // // // // // // // // // // // // 

var DEBUG_MODE = true

var CURRENT_MONTH = "SEP"
var CURRENT_YEAR = "2018"


// // // //


var CURRENT_MODE = ""
var CURRENT_DATE = ""

function perpareConstants() {
  if (DEBUG_MODE) { CURRENT_MODE = "debug" } else { CURRENT_MODE = "deployed" }
  
  CURRENT_DATE = CURRENT_YEAR + CURRENT_MONTH
}

// // // // // // // // // // // // // // // // // // // // 


function findOrCreateDestinationSpreadsheet() {
  const fileName = CURRENT_DATE + " - UTChinese APAS Raw Result"

  possibleFiles = DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).getFilesByName(fileName)
  var resultFile = undefined
  if (possibleFiles.hasNext()) {
    resultFile = possibleFiles.next()
    assert(!possibleFiles.hasNext())
  } else {
    var spreadsheet = SpreadsheetApp.create(fileName)
    var spreadsheetFile = DriveApp.getFileById(spreadsheet.getId())
    DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).addFile(spreadsheetFile)
    DriveApp.getRootFolder().removeFile(spreadsheetFile)
    resultFile = DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).getFilesByName(fileName).next()
  }
  info("Destination Spreadsheet found: " + fileName)
  return resultFile
}


// // // // // // // // // // // // // // // // // // // // 

//function findAllGroups






// // // // // // // // // // // // // // // // // // // // 


function main() {
  perpareConstants()
  info("Hi")
  
  findOrCreateDestinationSpreadsheet()
  
  info("Bye")
}


// // // // // // // // // // // // // // // // // // // // 




