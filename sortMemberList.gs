MEMBER_LIST_SPREADSHEET_ID = "1DBOwXwiabXztEtyDMEFwT-ksjGx9UQOc-LVRCZpWH60"

function sortMemberList() {
  
  
}


function validateMemberList() {
  // Role and Team must go together (error)
  // Everyone should have a name (error)
  // Everyone should have a role (warning)
  // Email address must be valid (warning)
  // Role must be one of "Member" or "Leader" (error)
  
  // Postponed: Team must be one of the names in the list (warning)
  
  var mlss = SpreadsheetApp.openById(MEMBER_LIST_SPREADSHEET_ID)  // mlss - memeber list spreadsheet
  var mlssSheet = mlss.getSheets()[0]
  var mlssNamedRanges = mlssSheet.getNamedRanges()
  for (var i = 0; i < mlssNamedRanges.length; i++) {
    if (mlssNamedRanges[i].getName() == "ActualValues") {  // "ActualValues" is a named range in the spreadsheet
      var mlssRange = mlssNamedRanges[i].getRange()
    }
  }
  assert(mlssRange != undefined, "cannot find the actual values range")
  var mlssValues = mlssRange.getValues()
  
  for (var r = 0; r < mlssValues.length; r++) {
    info("----" + r)
    for (var c = 0; c < mlssValues[r].length; c++) {
      info(String(r) + " " + String(c) + mlssValues[r][c])
    }
  }
  
}


