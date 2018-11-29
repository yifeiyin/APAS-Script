function unit_test_calculateMarksBaseOn() {
  prepareConstants();
  // unit_test_calculateMarkBaseOn_leader_e_member();
  unit_test_calculateMarkBaseOn_member_e_leader();
}

function constuctReducedEvaluationEntry(evaluationType, evaluations) {
    var obj = {};
    
    obj.timestamp = "2018-11-25T04:53:57.703Z";
    obj.teamName = "TEAM TEST";
    obj.evaluationType = evaluationType;
    obj.evaluatedBy = "Automated Evaluator";
    obj.evaluatedFor = "dummy";
    obj.evaluations = evaluations;
    obj.comment = "no comment";
    
    return obj;
}

function unit_test_calculateMarkBaseOn_leader_e_member() {
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      LEADER_E_MEMBER, 
      {"完成度":"A","关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","bonus":"Yes"} )
  );
  debug("all A + bonus: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      LEADER_E_MEMBER, 
      {"完成度":"A","关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","bonus":"No"} )
  );
  debug("all A no bonus: " + calculateMarksBaseOn(evalEntries));
  // ----------------   
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      LEADER_E_MEMBER, 
      {"完成度":"A","关怀度":"F","执行力":"F","计划性":"F","沟通力":"F","bonus":"No"} )
  );
  debug("~50%: " + calculateMarksBaseOn(evalEntries));
  // ----------------   
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      LEADER_E_MEMBER, 
      {"完成度":"N/A","关怀度":"F","执行力":"C","计划性":"B-","沟通力":"B","bonus":"Yes"} )
  );
  debug("with N/A + bonus: " + calculateMarksBaseOn(evalEntries));
  // ----------------   
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      LEADER_E_MEMBER, 
      {"完成度":"N/A","关怀度":"N/A","执行力":"N/A","计划性":"N/A","沟通力":"N/A","bonus":"Yes"} )
  );
  debug("all N/A + bonus: " + calculateMarksBaseOn(evalEntries));
  // ----------------   
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      LEADER_E_MEMBER, 
      {"完成度":"N/A","关怀度":"N/A","执行力":"N/A","计划性":"N/A","沟通力":"N/A","bonus":"No"} )
  );
  debug("all N/A no bonus: " + calculateMarksBaseOn(evalEntries));
  // ----------------    
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      LEADER_E_MEMBER, 
      {"完成度":"C","关怀度":"A","执行力":"A","计划性":"C","沟通力":"B+","bonus":"No"} )
  );
  debug("Some real data 1: " + calculateMarksBaseOn(evalEntries));
  // ----------------   
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      LEADER_E_MEMBER, 
      {"完成度":"A-","关怀度":"A","执行力":"B","计划性":"C","沟通力":"B","bonus":"Yes"} )
  );
  debug("Some real data 2: " + calculateMarksBaseOn(evalEntries));
  // ----------------  
}





// =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
// *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
// =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*





function unit_test_calculateMarkBaseOn_member_e_leader() {
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","项目完成满意度":"A"} )
  );
  debug("One entry, all A: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","项目完成满意度":"A"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","项目完成满意度":"A"} )
  );
  debug("2 entries, all A: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"B+","计划性":"B+","沟通力":"B+","项目完成满意度":"A-"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"C","执行力":"C","计划性":"B-","沟通力":"B+","项目完成满意度":"B"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A-","执行力":"B+","计划性":"A","沟通力":"A-","项目完成满意度":"A-"} )
  );
  debug("3 entries, real data: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"N/A","执行力":"A","计划性":"A","沟通力":"A","项目完成满意度":"A"} )
  );
  debug("One entry, with N/A: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"N/A","执行力":"N/A","计划性":"N/A","沟通力":"N/A","项目完成满意度":"N/A"} )
  );
  debug("One entry, all N/A: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"N/A","执行力":"N/A","计划性":"N/A","沟通力":"N/A","项目完成满意度":"N/A"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","项目完成满意度":"A"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","项目完成满意度":"A"} )
  );
  debug("3 entries, with one all N/A, rest all A: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"N/A","计划性":"N/A","沟通力":"N/A","项目完成满意度":"A"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"N/A","计划性":"A","沟通力":"A","项目完成满意度":"A"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","项目完成满意度":"N/A"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","项目完成满意度":"N/A"} )
  );
  debug("4 entries with some N/A: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A-","计划性":"A-","沟通力":"A-","项目完成满意度":"N/A"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"B+","执行力":"A-","计划性":"B-","沟通力":"B+","项目完成满意度":"N/A"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A","计划性":"A","沟通力":"N/A","项目完成满意度":"N/A"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"B-","执行力":"B","计划性":"B","沟通力":"B+","项目完成满意度":"A"} )
  );
  debug("4 entries, real data with some N/A, %fair: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"N/A","执行力":"N/A","计划性":"F","沟通力":"F","项目完成满意度":"C"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"N/A","执行力":"B-","计划性":"B-","沟通力":"F","项目完成满意度":"B-"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"C","计划性":"C","沟通力":"F","项目完成满意度":"C"} )
  );
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"F","计划性":"B-","沟通力":"F","项目完成满意度":"B"} )
  );
  debug("4 entries, real data with some N/A, %poor: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
  var evalEntries = [];
  evalEntries.push(
    constuctReducedEvaluationEntry(
      MEMBER_E_LEADER, 
      {"关怀度":"A","执行力":"A","计划性":"A","沟通力":"A","项目完成满意度":"A"} )
  );
  debug("template, all A: " + calculateMarksBaseOn(evalEntries));
  // ---------------- 
}