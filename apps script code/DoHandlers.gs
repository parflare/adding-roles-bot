//додає інфу про чат при додаванні бота
function handleBotRightsChanged(my_chat_member){
  let chat = my_chat_member.chat;
  let groupId = chat.id.toString();
  let groupName = chat.title;
  let groupType = chat.type;
  let botStatus = my_chat_member.new_chat_member.status;
  
  if (botStatus === 'member') {
    Logger.log(JSON.stringify(my_chat_member, null, 5));
    saveChatInfoIfNotSaved(groupId, groupName, groupType);
  }
}

function handleMessage(message) {

  let user = message.from;

  let messageText = message.text;

  let regex = /^[\/]([^\s]+)$|^[\/]([^\s]+)\s+([^\s]+)\s+(.+)$|^[\/]([^\s]+)\s+(.+)$/;

  const commandParts = splitString(regex, messageText);

  Logger.log(commandParts);

  let command = commandParts[1];
  if(command.includes('@adding_roles_bot')){
    command = command.replace('@adding_roles_bot', '');
  }
  Logger.log(command);

  switch (command) {
    case 'regmsg':
      sendRegistrationMessage();
      break;
    case 'getrole':
      //registerUser(user.id, user.username, user.first_name);
      break;
    case 'setrole':

      break;
    case 'addrole':

      break;
    case 'deleterole':

      break;
    case 'removerole':

      break;
    case 'looserole':

      break; 
    case 'userinfo':

      break;
    case 'roleslist':

      break;
    case 'updateusers':

      break;   
    case 'pingrole':

      break;    
    case 'togglereceive':

      break;     
    case 'togglebotmode':

      break;                  
    case 'help':

      break;
    default:

      break;
    }
}

function handleCallbackQuery(callbackQuery) {
  let user = callbackQuery.from;
  if (callbackQuery.data === "register") {
    registerUser(user);
  }
  if (callbackQuery.data === "reveiving") {
    setPingStatus(user.id, true);
  }
  if (callbackQuery.data === "muted") {
    setPingStatus(user.id, false);

  }
}
