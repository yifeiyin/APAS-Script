
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
var allTeamNames

var teams

  // Role and Team must go together (error)
  // Everyone should have a name (error)
  // Everyone should have a role (warning)
  // Email address must be valid (warning)
  // Role must be one of "Member" or "Leader" (error)
  
  // Postponed: Team must be one of the names in the list (warning)



function test() {
  initializeMemberList()
  //printMemberList()
  FindAllTeamNames()
  InitializeTeams()
  printTeams()
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

// For debug only, print teams
function printTeams() {
  for (teamName in teams) {
    info("======== " + teamName + " ========")
    var theTeam = teams[teamName]
    
    info("    ---- Leaders " + String(theTeam.leaders.length) + " ----")
    for (var i = 0; i < theTeam.leaders.length; i++) 
      info("      " + theTeam.leaders[i]) 
    
    info("    ---- Members " + String(theTeam.members.length) + " ----")
    for (var i = 0; i < theTeam.members.length; i++) 
      info("      " + theTeam.members[i]) 
  }
  
}

function InitializeTeams() {
  teams = {}
  for (var i = 0; i < allTeamNames.length; i++) {
    theTeamName = allTeamNames[i]
    teams[theTeamName] = {}
    teams[theTeamName].leaders = []
    teams[theTeamName].members = []
    
    for (var iMember = 0; iMember < memberList.length; iMember++) {
      theMember = memberList[iMember]
      for (var iRole = 0; iRole < theMember.roles.length; iRole++) {
        if (theMember.roles[iRole].teamName == theTeamName) {
          var positionName = theMember.roles[iRole].position
          if (positionName == "Leader") {
            teams[theTeamName].leaders.push(theMember.name)
          } else if (positionName == "Member") {
            teams[theTeamName].members.push(theMember.name)
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
function initializeMemberList() {
  var mlss = SpreadsheetApp.openById(MEMBER_LIST_SPREADSHEET_ID)  // mlss - memeber list spreadsheet
  var mlssSheet = mlss.getSheets()[0]
  var mlssRange = mlssSheet.getRange(ACUTAL_VALUE_RANGE_MAX)
  
  assert(mlssRange != undefined, "cannot find the actual values range")
  var mlssValues = mlssRange.getValues()
  
  memberList = []
  
  for (var r = 0; r < mlssValues.length; r++) {
    // info("----" + r + " " + mlssValues[r][0])
    if (mlssValues[r][0] == "") {
      info("" + String(r-1) + " MEMBERS LOADED.")
      break
    }
    
    // Here, we defined what properties should member have
    var member = {}
    member.name = mlssValues[r][COL_NAME]
    member.email = mlssValues[r][COL_EMAIL]
    member.roles = []
    member.formLinks = []
    for (var i = 0; i < mlssValues[r][COL_NROLES]; i++) {
      var role = {}
      role.position = mlssValues[r][COL_ROLEANDTEAMSTARTS + i * 2]
      role.teamName = mlssValues[r][COL_ROLEANDTEAMSTARTS + i * 2 + 1]
      member.roles.push(role)
    }
    memberList.push(member)
  }
  
}


