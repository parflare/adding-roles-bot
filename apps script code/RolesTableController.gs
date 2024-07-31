function addRoleToTable(userId, role) {
  if(!checkIsAdmin(userId)){
    return;
  }

  const rowIndex = checkIfRolePresentInTableByName(role);

  if (rowIndex === -1) {
    const idValues = getRolesDataRangeValues()
    const rolesIds = idValues.map(row => row[0]);

    const maxValue = Math.max(...rolesIds);
    getSS('Roles').appendRow([(maxValue + 1), role]); 
    sendMessage(`Role ${role} added.`);
  } else {
    sendMessage(`Role ${role} already exist.`);
  }

}

function getRolesList(){
  let usersData = getSS('Users').getDataRange().getValues();
  usersData.shift();

  const roleData = getRolesDataRangeValues();

  var rolesMap = {};
  for (var i = 0; i < roleData.length; i++) {
    var roleID = roleData[i][0]; 
    var roleName = roleData[i][1]; 
    rolesMap[roleID] = roleName;
  }
  rolesMap[0] = 'without role';
  const dict = {};

  roleData.forEach(role => dict[role[0]] = []);
  dict[0] = [];

  for(let a = 0; a < usersData.length; a++){
    let userChosenNickname = usersData[a][3];
    let userRoleId = usersData[a][2];

    if(!userRoleId){
      dict[0].push(userChosenNickname);
    } else {
      dict[userRoleId].push(userChosenNickname);
    }
  }
  let usersOverralNumber = getChatMembersCount();
  let text = '';
  for (const key in dict) {
    if(dict[key].length === 0){
      text += `\n<b><s>${rolesMap[key]} (${dict[key].length}/${usersData.length})</s></b>`
      continue;
    }
    let userNames = dict[key].join('\n');
    text += `\n<b>${rolesMap[key]} (${dict[key].length}/${usersData.length}):</b>\n\<code>${userNames}\</code>\n`
}
  text += `\n<b>Unregistered users: ${usersOverralNumber - usersData.length}</b>\n`
  sendMessage(text);

}

function deleteRoleInTable(userId, role) {
    if(!checkIsAdmin(userId)){
    return;
  }

  const rowIndex = checkIfRolePresentInTableByName(role);

  if (rowIndex === -1) {
    sendMessage(`Role ${role} doesn\`t exist.`);
  } else {
    //спочатку видалив, а потім шукаєм ID, геніально, виправлено
    updateRoles(getSS('Roles').getRange('A' + rowIndex).getValues());
    getSS('Roles').deleteRow(rowIndex);
    sendMessage(`Role ${role} removed.`);
  }
}

function getRoleByName(roleNameToFind){
  let roles = getSS('Roles').getDataRange().getValues();
  roles.shift();

  let id = -1;
  roles.forEach( data => {
    if(data[1] === roleNameToFind){
      id = data[0];
    }
  });
  return id;
}

function getRoleById(roleIdToFind){
  let roles = getSS('Roles').getDataRange().getValues();
  roles.shift();

  let name = null;
  roles.forEach( data => {
    if(data[0] === roleIdToFind){
      name = data[1];
    }
  });
  return name;
}

function checkIfRolePresentInTableByName(roleName){
  const data = getRolesDataRangeValues();
  const rolesNames = data.map(row => row[1]);
  const rowIndex = rolesNames.indexOf(roleName);

  if(rowIndex === -1){
    return rowIndex;
  }
  return rowIndex + 2;
}


function getRolesDataRangeValues(){
  const data = getSS('Roles').getDataRange().getValues();
  data.shift();
  return data;
}