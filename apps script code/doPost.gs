//Logger = BetterLog.useSpreadsheet(ssId);

function doPost(e) {

  try {
  const update = JSON.parse(e.postData.contents);

   if (update.message) {
    handleMessage(update.message);
    return;
   }
   if (update.my_chat_member) {
    handleBotRightsChanged(update.my_chat_member);
    return;
   }
   if (update.callback_query) {
    handleCallbackQuery(update.callback_query);
    return;
   }

  } catch (err) {
    const ssId = 'ss_token'
    Logger = BetterLog.useSpreadsheet(ssId);
    err = (typeof err === 'string') ? new error(err) : err;
    Logger.log('%s: %s (line %s, file "%s"). Stack: "%s" . While processing %s.', err.name || '',
          err.message || '', err.lineNumber || '', err.fileName || '', err.stack || '', '');
    }

}