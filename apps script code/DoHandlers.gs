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
  //sendMessage(JSON.stringify(message))
  
  let user = message.from;

  let messageText = message.text;

  if(messageText.includes('@adding_roles_bot')){ //переробити під поточний тег бота
    messageText = messageText.replace('@adding_roles_bot', '');
  }
  
  const commandParts = messageText.match(/^\/(\w+)(?:\s+(.+))?$/);

  let command = commandParts[1];
  
  //let [command, ...rest] = messageText.split(' ');
  //rest = rest.join(' ');
  //Logger.log(command);
  let result;
  switch (command) {
    case 'submsg'://done
      result = sendRegistrationMessage();
      break;
    case 'rolesmsg'://done
      result = sendGetRolesMessage();
      break;
    case 'setrole': //admin only! done
      const newCommandParts = commandParts[2].match(/^(@\w+)\s+(.*)$/);
      result = setRoleToUser(message.message_id, user.id, newCommandParts[1], newCommandParts[2]);
      break;
    case 'addrole': //admin only! done
      result = addRoleToTable(message.message_id, user.id, commandParts[2]);
      break;
    case 'deleterole': //admin only! done
      result = deleteRoleInTable(message.message_id, user.id, commandParts[2]);
      break;
    case 'removerole': //admin only! done
      result = removeRoleById(message.message_id, user.id);
      //убрати роль собі по айдішніку
      break;
    case 'userinfo': //done
      if(commandParts[2]){
        result = getUserInfo(commandParts[2]);
      } else {
        result = getUserInfo(user.id);
      }
      //показати інфо про користувача (про себе якщо не вказан користувач)
      break;
    case 'roleslist': //done
      result = getRolesList();
      //показати список користувачів у ролях (у форматі Роль $(кількість у ролі)/$(кількість всього): список) БЕЗ ПІНГА, ПО НІКАМ
      break;
    case 'updateusers': //admin only!
      //апдейт інфи про юзерів, автоматично, але можна і в ручну
      break;   
    case 'pingrole': //admin only! done
      result = pingRole(message.message_id, user.id, commandParts[2]); //Готово
      //Пінг всіх з ролі
      break;    
    case 'togglereceive': //done
      //це вже є, кнопкою зроблено
      break;     
    case 'togglebotmode': //admin only! done
      result = toggleBotRoleSettingMode(message.message_id, user.id);
      //врубити чи вирубити можливість переназначення собі ролі (коли false - не можна убрати собі роль і вибрати іншу якщо вже є одна або взагалі не можна якщо це буде складно)
      break;                  
    case 'help':
      result = sendHelpMessage();
    break;
    default:
      //sendMessage("Unknown command")
      setMessageReaction(message.message_id, "🤨");
      break;
    }
    if(result !== undefined){
      setMessageReaction(message.message_id, result ? '👍' :  '👎');
    }
}



function handleCallbackQuery(callback_query) {

  let user = callback_query.from;
  if (callback_query.data === "register") {
    registerUser(user);
  }
  if (callback_query.data === "silence_register") {
    registerUser(user);
    setPingStatus(user.id, false);
  }
  if (callback_query.data === "receiving") {
    setPingStatus(user.id, true);
  }
  if (callback_query.data === "muted") {
    setPingStatus(user.id, false);
  }
  if (callback_query.data.startsWith("getrole")) {
    let role = callback_query.data.split(' ', 2);
    getRole(user.id, role[1], false);
  }
}
