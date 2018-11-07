function sending_emails_main() {

  prepareConstants();
  
  restoreMemberData();
  validateMemberList();
  return;
  
  try { 
    generateDraftForAll();
  } catch (err) {
    warning(err);
  }
  info("Program is about to exit.")
  
  
  storeMemberData();
}


function sendEmailForAll() {
//  info("!! Comment this message out to send actual emails");
//  return;
  
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    throwExceptionIfTimeIsAlmostUp();
    // if (iMember > memberList.length / 2) { throw "test time out"; } // Testing time out
    var member = memberList[iMember];
    var emailOk = sendEmailFor(member);
    if (emailOk) {
      member.draftId = "# Sent";
      info("Email sent for " + quotes(member.name));
    }
  }
}



function sendEmailFor(member) {
  var draftId = member.draftId;
  
  if (draftId == undefined) { return false; }
  if (draftId == "") { return false; }
  if (startsWithHash(draftId)) { return false; }
  
  try {
    var draft = GmailApp.getDraft(draftId);
  } catch (err) { warning(err + quotes(draftId)); return false; }
  draft.send();
  return true;
}



function generateDraftForAll() {
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    throwExceptionIfTimeIsAlmostUp();

    var member = memberList[iMember];
    generateDraftFor(member);
  }
}
  



function deleteDraftFor(member) {
  if (member.draftId != undefined && ! startsWithHash(member.draftId)) {
    try {
      GmailApp.getDraft(member.draftId).deleteDraft();
    } catch (err) { warning(err); }
    member.draftId = undefined;
  }
}


function generateDraftFor(member) {
  var links = [];
  
  for (var iRole = 0; iRole < member.roles.length; iRole++) {
    var link = member.roles[iRole].link;
    
    if (link != undefined && 
        link != "" && 
        !startsWithHash(link)) {
      links.push(link);
    }
  }

  
  if (links.length == 0) {
    member.draftId = "# No links were provided";
    return;
  } 
  
  var recipient = member.email;
  var subject = "多大中文" + CURRENT_MONTH_CN + "绩效评分";
  var body = "";
  
  // TODO: Tell them the estimated time
  // TODO: Add a logo?
  
  body += member.name + "：\n";
  body += "\n";
  body += "请点击以下链接给你的小伙伴们打分";
  
  if (links.length == 1)
    body += ":\n";
  else
    body += "，你有 " + String(links.length) + " 个问卷需要填写：\n";
  
  
  body += "\n";

  for (var iLink = 0; iLink < links.length; iLink++)
    body += links[iLink] + "\n\n";
  
  
  
  body += "\n";
  body += "如果遇到任何技术问题，请在钉钉上联系 Yifei。\n";
  body += "\n";
  body += "多大中文";
  
  
  var draft = GmailApp.createDraft(recipient, subject, body);
  member.draftId = draft.getId();
}


