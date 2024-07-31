//const ssId = 'ss_token'
//const ss = SpreadsheetApp.openById(ssId)
//const ssSettings = ss.getSheetByName('settings')
//const ssUsers = ss.getSheetByName('Users')
//const ssRoles = ss.getSheetByName('Roles')
//const ssChats = ss.getSheetByName('chats')

function getSS(tableName){
  return SpreadsheetApp.openById('ss_token').getSheetByName(tableName);
}