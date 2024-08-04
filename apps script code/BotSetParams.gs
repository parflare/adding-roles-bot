function fetchBotData(endpoint) {
  let json = readSettings();
  let response = UrlFetchApp.fetch(`https://api.telegram.org/bot${json.token}/${endpoint}`, { muteHttpExceptions: true });
  let contents = JSON.parse(response.getContentText());
  return contents.result || "";
}

function getCurrentValues() {
  return {
    name: fetchBotData('getMe').username || "",
    description: fetchBotData('getDescription').description || "",
    shortDescription: fetchBotData('getShortDescription').short_description || "",
    commands: JSON.stringify(fetchBotData('getMyCommands')) || "[]"
  };  
}

function setBotValue(endpoint, payload, newValue, currentValue) {
  if (JSON.stringify(newValue) === JSON.stringify(currentValue)) {
    return "Done";
  }
  let json = readSettings();
  
  let data = {
    method: "post",
    payload: {
      method: endpoint,
      ...payload
    },
    muteHttpExceptions: true
  };
  
  let response = JSON.parse(UrlFetchApp.fetch(`https://api.telegram.org/bot${json.token}/`, data).getContentText());
  return response.ok ? "Done" : `Failed ${'.' + response.description || ""}`;
}

function setParamsToBot() {
  let ssSettings = getSS(`settings`);
  ssSettings.getRange("C2:C").clearContent();
  
  let allData = ssSettings.getDataRange().getDisplayValues();
  let newName = allData[1][1];
  let newDescription = allData[2][1];
  let newShortDescription = allData[3][1];
  let newCommands = allData[4][1];

  let currentValues = getCurrentValues();
  
  let dataToPut = [
    [setBotValue("setMyName", { name: newName }, newName, currentValues.name)],
    [setBotValue("setMyDescription", { description: newDescription }, newDescription, currentValues.description)],
    [setBotValue("setMyShortDescription", { short_description: newShortDescription }, newShortDescription, currentValues.shortDescription)],
    [setBotValue("setMyCommands", { commands: newCommands }, newCommands, currentValues.commands)]
  ];

  ssSettings.getRange(2, 3, dataToPut.length, dataToPut[0].length).setValues(dataToPut);
}

function toggleBotRoleSettingMode(messageId, userId){
  if(checkIsAdmin(userId)){
    let ssSettings = getSS(`settings`);
    var parameter = !ssSettings.getRange('B9').getValue();

    ssSettings.getRange('B9').setValue(parameter);
    sendReplyMessage(messageId, 'Bot\'s role mode changed to: ' + parameter);
    return true;
  }
  return false;
}

