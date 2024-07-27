function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Bot functions')
    .addItem('Update settings', 'setParamsToBot')
    //.addItem('Load users', 'getChatMembers')
    .addSeparator()
    .addItem('Set Webhook', 'setWebHook')
    .addItem('Delete Webhook', 'deleteWebhook')
    .addToUi();
}