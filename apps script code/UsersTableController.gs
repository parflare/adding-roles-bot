function addUserToTable(user) {
  //const data = getSS('Users').getDataRange().getValues();
  //const userIds = data.map(row => row[0]);
  const rowIndex = checkIfUserPresentInTable(user.id);

  if (rowIndex === -1) {
    // Додавання нового користувача
    getSS('Users').appendRow(
      [user.id, 
      '@' + user.username, 
      null, 
      user.first_name + (user.last_name ? (' ' + user.last_name) : ''),
      true,
      checkIsAdmin(user.id)]); 
  }

}

function setPingStatus(userId, value){
  const data = getSS('Users').getDataRange().getValues();
  const userIds = data.map(row => row[0]);
  const rowIndex = userIds.indexOf(userId);
  if(rowIndex !== -1){
    getSS('Users').getRange('E' + (rowIndex+1)).setValue(value);
  }
}

function getUserInfo(data){ //тег або айді
  let user;
  if(Number.isInteger(data)){ //айді
    user = getUserByIdIfPresent(data);
  } else {
    user = getUserByTagIfPresent(data); //текст
  }
  let userRole = getRoleById(user.roles);
  let text = `Nickname: ${user.chosenNickname}
Tag: ${user.userName}
Role: ${userRole === null ? 'none' : userRole}
Receiving: ${user.receiving}
Is admin: ${user.isAdmin}`;
  sendMessage(text);
}

function checkIsAdmin(userId){
  var json = getChatMember(userId);

  if(json.status === 'creator' || json.status === 'administrator'){
    return true;
  } else {
    return false;
  }
}

function getRole(userId, role){
  if(role === '' || getSS('settings').getRange('B9').getValue() === false){
    return;
  }

  let roleId = getRoleByName(role);


  if(roleId !== -1){
    sendMessage(`Role ${role} found.`);

    let rowIndex = checkIfUserPresentInTable(userId);
    //Logger.log('getRole: C' + rowIndex);
    getSS('Users').getRange('C' + rowIndex).setValue(roleId);
  } else {
    sendMessage(`Role ${role} not found.`);
  }
}

function setRoleToUser(userId, userTag, role){

  if(!checkIsAdmin(userId)){
    return;
  }

  let user = getUserByTagIfPresent(userTag);
  
  if (user) {
    getRole(user.userID, role);
  }

}



function getRegisteredMembersCount() {
  return getSS('Users').getRange('A2:A').getLastRow();
}

function updateAdministrators() {
  let json = getChatAdministrators();

  
  json.result.forEach(admin => {
    //const {}
  });
  
}

function getUserByIdIfPresent(id){
  const data = getSS('Users').getDataRange().getValues();

  const userIds = data.map(row => row[0]);
  const rowIndex = userIds.indexOf(id);

  if(rowIndex === -1){
    return null;
  }

  const row = getSS('Users').getRange((rowIndex + 1), 1, 1, getSS('Users').getLastColumn()).getValues()[0];

  return {
    userID: row[0],
    userName: row[1],
    roles: row[2],
    chosenNickname: row[3],
    receiving: row[4],
    isAdmin: row[5],
  };
}

function getUserByTagIfPresent(userTag){
  const data = getSS('Users').getDataRange().getValues();

  const userTags = data.map(row => row[1]);
  const rowIndex = userTags.indexOf(userTag);
  if(rowIndex === -1){
    return null;
  }

  const row = getSS('Users').getRange((rowIndex + 1), 1, 1, getSS('Users').getLastColumn()).getValues()[0];

  return {
    userID: row[0],
    userName: row[1],
    roles: row[2],
    chosenNickname: row[3],
    receiving: row[4],
    isAdmin: row[5],
  };
}

function removeRoleById(userId){
  let indexRow =  checkIfUserPresentInTable(userId);
  let replyMessage;
  if(indexRow === -1){
    replyMessage = `User with id ${userId} not registered`;
  } else {
    getSS('Users').getRange('C' + indexRow).setValue(null);
    replyMessage = `Role successfully removed`;
  }
  sendMessage(replyMessage);

}

function updateRoles(roleId){
  const userRolesId = getSS('Users').getRange('C2:C' + getSS('Users').getLastRow()).getValues();

  for (let a = 0; a < userRolesId.length; a++){
    //якогось фіга порівняння дає false, хоча дані норм ніби

    if(parseInt(userRolesId[a]) === parseInt(roleId)) {
      userRolesId[a] = null;
    }
  }
  getSS('Users').getRange('C2:C' + getSS('Users').getLastRow()).setValues(userRolesId);

}

function checkIfUserPresentInTable(userId){
  const data = getSS('Users').getDataRange().getValues();
  data.shift();
  const userIds = data.map(row => row[0]);
  const rowIndex = userIds.indexOf(userId);
  if(rowIndex === -1){
    return rowIndex;
  }
  return rowIndex + 2;
}