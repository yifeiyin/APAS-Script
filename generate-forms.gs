function generate_forms_main_test() {
  prepareConstants()
  
  //loadMemberList("__original__");
  loadMemberList("OCT2018 Forms-Generated Spreadsheet");
  
  folderName = "Forms"
  
  destinationSsFileName = CURRENT_DATE + " Form Responses Destination Spreadsheet"
  destinationSs = findOrCreateSpreadsheet(destinationSsFileName)
  
  try {
    generateForms(folderName, destinationSs)
  } catch (err) {
    warning(err)
  }
  
  saveMemberList(CURRENT_DATE + " Forms-Generated Spreadsheet")
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



function generateForms(folderName, destinationSsFile) {
  
  for (var iMember = 0; iMember < memberList.length; iMember++) { // Change the value to memberList.length
    throwExceptionIfTimeIsAlmostUp();
    
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
      
      var formFileName = CURRENT_DATE + " " + member.name;
      var possibleSuffix = member.roles.length > 1 ? " (" + role.teamName + ")" : "";

      var formTitle = member.name + possibleSuffix + " 多大中文" + CURRENT_MONTH_CN + "绩效评分";
      var formDescription = 
        "此问卷是程序自动为「" + member.name + "」生成的，发送到 " + member.email + "。\n" + 
          "如果你不是该人，请不要填写。\n\n" + 
            "如果名字、团队信息出现错误，请告知 Yvonne。\n" + 
              "如果想更改被显示的名字，" + 
                "或者有任何其他问题、意见或建议，可直接在钉钉上联系 Yifei。😜";
      var formConfirmationMessage = "谢谢使用。";
      
     
      var form = createForm(folderName, formFileName + possibleSuffix)
      form.setTitle(formTitle)
          .setDescription(formDescription)
          .setConfirmationMessage(formConfirmationMessage)
          .setAllowResponseEdits(true)
          .setAcceptingResponses(true)
          .setDestination(FormApp.DestinationType.SPREADSHEET, destinationSsFile.getId()); // this might not be necessary
      
      publishedUrl = form.shortenFormUrl(form.getPublishedUrl())
      role.link = publishedUrl
      
      
      if (role.position == "Leader") {
        _generateFormContentForLeader(form, member, role)
        
      } else if (role.position == "Member") {
        _generateFormContentForMember(form, member, role)
        
      } else { error("Unexpected position value: " + String(role.position)) }
    }
  }
}



function _generateFormContentForLeader(form, member, role) {
  var teamMemberNames = teamList[role.teamName].members;
  
  // Section 1...n: Rate for each member (5 categories for each member)
  {
    for (var memberi = 0; memberi < teamMemberNames.length; memberi++) {
      var memberName = teamMemberNames[memberi];
      
      var row_texts = ["完成度", "关怀度", "执行力", "计划性", "沟通力"];
      var column_texts = ["N/A", "F", "C", "B-", "B", "B+", "A-", "A"];
      
      var gridItem = form.addGridItem();
      var gridValidation = FormApp.createGridValidation().requireLimitOneResponsePerColumn().build();
      
      gridItem
      .setRequired(true)
      .setTitle(memberName)
      .setHelpText("给" + role.teamName + "的成员" + cquotes(memberName) + "打分")
      .setValidation(gridValidation);
      
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
    .setTitle("补充信息（可选）");
  }
}


function _generateFormContentForMember(form, member, role) {
  var teamLeaders = teamList[role.teamName].leaders
  
  // Section 1: Rate for the leader (5 categories)
  {
    var leaderName = teamLeaders[0]
    
    var row_texts = ["关怀度", "执行力", "计划性", "沟通力", "项目完成满意度"]
    var column_texts = ["N/A", "F", "C", "B-", "B", "B+", "A-", "A"]
    
    var gridItem = form.addGridItem()
    // var gridValidation = FormApp.createGridValidation().requireLimitOneResponsePerColumn().build() // One respones per COLUMN, should not be used here
    
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
    .setTitle("补充信息（可选）");
  }
}

