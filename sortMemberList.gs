
var MEMBER_LIST_SPREADSHEET_ID = "1DBOwXwiabXztEtyDMEFwT-ksjGx9UQOc-LVRCZpWH60"

// Constant for how much information will each member get. The width may also be limited to ACTUAL_VALUE_RANGE_MAX
var COLUMN_MAX = 11

// Constant for where is the actual value range in the raw spreadsheet. The width may also be limited to COLUMN_MAX
var ACUTAL_VALUE_RANGE_MAX = "B9:Z111"

// Constants for which column number something is in the raw spreadsheet, in case we change the layout of the raw spreadsheet
var COL_EMAIL = 0
var COL_NAME = 4
var COL_NROLES = 6
var COL_ROLEANDTEAMSTARTS = 7

// Stores all info about members which is retrived directly from the raw spreadsheet
var memberList

// Stores all team names found in the raw spreadsheet
var teamNames


  // Role and Team must go together (error)
  // Everyone should have a name (error)
  // Everyone should have a role (warning)
  // Email address must be valid (warning)
  // Role must be one of "Member" or "Leader" (error)
  
  // Postponed: Team must be one of the names in the list (warning)



function test() {
  initializeMemberList()
  // printMemberList()
  FindAllTeamNames()
}


// For debug only, print memberList
function printMemberList() {
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    var theMember = memberList[iMember]
    var s = theMember[COL_EMAIL] + " " + theMember[COL_NAME] + ": "
    for (var iProperty = 7; iProperty < theMember.length; iProperty++) {
      s += String(theMember[iProperty]) + " "
    }
    Logger.log(s)
  }
}


// Initialize variable teamNames
function FindAllTeamNames() {
  teamNames = []
  
  // Looping through all the members
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    var theMember = memberList[iMember]
    var rolesCount = theMember[COL_NROLES]
    
    // Looping through the "roles and teams"
    for (var i = 0; i < rolesCount; i++) {
      var roleName = theMember[COL_ROLEANDTEAMSTARTS + i * 0]
      var teamName = theMember[COL_ROLEANDTEAMSTARTS + i * 0 + 1]
      
      // Adding non-existing team names to the teamNames variable.
      if (teamNames.indexOf(teamName) < 0) { teamNames.push(teamName) }
    }
  }
  
  for (var i = 0; i < teamNames.length; i++) {
    debug(String(i) + " " +  teamNames[i])
  }
}


// Initialize variable memberList
function initializeMemberList() {
  var mlss = SpreadsheetApp.openById(MEMBER_LIST_SPREADSHEET_ID)  // mlss - memeber list spreadsheet
  var mlssSheet = mlss.getSheets()[0]
  var mlssRange = mlssSheet.getRange(ACUTAL_VALUE_RANGE_MAX)
  
  assert(mlssRange != undefined, "cannot find the actual values range")
  var mlssValues = mlssRange.getValues()
  
  memberList = new Array(1)
  for (var r = 0; r < mlssValues.length; r++) {
    // info("----" + r + " " + mlssValues[r][0])
    if (mlssValues[r][0] == "") {
      info("" + String(r-1) + " MEMBERS LOADED.")
      break
    }
    memberList.length = r + 1
    memberList[r] = new Array(COLUMN_MAX)
    for (var c = 0; c < COLUMN_MAX; c++) {
      memberList[r][c] = mlssValues[r][c]
    }
  }
  
}


