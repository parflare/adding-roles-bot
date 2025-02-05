function addUserToTable(user) {
  //const data = getSS('Users').getDataRange().getValues();
  //const userIds = data.map(row => row[0]);
  const rowIndex = checkIfUserPresentInTable(user.id);

  if (rowIndex === -1) {
    // Додавання нового користувача
    getSS('Users').appendRow(
      [user.id, 
      user.username ? '@' + user.username : user.id, 
      null, 
      user.first_name + (user.last_name ? (' ' + user.last_name) : ''),
      true,
      checkIsAdmin(user.id)]); 
      sendMessage(`User ${user.username ? user.username : 'without tag'} (${user.first_name + (user.last_name ? (' ' + user.last_name) : '')}) registered.`)
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
  if(user === null){
    return false;
  }
  let userRole = getRoleById(user.roles);
  let text = `Nickname: ${user.chosenNickname}
Tag: ${Number.isInteger(user.userName) ? 'No tag. Get one, dude..' : user.userName.slice(1)}
Role: ${userRole === null ? 'none' : userRole}
Receiving: ${user.receiving}
Is admin: ${user.isAdmin}`;
  sendMessage(text);
  return true;
}

function setChosenNickName(id, newChosenNickName){ //тег або айді
  if(newChosenNickName === '' || newChosenNickName === undefined){
    return false;
  }
  const ss = getSS('Users');
  const data = ss.getDataRange().getValues();
  const userIds = data.map(row => row[0]);
  const rowIndex = userIds.indexOf(id);
  if(rowIndex !== -1){
    ss.getRange('D' + (rowIndex+1)).setValue(newChosenNickName);
    return true;
  } else {
    sendMessage('Choose role pls.')
  }
  return false;
}

function getUserByNickName(data){ //тег або айді

  let user = getUserByChosenNickNameIfPresent(data); 
  
  if(user === null){
    return false;
  }

  let userRole = getRoleById(user.roles);

  let json = getChatMember(user.userID);
  
  let text = `Nickname: ${user.chosenNickname}
CurrenNickName: ${json.user.first_name}
Role: ${userRole === null ? 'none' : userRole}
Receiving: ${user.receiving}
Is admin: ${user.isAdmin}`;
  sendMessage(text);
  return true;
}

function checkIsAdmin(userId){
  var json = getChatMember(userId);

  if(json.status === 'creator' || json.status === 'administrator'){
    return true;
  } else {
    return false;
  }
}

function getRole(userId, role, adminRights){
  let user = getUserByIdIfPresent(userId);
  
  if(!adminRights){
    if(user.roles !== '' && getSS('settings').getRange('B9').getValue() === false){
      sendMessage("Denied");
      return false;
    }
  }

  if(role === ''){
    sendMessage('Type something...');
    return false;
  }

  let roleId = getRoleByName(role);


  if(roleId === user.roles){
    return false;
  }

  if(roleId !== -1){
    //sendMessage(`Role ${role} found.`);

    let rowIndex = checkIfUserPresentInTable(userId);
    getSS('Users').getRange('C' + rowIndex).setValue(roleId);
    sendMessage(`${user.chosenNickname} joined ${role}!`)

    return true;
  } else {
    //sendMessage(`Role ${role} not found.`);
    return false;
  }
}

function setRoleToUser(messageId, userId, userTag, role){

  if(!checkIsAdmin(userId)){
    sendReplyMessageWithGif(messageId,'Wait a minute... Who are you?');
    return false;
  }

  let user = getUserByTagIfPresent(userTag);
  //sendMessage(JSON.stringify(user, null, 5));

  if (user) {
    return getRole(user.userID, role, true);
  }

}

function getRegisteredMembersCount() {
  return getSS('Users').getRange('A2:A').getLastRow();
}

function updateUsersTableData(messageId, userId, auto){
  try{
  if(auto !== true && auto !== false){
    auto = true;
  }

  if(!auto){//auto - перевірка чи функція викликається автоматично чи вручну, тому тут вкладений
    if(!checkIsAdmin(userId)){
      sendReplyMessageWithGif(messageId, 'Wait a minute... Who are you?');
      return false;
    }
  }

  let ssUsers = getSS('Users');
  let useraDataRange = ssUsers.getDataRange();
  let oldUsersData = useraDataRange.getValues();
  oldUsersData.shift();

    let newUserName = [];
    let newUserStatus = [];

    for(let a = 0; a < oldUsersData.length; a++){
    let json = getChatMember(oldUsersData[a][0]);
    newUserName[a] = [json.user.username ? '@' + json.user.username : json.user.id];
    newUserStatus[a] = [statusToIsAdmin(json.status)];
  }

  ssUsers.getRange('B2:B' + useraDataRange.getLastRow()).setValues(newUserName);
  ssUsers.getRange('F2:F' + useraDataRange.getLastRow()).setValues(newUserStatus);

  return true;

  } catch(err){
    console.log(err);
    return false;
  }

}

function statusToIsAdmin(statusToCheck){
  if(statusToCheck === 'creator' || statusToCheck === 'administrator'){
    return true;
  } else {
    return false;
  }
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

  const userTags = data.map(row => row[1].toString());
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

function getUserByChosenNickNameIfPresent(chosenNickName){
  const data = getSS('Users').getDataRange().getValues();

  const userChosenNickNames = data.map(row => row[3].toString());
  const rowIndex = userChosenNickNames.indexOf(chosenNickName);

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

function removeRoleById(messageId, userId){
  if(!checkIsAdmin(userId)){
    if(getSS('settings').getRange('B9').getValue() === false){
      sendReplyMessage(messageId, "Denied");
      return false;
    }
  }

  let indexRow =  checkIfUserPresentInTable(userId);
  let res;
  if(indexRow === -1){
    sendMessage(`User with id ${userId} not registered`);
    res = false;
  } else {
    getSS('Users').getRange('C' + indexRow).setValue(null);
    res = true;
  }
  return res;

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