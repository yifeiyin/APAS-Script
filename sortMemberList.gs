
var MEMBER_LIST_SPREADSHEET_ID = "1DBOwXwiabXztEtyDMEFwT-ksjGx9UQOc-LVRCZpWH60"
var COLUMN_MAX = 11
var ACUTAL_VALUE_RANGE_MAX = "B9:Z111"

var COL_EMAIL = 0
var COL_NAME = 4

var memberList

function sortMemberList() {
  
  
}

function test() {
  initializeMemberList()
  printMemberList()
}

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

function initializeMemberList() {
  // Role and Team must go together (error)
  // Everyone should have a name (error)
  // Everyone should have a role (warning)
  // Email address must be valid (warning)
  // Role must be one of "Member" or "Leader" (error)
  
  // Postponed: Team must be one of the names in the list (warning)
  
  var mlss = SpreadsheetApp.openById(MEMBER_LIST_SPREADSHEET_ID)  // mlss - memeber list spreadsheet
  var mlssSheet = mlss.getSheets()[0]
  var mlssRange = mlssSheet.getRange(ACUTAL_VALUE_RANGE_MAX)
  /*
  var mlssNamedRanges = mlssSheet.getNamedRanges()
  for (var i = 0; i < mlssNamedRanges.length; i++) {
    if (mlssNamedRanges[i].getName() == "ActualValues") {  // "ActualValues" is a named range in the spreadsheet
      var mlssRange = mlssNamedRanges[i].getRange()
    }
  }
  */
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


