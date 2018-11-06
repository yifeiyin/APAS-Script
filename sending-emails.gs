function sending_emails_main() {
  prepareConstants();
  
  try { 
    prepareDraftForAll();
  } catch (err) {
    warn(err);
  }
  
  
}

function sendEmailForAll() {
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    throwExceptionIfTimeIsAlmostUp();
    
    var member = memberList[iMember];
    sendEmailFor(member);
  }
  
}

function sendEmailFor(member) {
  // TODO: Create a "email sent" status?
  // try if i can "blundle send" drafts in gmail, if so then don't need to do this
  
}

function prepareDraftForAll() {
  for (var iMember = 0; iMember < memberList.length; iMember++) {
    throwExceptionIfTimeIsAlmostUp();
    
    var member = memberList[iMember];
    prepareDraftFor(member);
  }
}
  



function deleteDraftFor(member) {
  if (member.draftId != undefined && ! member.draftId.startsWith("#")) {
    try {
      GmailApp.getDraft(member.draftId).deleteDraft();
    } catch (err) { warning(err); }
    member.draftId = undefined;
  }
}


function prepareDraftFor(member) {
  var links = [];
  
  for (var iRole = 0; iRole < member.roles.length; iRole++) {
    var link = member.roles[iRole].link;
    
    if (link != undefined && link != "" && link.startsWith("#"))
      links.push(link);
  }
  
  if (links.length == 0) {
    member.draftId = "# No links were provided";
    return;
  } 
  
  var recipient = member.email;
  var subject = "多大中文" + CURRENT_DATE_CN + "绩效评分";
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

  for (var iLink = 0; iLink < iLinks.length; iLink++)
    body += links[iLink] + "\n";
  
  
  
  body += "\n";
  body += "如果遇到任何技术问题（如链接打不开），请在钉钉上联系 Yifei。\n";
  body += "\n";
  body += "多大中文";
  
  
  
  var draft = GmailApp.createDraft(recipient, subject, body);
  member.draftId = draft.getId();
}


