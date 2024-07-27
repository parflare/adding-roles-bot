function fetchReq(url, data) {
  const botSettings = readSettings();
  let response = UrlFetchApp.fetch(`https://api.telegram.org/bot${botSettings.token}/` + url, data);
  let contents = JSON.parse(response.getContentText());
  return contents.result || "";
}

function getChatMember(userId){
  let json = fetchReq(`getChatMember?chat_id=${getChatId()}&user_id=${userId}`, null);
  return json;
}

function getChatMembersCount(){
  let json = fetchReq(`getChatMembersCount?chat_id=${getChatId()}`, null);
  return json;
}

function getChatAdministrators(){
  let json = fetchReq(`getChatAdministrators?chat_id=${getChatId()}`, null);
  return json;
}