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


var CURRENT_MONTH = "JAN";
var CURRENT_YEAR = "2019";
var CURRENT_DATE;
var CURRENT_MONTH_CN;
var _program_start_time;

var evaluationAspectsForMembers;
var evaluationAspectsForLeaders;
var evaluationRatings;

function prepareConstants() {
  _program_start_time = new Date();
  
  CURRENT_DATE = CURRENT_MONTH + CURRENT_YEAR;
  CURRENT_MONTH_CN = "一月";
  
  evaluationAspectsForMembers = ["完成度", "关怀度", "执行力", "计划性", "沟通力"];
  evaluationAspectsForLeaders = ["关怀度", "执行力", "计划性", "沟通力", "项目完成满意度"];
  evaluationRatings = ["N/A", "F", "C", "B-", "B", "B+", "A-", "A"];
  
}

/*
var memberlistName = "Testing, Member Info";
var teamlistName = "Testing, Teamlist";
var formFolderName = "forms";
var destinationSpreadsheetName = "Destination Spreadsheet";
var evaluationEntriesName = "Evaluation Entries";
var reportName = "Testing Report";
*/

var memberlistName = "v1 Memberlist Jan2019";
var teamlistName = "v1 Teamlist Jan2019";
var formFolderName = "v1 Forms Jan2019";
var destinationSpreadsheetName = "v1 Destination Spreadsheet Jan2019";
var evaluationEntriesName = "v1 Evaluation Entries Jan2019";
var reportName = "v1 Report Jan2019";



// Functions to call:
/*
mGenerateMemberlist(memberlistName);
mGenerateForms(memberlistName, formFolderName, destinationSpreadsheetName);
mGenerateEmails(memberlistName);
mSendEmails(memberlistName);
mCollectResults(memberlistName, evaluationEntriesName);
mPrintTeams(teamlistName);
*/

// TODO: Add functions for "resetting" things, such as reset email draft, reset and delete email draft, reset forms, etc
// TODO: Change the way pausing the program


function selector_0_GenerateMemberlist() { mGenerateMemberlist(memberlistName);                                                  }
function selector_0_PrintTeams()         { mPrintTeams(memberlistName, teamlistName);                                            }
function selector_1_GenerateForms()      { mGenerateForms(memberlistName, formFolderName, destinationSpreadsheetName);           }
function selector_2_GenerateEmails()     { mGenerateEmails(memberlistName);                                                      }
function selector_3_SendEmails()         { mSendEmails(memberlistName);                                                          }
function selector_4_CollectResults()     { mCollectResults(memberlistName, evaluationEntriesName);                               }
function selector_5_GenerateReport()     { mGenerateReport(memberlistName, evaluationEntriesName, reportName);                   }

function selector_x_CollectResultsAndGenerateReport() { mCollectResults(memberlistName, evaluationEntriesName); 
                                                        mGenerateReport(memberlistName, evaluationEntriesName, reportName); }









//