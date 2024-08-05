function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Bot functions')
    .addItem('Update settings', 'setParamsToBot')
    .addItem('Update users', 'updateUsersTableData')
    .addSeparator()
    .addItem('Set Webhook', 'setWebHook')
    .addItem('Delete Webhook', 'deleteWebhook')
    .addToUi();
}