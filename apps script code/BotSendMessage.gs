function sendMessageWithKeyb(text, inline_keyboard){
  const botSettings = readSettings();
  const url = `https://api.telegram.org/bot${botSettings.token}/sendMessage`;

  const payload = {
    method: "post",
    payload: {
      chat_id: getChatId(),
      text: text,
      reply_markup: JSON.stringify({
        inline_keyboard: inline_keyboard
      })
    },
    muteHttpExceptions: true
  };

  return UrlFetchApp.fetch(url, payload);
}

function setMessageReaction(messageId, emoji){
  const botSettings = readSettings();
  const url = `https://api.telegram.org/bot${botSettings.token}/setMessageReaction`;

  const payload = {
    method: 'post',
    payload: {
      chat_id: getChatId(),
      message_id: messageId,
      reaction: JSON.stringify([{
        type: 'emoji',
        emoji: emoji
    }])
    },
    muteHttpExceptions: true
  };

  return UrlFetchApp.fetch(url, payload);
}

function sendMessage(text){
  const botSettings = readSettings();
  const url = `https://api.telegram.org/bot${botSettings.token}/sendMessage`;

  const payload = {
    method: "post",
    payload: {
      chat_id: getChatId(),
      text: text,
      parse_mode: 'HTML'
    },
    muteHttpExceptions: true
  };

  return UrlFetchApp.fetch(url, payload);
}

function sendReplyMessage(messageId, text){
  const botSettings = readSettings();
  const url = `https://api.telegram.org/bot${botSettings.token}/sendMessage`;
  let chatId = getChatId();
  const payload = {
    method: "post",
    payload: {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      reply_parameters: JSON.stringify({
        message_id: messageId,
        chat_id: chatId
      })
    },
    muteHttpExceptions: true
  };

  return UrlFetchApp.fetch(url, payload);
}

function sendReplyMessageWithGif(messageId, text){
  const botSettings = readSettings();
  const url = `https://api.telegram.org/bot${botSettings.token}/sendDocument`;
  let chatId = getChatId();
  const payload = {
    method: "post",
    payload: {
      chat_id: chatId,
      caption: text,
      parse_mode: 'HTML',
      document: 'https://c.tenor.com/tFfv0x6qHH4AAAAC/tenor.gif',
      reply_parameters: JSON.stringify({
        message_id: messageId,
        chat_id: chatId
      })
    },
    muteHttpExceptions: true
  };

  return UrlFetchApp.fetch(url, payload);
}

function sendHelpMessage() {
  return sendMessage(`    
    <b>Available Commands:</b>

    <b>General Commands:</b>
    <b>/submsg</b> - Send a registration message.
    <b>/rolesmsg</b> - Send a message to obtain roles.
    <b>/userinfo @user</b> - Show information about a user. If no user is specified, it will show your information.
    <i>Example:</i> <code>/userinfo @username</code>
    <b>/roleslist</b> - Display the list of users by roles in the format: Role $(number in role)/$(total number): list.

    <b>Administrator Commands:</b>
    <b>/setrole @user role</b> - Assign a role to a specific user.
    <i>Example:</i> <code>/setrole @username Moderator</code>
    <b>/addrole role</b> - Add a new role to the table.
    <i>Example:</i> <code>/addrole NewRole</code>
    <b>/deleterole role</b> - Remove a role from the table.
    <i>Example:</i> <code>/deleterole OldRole</code>
    <b>/removerole</b> - Remove a role from yourself.
    <b>/updateusers</b> - Update user information.
    <b>/pingrole role</b> - Ping all members with a specific role.
    <b>/togglebotmode</b> - Enable or disable the ability to reassign roles to yourself.
  `);
}


function sendRegistrationMessage() {
  return sendMessageWithKeyb(
    "Click to register", 
        [
          [
            { text: "✅✍️ (registration)", callback_data: "register" }
          ],
          [
            { text: "🔈 (volume on)", callback_data: "receiving" },
            { text: "🔇 (volume off)", callback_data: "muted" }
          ]
        ]
  );

}

function sendGetRolesMessage() {
  //let roles = ssRoles.getRange('B2:B').getValues();
  let roles = getSS('Roles').getDataRange().getValues();
  roles.shift();

  //Logger.log(roles);

  let inlenKeyb = [];
  roles.forEach(data => {
    inlenKeyb.push([{text: data[1], callback_data: "getrole " + data[1]}]);
  });

  //Logger.log(inlenKeyb);
  if(roles.length === 0){
    sendMessage('No roles in table.');
    return false;
  }
  return sendMessageWithKeyb(
    "Click to get role", 
        inlenKeyb
  );

}