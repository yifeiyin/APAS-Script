function generate_forms_main_test() {

}


function mGenerateForms(memberlistName, formFolderName, destinationSpreadsheetName) {
  prepareConstants();
  loadMemberList(memberlistName);    // Loads memberlist from the spreadsheet it saved to
  try { 
    generateForms(formFolderName, destinationSpreadsheetName);
  } catch (err) { 
    warning(err); 
    info("ANOTHER RUN IS NEEDED");
  }
  saveMemberList(memberlistName);    
  info("Exiting mGenerateForms");
}



function createForm(folderName, formName) {
  
  var doesFolderExist = DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).getFoldersByName(folderName).hasNext();
  if (!doesFolderExist) {
    // Creating a new folder
    DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).createFolder(folderName);
  }
  
  var form = FormApp.create(formName);
  var formFile = DriveApp.getFileById(form.getId());
  DriveApp.getFolderById(APAS_WORKING_FOLDER_ID).getFoldersByName(folderName).next().addFile(formFile);
  DriveApp.getRootFolder().removeFile(formFile);
  resultFile = FormApp.openById(
    DriveApp.getFolderById(APAS_WORKING_FOLDER_ID)
            .getFoldersByName(folderName).next()
            .getFilesByName(formName).next().getId()
    );
  
  return resultFile; 
}



function generateForms(folderName, destinationSsFileName) {
  var destinationSsFile = findOrCreateSpreadsheet(destinationSsFileName)
  
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    throwExceptionIfTimeIsAlmostUp(); // TODO: Change  
    
    var member = memberList[iMember];

    if (member.roles.length == 0) {
      info(quotes(member.name) + " has no roles. Skipping.");
      continue;
    }
    
    for (var iRole = 0; iRole < member.roles.length; iRole++) {
      var role = member.roles[iRole];
    
      // Don't generate a form if:
      // (1) The person does not have a role in any team (achieved in previous scope)
      // (2) The team the person is in has no members
      if (role.position == "Member" && teamList[role.teamName].leaders.length != 1) {
        role.link = "# Unexpected leader count";
        info(quotes(member.name) + " is in " + quotes(role.teamName) + " which has an unexpected leader count: "+ String(teamList[role.teamName].leaders.length) + ". Skipping.");
        continue;
      }
      
      if (role.position == "Leader" && teamList[role.teamName].members.length < 1) {
        role.link = "# No-member team";
        info(quotes(member.name) + " from " + quotes(role.teamName) + " is in a no-member team. Skipping.");
        continue;
      }
      
      if (role.link.length > 0) {
        info(quotes(member.name) + " from " + quotes(role.teamName) + " already has a link. Skipping.");
        continue;
      }
      
      info("Generating form for " + quotes(member.name) + " from " + quotes(role.teamName) + "...");
      
      var formFileName = CURRENT_DATE + " " + member.name;
      var possibleSuffix = member.roles.length > 1 ? " (" + role.teamName + ")" : "";

      var formTitle = member.name + possibleSuffix + " 多大中文" + CURRENT_MONTH_CN + "绩效评分";
      var formDescription = 
        "此问卷是程序自动为「" + member.name + "」生成的，发送到 " + member.email + "。\n" + 
          "如果你不是该人，请不要填写。\n\n" + 
            "如果名字、团队信息出现错误，请告知 Sandy。\n" + 
              "如果想更改被显示的名字，\n" + 
                "或者有任何其他问题、意见或建议，可直接在钉钉上联系 Yifei。\n\n" +
                  " 📱用手机填写时记得左右划一划看到所有选项哦！\n\n" + 
                    "A: 100%\nA-: 95%\nB+: 90%\nB: 85%\nB-: 80%\nC: 60%\nF: 20%\nN/A: 表示信息有误或其他特殊情况(请在钉钉上详细说明)\n";
      var formConfirmationMessage = "谢谢使用。";
      
     
      var form = createForm(folderName, formFileName + possibleSuffix)
      form.setTitle(formTitle)
          .setDescription(formDescription)
          .setConfirmationMessage(formConfirmationMessage)
          .setAllowResponseEdits(true)
          .setAcceptingResponses(true)
          .setDestination(FormApp.DestinationType.SPREADSHEET, destinationSsFile.getId()); // this might not be necessary
      
      publishedUrl = form.shortenFormUrl(form.getPublishedUrl());
      role.link = publishedUrl;
      role.formId = form.getId();
      
      if (role.position == "Leader") {
        _generateFormContentForLeader(form, member, role);
        
      } else if (role.position == "Member") {
        _generateFormContentForMember(form, member, role);
        
      } else { error("Unexpected position value: " + String(role.position)); }
    }
  }
}

/* NOTE THAT: These variables are already initialized in prepareConstants.
var evaluationAspectsForMembers = ["完成度", "关怀度", "执行力", "计划性", "沟通力"];
var evaluationAspectsForLeaders = ["关怀度", "执行力", "计划性", "沟通力", "项目完成满意度"];
var evaluationRatings = ["N/A", "F", "C", "B-", "B", "B+", "A-", "A"];
*/

function _generateFormContentForLeader(form, member, role) {
  var teamMemberNames = teamList[role.teamName].members;
  
  // Section 1...n: Rate for each member (5 categories for each member)
  {
    for (var memberi = 0; memberi < teamMemberNames.length; memberi++) {
      var memberName = teamMemberNames[memberi];
      
      var row_texts = evaluationAspectsForMembers;
      var column_texts = evaluationRatings;
      
      var gridItem = form.addGridItem();
      
      gridItem
      .setRequired(true)
      .setTitle(memberName)
      .setHelpText("给" + role.teamName + "的成员" + cquotes(memberName) + "打分");
      // .setValidation(gridValidation);
      
      gridItem
      .setColumns(column_texts)
      .setRows(row_texts);
    }
  }
  
  // Section n+1: Bonus
  {
    var checkBoxItem = form.addCheckboxItem();
    
    // Title, Help text, etc
    checkBoxItem
    .setRequired(false)
    .setTitle("Bonus")
    .setHelpText("突发事件参与度，额外10%");
    
    // Core Information
    checkBoxItem
    .setChoiceValues(teamMemberNames);
  }
  

  // Section n+2: Additional Comments
  {
    var paraTextItem = form.addParagraphTextItem();
    paraTextItem
    .setRequired(false)
    .setTitle("给社团的建议")
    .setHelpText("如果对社团或部门的工作有任何建议，请在这里留下你的想法");
  }
}


function _generateFormContentForMember(form, member, role) {
  var teamLeaders = teamList[role.teamName].leaders
  
  // Section 1: Rate for the leader (5 categories)
  {
    var leaderName = teamLeaders[0];
    
    var row_texts = evaluationAspectsForLeaders;
    var column_texts = evaluationRatings;
    
    var gridItem = form.addGridItem();
    
    gridItem
    .setRequired(true)
    .setTitle(leaderName)
    .setHelpText("给" + role.teamName + "的 leader " + cquotes(leaderName) + "打分")
    
    gridItem
    .setColumns(column_texts)
    .setRows(row_texts);
  }
  
  // Section 2: Additional Comments
  {
    var paraTextItem = form.addParagraphTextItem();
    paraTextItem
    .setRequired(false)
    .setTitle("给社团的建议")
    .setHelpText("如果对社团或部门的工作有任何建议，请在这里留下你的想法");
  }
}

