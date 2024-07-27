function setWebHook(){
  const botSettings = readSettings();

  console.log(UrlFetchApp.fetch(`http://api.telegram.org/bot${botSettings.token}/setWebHook?url=${botSettings.webAppUrl}`).getContentText())
}

//зберігає базову інфу про чат при додаванні бота
function saveChatInfoIfNotSaved(chatId, groupName, groupType) {
  if(ssChats.getDataRange().getValues().length < 2){
  ssChats.appendRow([chatId, groupName, groupType]);
  }
}

function getChatId(){
  return ssChats.getRange('A2').getValue().toString();
}

function readSettings(){
  const data = ssSettings.getRange('A2:B').getValues();

  const jsonObject = data.reduce((obj, [key, value]) => {
  obj[key] = value;
  return obj;
  }, {});
  return jsonObject;
}

function deleteWebhook() {
  const botSettings = readSettings();
  
  console.log(UrlFetchApp.fetch(`https://api.telegram.org/bot${botSettings.token}/deleteWebhook`, {
    method: 'post'
  }));
}