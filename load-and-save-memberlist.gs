var MEMBER_LIST_SPREADSHEET_ID = "1DBOwXwiabXztEtyDMEFwT-ksjGx9UQOc-LVRCZpWH60";

// Constant for how much information will each member get. The width may also be limited to ACTUAL_VALUE_RANGE_MAX
var COLUMN_MAX = 11;

// Constant for where is the actual value range in the raw spreadsheet. The width may also be limited to COLUMN_MAX
var ACUTAL_VALUE_RANGE_MAX = "B9:Z111";

// Constants for which column number something is in the raw spreadsheet, in case we change the layout of the raw spreadsheet
var COL_EMAIL = 0;
var COL_NAME = 4;
var COL_NROLES = 6;
var COL_ROLEANDTEAMSTARTS = 7;

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
       role.position     // String, "Leader" or "Member"
       role.teamName     // String

    ========== allTeamNames ==========
    An array of Strings. Each stores a "team name".

    ========== teamList ==========
    A dictionary:
    keys:        String, teamName
    values:      object team
        team.leaders    // Array of String, leaders' names
        team.members    // Array of String, members' names

*/


function load_and_save_main_test() {
  prepareConstants();
  
  var fileName = CURRENT_DATE + " Working Spreadsheet";

  loadMemberList("__original__");
  validateMemberList();
  printTeams();
//  saveMemberList(fileName);
//  
//  loadMemberList(fileName);
//  saveMemberList("test 4");
};


function loadMemberList(from) {
  info("Loading " + quotes(from) + "...")
  
  if (from == "__original__") {
    loadMemberListFromOriginalSource();
  } else if (from[0] != "_") {
    loadWorkingSpreadsheet(from);
  } else {
    error("in loadMemberList, unexpected value: " + quotes(String(from)));
    return;
  }
  FindAllTeamNames();
  InitializeTeams();
  
  info( String(memberList.length) + " members loaded from file " + quotes(from) + "and, " )
  info( String(allTeamNames.length) + " teams were found.")
}


function saveMemberList(fileName) {
  saveWorkingSpreadsheet(fileName)
}


function loadWorkingSpreadsheet(fileName) {
  var ss = openSpreadsheet(fileName)
  var sheet = ss.getSheets()[0];
  
  var dataRange = sheet.getDataRange();
  
  //
  // [!] Notice: Code below are dupilicated from function loadMemberListFromOriginalSource()
  //
  assert(dataRange != undefined, "cannot find the actual values range")
  var mlssValues = dataRange.getValues()
  mlssValues.shift(); // Removing the first row
  
  memberList = [];
  
  for (var r = 0; r < mlssValues.length; r++) {
    var member = {};
    member.name = mlssValues[r][1];
    member.email = mlssValues[r][0];
    member.roles = [];
    
    for (var i = 0; mlssValues[r][2 + i * 3]; i++) {
      var role = {};
      role.position = mlssValues[r][2 + i * 3 + 0];
      role.teamName = mlssValues[r][2 + i * 3 + 1];
      role.link     = mlssValues[r][2 + i * 3 + 2] == undefined? "" : mlssValues[r][2 + i * 3 + 2];
      member.roles.push(role);
    }
    memberList.push(member);
  }
}



function saveWorkingSpreadsheet(fileName) {
  var outputSs = findOrCreateSpreadsheet(fileName);
  
  var outputSheet = outputSs.getSheets()[0];
  outputSheet.clearContents()
  
  var _date = new Date();
  var _timeInfo = _date.toLocaleTimeString();
  outputSheet.appendRow(["Last Modified by script at ", _timeInfo]);
  
  
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    var member = memberList[iMember];
    var rowContent = [];
    
    rowContent.push(member.email);
    rowContent.push(member.name);
    
    for (var iRole = 0; iRole < member.roles.length; iRole++) {
      rowContent.push(member.roles[iRole].position);
      rowContent.push(member.roles[iRole].teamName);
      rowContent.push(member.roles[iRole].link);
    }
    
    outputSheet.appendRow(rowContent);
  }
}


// For debug only, print memberList
function printMemberList() {
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    var theMember = memberList[iMember]
    var s = theMember.email + " " + theMember.name + ": "
    for (var i = 0; i < theMember.roles.length; i++) {
      s += String(theMember.roles[i].position) + " " + String(theMember.roles[i].teamName)
    }
    Logger.log(s)
  }
}

// For debug only, print teamList
function printTeams() {
  for (teamName in teamList) {
    info("======== " + teamName + " ========")
    var theTeam = teamList[teamName]
    
    info("    ---- Leaders " + String(theTeam.leaders.length) + " ----")
    for (var i = 0; i < theTeam.leaders.length; i++) 
      info("      " + theTeam.leaders[i]) 
    
    info("    ---- Members " + String(theTeam.members.length) + " ----")
    for (var i = 0; i < theTeam.members.length; i++) 
      info("      " + theTeam.members[i]) 
  }
}



function validateMemberList() {
  
  // Everyone should have a role
  for (var iMember = 0; iMember < memberList.length; iMember++) {
      if (memberList[iMember].roles.length == 0) {
        warning(quotes(memberList[iMember].name) + " has no roles.")
      }
  }
  
  // Every team should have only one leader and should have members
  for (var teamName in teamList) {
    var theTeam = teamList[teamName]
    
    if (theTeam.leaders.length == 0)
      warning(teamName + " has no leaders.")
      
    if (theTeam.leaders.length > 1)
      warning(teamName + " has " + String(theTeam.leaders.length) + " leaders.")
      
    if (theTeam.members.length == 0)
      warning(teamName + " has no members.")
    
    }
}



function InitializeTeams() {
  teamList = {}
  for (var i = 0; i < allTeamNames.length; i++) {
    theTeamName = allTeamNames[i]
    teamList[theTeamName] = {}
    teamList[theTeamName].leaders = []
    teamList[theTeamName].members = []
    
    for (var iMember = 0; iMember < memberList.length; iMember++) {
      theMember = memberList[iMember]
      
      for (var iRole = 0; iRole < theMember.roles.length; iRole++) {
        if (theMember.roles[iRole].teamName == theTeamName) {
          var positionName = theMember.roles[iRole].position
          if (positionName == "Leader") {
            teamList[theTeamName].leaders.push(theMember.name)
          } else if (positionName == "Member") {
            teamList[theTeamName].members.push(theMember.name)
          } else {
            error("Illegal position name: " + positionName)
          }
        }
      } // End for iRole
    } // End for iMember
  } // End for i
} // End function



// Initialize variable teamNames
function FindAllTeamNames() {
  allTeamNames = []
  
  // Looping through all the members
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    var theMember = memberList[iMember]
    var rolesCount = theMember.roles.length
    
    for (var i = 0; i < rolesCount; i++) {
      var positionName = theMember.roles[i].position
      var teamName = theMember.roles[i].teamName
      
      // Adding non-existing team names to the teamNames variable.
      if (allTeamNames.indexOf(teamName) < 0) { allTeamNames.push(teamName) }
    }
  }
}


// Initialize variable memberList
function loadMemberListFromOriginalSource() {
  var mlss = SpreadsheetApp.openById(MEMBER_LIST_SPREADSHEET_ID)  // mlss - member list spreadsheet
  var mlssSheet = mlss.getSheets()[0]
  var mlssRange = mlssSheet.getRange(ACUTAL_VALUE_RANGE_MAX)
  
  assert(mlssRange != undefined, "cannot find the actual values range")
  var mlssValues = mlssRange.getValues()
  
  memberList = []
  
  for (var r = 0; r < mlssValues.length; r++) {
    if (mlssValues[r][0] == "") {
      break
    }
    
    var member = {}
    member.name = mlssValues[r][COL_NAME]
    member.email = mlssValues[r][COL_EMAIL]
    member.roles = []
    for (var i = 0; i < mlssValues[r][COL_NROLES]; i++) {
      var role = {}
      role.position = mlssValues[r][COL_ROLEANDTEAMSTARTS + i * 2]
      role.teamName = mlssValues[r][COL_ROLEANDTEAMSTARTS + i * 2 + 1]
      role.link = ""
      member.roles.push(role)
    }
    memberList.push(member)
  }
  
}
