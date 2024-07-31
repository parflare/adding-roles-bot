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

  UrlFetchApp.fetch(url, payload);
}

function updateMessage(){

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

  UrlFetchApp.fetch(url, payload);
}

function sendRegistrationMessage() {
  sendMessageWithKeyb(
    "Click to register", 
        [
          [
            { text: "✅✍️ (registration)", callback_data: "register" }
          ],
          [
            { text: "🔈 (volume on)", callback_data: "reveiving" },
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

  sendMessageWithKeyb(
    "Click to get role", 
        inlenKeyb
  );

}