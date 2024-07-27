function sendMessage(text, inline_keyboard){
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

function sendRegistrationMessage() {
  sendMessage(
    "Click to register", 
        [
          [
            { text: "✅✍️", callback_data: "register" }
          ]
        ]
  );

}

function testSendReceivingModeChoiserMessage() {
  sendMessage(
    "Choose ping mode", 
        [
          [
            { text: "🔈", callback_data: "reveiving" },
            { text: "🔇", callback_data: "muted" }
          ]
        ]
  );

}