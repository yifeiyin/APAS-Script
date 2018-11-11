// super constants
var APAS_WORKING_FOLDER_ID = "1odbTvpwksnSYvZ8RapMSXKVHJQh3TBkf";
var DATA_FILE_ID = "1658uFfruumW3MsmZ4SoCMYUhP233cF5etNlzNK5hfY4";

// See below for these three variables
var memberList;
var allTeamNames;
var teamList;

/*
    ========== memberList ==========
    An array of members. Each member has:
    .name                // String       
    .email               // String
    .roles               // Array of object role
    .draftId             // draft id of the email, this property could be undefined
       role.position     // String, "Leader" or "Member"
       role.teamName     // String
       role.link         // String, the link to the google form

    ========== allTeamNames ==========
    An array of Strings. Each stores a "team name".

    ========== teamList ==========
    A dictionary:
    keys:        String, teamName
    values:      object team
        team.leaders    // Array of String, leaders' names
        team.members    // Array of String, members' names
*/


// // // // // // // // // // // // // // // // // // // // 


var CURRENT_MONTH = "OCT";
var CURRENT_YEAR = "2018";
var CURRENT_DATE;
var CURRENT_MONTH_CN;
var _program_start_time;

function prepareConstants() {
  _program_start_time = new Date();
  
  CURRENT_DATE = CURRENT_MONTH + CURRENT_YEAR;
  CURRENT_MONTH_CN = "十月";
}

var workingSpreadsheetName = "Testing, Member Info";
var formFolderName = "forms";
var destinationSpreadsheetName = "Destination Spreadsheet";

//function main() {
//  prepareConstants();
//  
//  main__initialize();
//}


function main__initialize() {
  //
  // First Run
  //
  prepareConstants();
  
  loadMemberList("__original__");        // Loads member information from the original spreadsheet
  validateMemberList();                  // validates member list, looking for invalid email addresses, team structures
  saveMemberList(workingSpreadsheetName);    // Save memberlist to a new spreadsheet
  
}

function main__forms() {
  //
  // Generating Forms
  //
  prepareConstants();
  
  loadMemberList(workingSpreadsheetName);    // Loads memberlist from the spreadsheet it saved to
  try { 
    generateForms(formFolderName, destinationSpreadsheetName);
  } catch (err) { 
    warning(err); 
    info("ANOTHER RUN IS NEEDED");
  }
  saveMemberList(workingSpreadsheetName);    
  //storeMemberData();
}
  
function main__emails() {
  //
  // Generating Emails
  //
  //restoreMemberData();
  prepareConstants();
  
  loadMemberList(workingSpreadsheetName);
  try { 
    generateDraftForAll();
  } catch (err) { 
    warning(err); 
    info("ANOTHER RUN IS NEEDED");
  }
  //storeMemberData();
  saveMemberList(workingSpreadsheetName);
}

function main__send() {
  //
  // Sending Emails
  //
  //restoreMemberData();
  prepareConstants();
  
  loadMemberList(workingSpreadsheetName);
  try { 
    sendEmailForAll();
  } catch (err) { 
    warning(err); 
    info("ANOTHER RUN IS NEEDED");
  }
  //storeMemberData();
  saveMemberList(workingSpreadsheetName);
}



