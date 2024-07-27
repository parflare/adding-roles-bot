const ssId = 'Spreadsheet_ID'
const ss = SpreadsheetApp.openById(ssId)
const ssSettings = ss.getSheetByName('settings')
const ssDebug = ss.getSheetByName('debug')
const ssUsers = ss.getSheetByName('Users')
const ssRoles = ss.getSheetByName('Roles')
const ssChats = ss.getSheetByName('chats')
const ssModifiers = ss.getSheetByName('modifiers')
