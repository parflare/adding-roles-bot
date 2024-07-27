function addUserToTable(user) {
  const data = ssUsers.getDataRange().getValues();
  const userIds = data.map(row => row[0]);
  const rowIndex = userIds.indexOf(user.userId);
  ssDebug.getRange(7,1).setValue(JSON.stringify(data));

  if (rowIndex === -1) {
    // Додавання нового користувача
    ssUsers.appendRow(
      [user.id, 
      user.username, 
      null,
      null, 
      user.first_name + (user.last_name ? (' ' + user.last_name) : ''),
      true,
      checkIsAdmin(user.id)]); 
  }
}

function setPingStatus(userId, value){
  const data = ssUsers.getDataRange().getValues();
  const userIds = data.map(row => row[0]);
  const rowIndex = userIds.indexOf(userId);
  if(rowIndex !== -1){
    ssUsers.getRange('E' + (rowIndex+1)).setValue(value);
  }
}

function checkIsAdmin(userId){
  var json = getChatMember(userId);

  ssDebug.getRange(1,4).setValue(JSON.stringify(json, null, 5));
  if(json.status === 'creator' || json.status === 'administrator'){
    return true;
  } else {
    return false;
  }
}

function getRegisteredMembersCount() {
  return ssUsers.getRange('A2:A').getLastRow();
}

function updateAdministrators() {
  var json = getChatAdministrators();

  ssDebug.getRange(1,5).setValue(JSON.stringify(json, null, 5)) 
  
  json.result.forEach(admin => {
    //const {}
  });
  
}