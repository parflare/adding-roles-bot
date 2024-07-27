Logger = BetterLog.useSpreadsheet(ssId);

function doPost(e) {

  try {
  const update = JSON.parse(e.postData.contents);
  ssDebug.getRange(1, 1).setValue(JSON.stringify(update, null, 5));

   if (update.my_chat_member) {
    handleBotRightsChanged(update.my_chat_member);
    return;
   }
   if (update.callbackQuery) {
    handleCallbackQuery(update.callbackQuery);
    return;
   }
   if (update.message) {
    handleMessage(update.message);
    return;
   }
  } catch (err) {
      err = (typeof err === 'string') ? new error(err) : err;
      Logger.log('%s: %s (line %s, file "%s"). Stack: "%s" . While processing %s.', err.name || '',
          err.message || '', err.lineNumber || '', err.fileName || '', err.stack || '', '');
    }

}