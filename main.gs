// super constants
var APAS_WORKING_FOLDER_ID = "1odbTvpwksnSYvZ8RapMSXKVHJQh3TBkf";



// // // // // // // // // // // // // // // // // // // // 

var DEBUG_MODE = true;

var CURRENT_MONTH = "OCT";
var CURRENT_YEAR = "2018";


// // // //


var CURRENT_MODE = "";
var CURRENT_DATE = "";

var _program_start_time;

function prepareConstants() {
  _program_start_time = new Date();
  if (DEBUG_MODE) { CURRENT_MODE = "debug"; } else { CURRENT_MODE = "deployed"; }
  
  CURRENT_DATE = CURRENT_MONTH + CURRENT_YEAR;
  CURRENT_MONTH_CN = "十月";
}

// // // // // // // // // // // // // // // // // // // // 

function openSpreadsheet(fileName) {
  possibleFiles = DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).getFilesByName(fileName);
  if (possibleFiles.hasNext()) {
    
    // Disregarding the result since we will return resultFile (which is a Spreadsheet object). 
    // This line is to "get the next file" and prepare for the assert statement which tests if there is another file with the same name.
    possibleFiles.next()    
    
    resultFile = SpreadsheetApp.openById(DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).getFilesByName(fileName).next().getId());
    assert(!possibleFiles.hasNext(), "Found another file with the same name: " + String(fileName));       // make sure there isn't another file with the same name
    return resultFile;
  } else {
    return undefined;
  }
}


function findOrCreateSpreadsheet(fileName) {
  var resultFile = openSpreadsheet(fileName);
  if (resultFile != undefined) {
    return resultFile;
  }

  // Did not find a existing file, creating a new one
  possibleFiles = DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).getFilesByName(fileName);
  var spreadsheet = SpreadsheetApp.create(fileName);
  var spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
  DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).addFile(spreadsheetFile);
  DriveApp.getRootFolder().removeFile(spreadsheetFile);
  resultFile = SpreadsheetApp.openById(DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).getFilesByName(fileName).next().getId());
  
  return resultFile;
}


//function findOrCreateDestinationSpreadsheet() {
//  const fileName = CURRENT_DATE + " - UTChinese APAS Raw Result"
//  resultSs = findOrCreateSpreadsheet(fileName)
//  info("func findOrCreateDestSs(): file: " + resultSs.getName())
//  return resultSs
//}


// // // // // // // // // // // // // // // // // // // // 

//function findAllGroups






// // // // // // // // // // // // // // // // // // // // 


function main() {
  prepareConstants()
  info("Hi")
  
  findOrCreateDestinationSpreadsheet()
  
  info("Bye")
}


// // // // // // // // // // // // // // // // // // // // 



