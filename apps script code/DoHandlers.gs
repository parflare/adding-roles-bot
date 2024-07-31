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

  if(messageText.includes('@adding_roles_bot')){ //переробити під поточний тег бота
    messageText = messageText.replace('@adding_roles_bot', '');
  }
  
  //let regex = /^[\/]([^\s]+)$|^[\/]([^\s]+)\s+([^\s]+)\s+(.+)$|^[\/]([^\s]+)\s+(.+)$/;
  const commandParts = messageText.match(/^\/(\w+)(?:\s+(.+))?$/);
  //Logger.log(commandParts);
  //const commandParts = splitString(regex, messageText);

  //Logger.log(commandParts);

  let command = commandParts[1];
  
  
  //let [command, ...rest] = messageText.split(' ');
  //rest = rest.join(' ');
  //Logger.log(command);
  
  switch (command) {
    case 'submsg':
      sendRegistrationMessage();
      break;
    case 'rolesmsg':
      sendGetRolesMessage();
      break;
    case 'setrole': 
      const newCommandParts = commandParts[2].match(/^(@\w+)\s+(.*)$/);
      setRoleToUser(user.id, newCommandParts[1], newCommandParts[2]);
      break;
    case 'addrole':
      addRoleToTable(user.id, commandParts[2]);
      break;
    case 'deleterole':
      deleteRoleInTable(user.id, commandParts[2]);
      break;
    case 'removerole':
      removeRoleById(user.id);
      //убрати роль собі по айдішніку
      break;
    case 'userinfo':
      if(commandParts[2]){
        getUserInfo(commandParts[2]);
      } else {
        getUserInfo(user.id);
      }
      //показати інфо про користувача (про себе якщо не вказан користувач)
      break;
    case 'roleslist':
      getRolesList();
      //показати список користувачів у ролях (у форматі Роль $(кількість у ролі)/$(кількість всього): список) БЕЗ ПІНГА, ПО НІКАМ
      break;
    case 'updateusers':
      //апдейт інфи про юзерів, автоматично, але можна і в ручну
      break;   
    case 'pingrole':
      //Пінг всіх з ролі
      break;    
    case 'togglereceive':
      //це вже є, кнопкою зроблено
      break;     
    case 'togglebotmode':
      //врубити чи вирубити можливість переназначення собі ролі (коли false - не можна убрати собі роль і вибрати іншу якщо вже є одна або взагалі не можна якщо це буде складніше)
      break;                  
    case 'help':
      //перелік всіх функцій з описом і форматом написання
      break;
    default:
      //повідомлення "Unknown comand"
      break;
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
  if (callback_query.data === "reveiving") {
    setPingStatus(user.id, true);
  }
  if (callback_query.data === "muted") {
    setPingStatus(user.id, false);
  }
  if (callback_query.data.startsWith("getrole")) {
    let role = callback_query.data.split(' ', 2);
    getRole(user.id, role[1]);
  }
}
