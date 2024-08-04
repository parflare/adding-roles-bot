let senderChatId = ''; 

function doPost(e) {
  let update;
  try {
   update = JSON.parse(e.postData.contents);

   if (update.message) {
    senderChatId = update.message.chat.id.toString();
    //sendMessage(JSON.stringify(update.message, null, 5));
    if(checkChatId(senderChatId)){
      handleMessage(update.message);
    }
    return;
   }
   if (update.my_chat_member) {
    handleBotRightsChanged(update.my_chat_member);
    return;
   }
   if (update.callback_query) {
    senderChatId = update.callback_query.message.chat.id.toString();
    //sendMessage(JSON.stringify(update.callback_query.message.chat, null, 5));
    if(checkChatId(senderChatId)){
      handleCallbackQuery(update.callback_query);
    }
    return;
   }

  } catch (err) {
    const ssId = 'id';
    Logger = BetterLog.useSpreadsheet(ssId);
    err = (typeof err === 'string') ? new error(err) : err;
    Logger.log('%s: %s (line %s, file "%s"). Stack: "%s" . While processing %s.', err.name || '',
          err.message || '', err.lineNumber || '', err.fileName || '', err.stack || '', '');

    if(update.message){
      setMessageReaction(update.message.message_id, "👀");
    }      
    }

}