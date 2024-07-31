function registerUser(user){
    let newUser = {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name
    };

    addUserToTable(newUser);
}

function splitString(regex, input) {
  const matches = input.match(regex);
  //Logger.log(matches)

  // Перевіряємо, чи знайдено відповідність
  if (matches) {
    // Повертаємо групи як об'єкт
    return matches.filter(match => match !== undefined);
  } else {
    // Якщо відповідність не знайдено
    return null;
  }
}

