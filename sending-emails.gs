function sending_emails_main() {
  prepareConstants();
  
  prepareDraft("1");
}

function prepareDraft(member) {
  
  var links;
  
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
  info(draft.getId());
}


