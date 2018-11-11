function collect_result_main_test() {
  loadMemberList(workingSpreadsheetName);
  collectResults();

}

var evaluationEntries;

function collectResults() {
  evaluationEntries = [];
  
  /*
  Structure for: evaluationEntry:
  
  .timeStamp           // Date, the timeStamp of the response
  .teamName            // String, name of the team the person is in 
                       // (at this point, we assume that we can only evaluate persons in the same team)
  .evaluationBy        // String, name of the person filing the response
  .evaluationFor       // String, name of the person being evaluated
  .evaluations         // dictionary, aspect to rating (aspect: the category, rating: the mark)
  .comment             // String, correspond to the comment section in the form
  
  */
  
  
  resultStats = {};
  resultStats.totalFormsCount = 0;
  resultStats.noResponseCount = 0;
  
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    var member = memberList[iMember];
    
    resultStats.totalFormsCount += 1;
    
    for (var iRole = 0; iRole < member.roles.length; iRole++) {
      var role = member.roles[iRole];
      var link = role.link;
      if (link != undefined && link != "" && !startsWithHash(link)) {
        
        var formId = role.formId;
        assert(formId != "" && formId != undefined, "Unexpected formId: " + String(formId));
        
        var form = FormApp.openById(formId);
        var responses = form.getResponses();
        responses.sort(function(a, b) {return b.getTimestamp() - a.getTimestamp()});
        var latestResponse = responses[0];
        if (latestResponse == undefined) {
          info(quotes(member.name) + " from " + quotes(role.teamName) + "does not have a response.");
          resultStats.noResponseCount += 1;
          continue;
        }
        
        itemResponses = latestResponse.getItemResponses();
        debug(member.name + " " + role.position + " " + String(itemResponses.length));
        // We have got the latestResponse. Depending on its position, we will get the evaluationEntry repectively.
        if (role.position == "Member") {
          // We expect that the member will rate for its leader.

          
          
          
        } else if (role.position == "Leader") {
          // We expect that the leader will rate for each of its members.
          
        }
        
      }
    }
  }
  
}

