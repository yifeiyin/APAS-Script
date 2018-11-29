function generate_report_main_test() {
  prepareConstants();
  var reportName = "Testing Doc";
  reportDocument = findOrCreateDocument(reportName);
  
  appendToReport("89% (1) [!]");
  
  
}


var reportDocument = undefined;
function appendToReport(text) {
  assert(reportDocument != undefined, "Need to initialize report before write!");
  reportDocument.appendParagraph(text);
}

/* Recall some variable names:
memberList; allTeamNames; teamList;
*/
function mGenerateReport(memberlistName, evaluationEntriesName, reportName) {
  prepareConstants();
  loadMemberList(memberlistName);
  loadEvaluationEntries(evaluationEntriesName);
  reportDocument = findOrCreateDocument(reportName);
  
  for (var iTeamName = 0; iTeamName < allTeamNames.length; iTeamName++) {
    var teamName = allTeamNames[iTeamName];
    
    // Check time out here
    
    appendToReport("------------------------");
    appendToReport(teamName);
    
    var people = teamList[teamName].leaders.concat(teamList[teamName].members); // array.concat does not change exisiting arrays
    
    for (var iPeople = 0; iPeople < people.length; iPeople++) {
      var peopleName = people[iPeople];
      
      var entries = findEvaluationEntriesFor(peopleName);
      var mark = calculateMarksBaseOn(entries);
      appendToReport("    " + peopleName + Array(30 - peopleName.length > 0? 30 - peopleName.length : 0).join(' ') + " " + mark);
      
    }
  }
}

// Returns a list of "evaluationEntries"
function findEvaluationEntriesFor(peopleName) {
  result = [];
  for (var i = 0; i < evaluationEntries.length; i++) {
    if (evaluationEntries[i].evaluatedFor == peopleName)
      result.push(evaluationEntries[i]);
  }
  return result;
}

// Calculates marks for one person, based on the entries provided. Returns a string like this
// "89% (1) [!]", accordingly, is the mark, number of entries it is based on, and warnings if there is any
function calculateMarksBaseOn(evaluationEntries) {
  var mark = 0;
  var entriesCount = evaluationEntries.length;
  var warningMsg = "";
  
  if (entriesCount == 0) {
    return "--% (0)";
  }
  
  // short hand form
  var evals = evaluationEntries;
  
  // asserting the input is legal
  for (var i = 0; i < evals.length; i++) {
    assert(evals[i].teamName       == evals[0].teamName      , "teamName inconsistent: "         + evals[0].teamName       +" -> "+ evals[i].teamName      );
    assert(evals[i].evaluationFor  == evals[0].evaluationFor , "evaluationForame inconsistent: " + evals[0].evaluationFor  +" -> "+ evals[i].evaluationFor );
    assert(evals[i].evaluationType == evals[0].evaluationType, "evaluationType inconsistent: "   + evals[0].evaluationType +" -> "+ evals[i].evaluationType);
  }
  
  // ----------------
  /* Recall some variables:
    evaluationAspectsForMembers = ["完成度", "关怀度", "执行力", "计划性", "沟通力"];
    evaluationAspectsForLeaders = ["关怀度", "执行力", "计划性", "沟通力", "项目完成满意度"];
    evaluationRatings = ["N/A", "F", "C", "B-", "B", "B+", "A-", "A"];
  */
  var SUBevaluationAspectsForMembers = ["关怀度", "执行力", "计划性", "沟通力"];
  var ratingToMark = {"N/A":  0, 
                        "F"  : 10, 
                        "C"  : 60, 
                        "B-" : 80, 
                        "B"  : 85, 
                        "B+" : 90, 
                        "A-" : 95, 
                        "A"  :100};
  
  
  // -------------------------
  if (evals[0].evaluationType == LEADER_E_MEMBER) {
    assert(evals.length == 1);
    
    var markAccumulator = 0;
    var markCount = 0;
    
    // This category has special weight towards the final mark, deal with it first
    var rawMarkCompletion = evals[0].evaluations["完成度"];
    if (rawMarkCompletion == 'N/A') {
      warningMsg += "N/A: 完成度 ";
    } else {
      markCount += 4;
      markAccumulator += ratingToMark[rawMarkCompletion] * 4;
    }
    
    for (var i = 0; i < evals.length; i++) {
      for (var j = 0; j < SUBevaluationAspectsForMembers.length; j++) {
        var raw_mark = evals[i].evaluations[SUBevaluationAspectsForMembers[j]]; // A key error will be thrown if it is not right
        if (raw_mark != 'N/A') 
          markCount++;
        else 
          warningMsg += "N/A: " + SUBevaluationAspectsForMembers[j] + " ";
        markAccumulator += ratingToMark[raw_mark];
      }
    }
    
    
    if (markAccumulator == 0 || markCount == 0) {
      mark = '--';
    } else {
      var markSoFar = Math.round(markAccumulator / markCount);
      if (evals[0].evaluations['bonus'] == YES) {
        markSoFar += 10;
      }
      mark = String(markSoFar);
    }
    
  } // -------------------------
  else if (evals[0].evaluationType == MEMBER_E_LEADER) {
    
    // WARNING: TODO: Questionable code duplication
    var markAccumulator = 0;
    var markCount = 0;

    for (var i = 0; i < evals.length; i++) {
      for (var j = 0; j < evaluationAspectsForLeaders.length; j++) {
        var raw_mark = evals[i].evaluations[evaluationAspectsForLeaders[j]]; // A key error will be thrown if it is not right
        if (raw_mark != 'N/A') 
          markCount++;
        markAccumulator += ratingToMark[raw_mark];
      }
    }
    
    if (markAccumulator == 0 || markCount == 0) {
      mark = '--';
    } else {
      mark = String(Math.round(markAccumulator / markCount));
    }
    
    
  } else {
    assert(false, "Unexpected evaluationType: " + evals[0].evaluationType);
  }
  
  
  // ----------------
  var resultString = "";
  if (warningMsg.length > 0) warningMsg = "[!] " + warningMsg;
  entriesCount = "(" + entriesCount + ")";
  resultString = String(mark) + "% " + entriesCount + " " + warningMsg;
  return resultString;
}


