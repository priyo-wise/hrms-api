class sqlQuery {
  //Users
  userQuery() {
    usersInsert = "insert into users (Name, Email, Status) values (?, ?,?)";
    usersSelect = "select ID,Name, Email, Status from users";
    usersUpdate = "update users set Name = ?, Email = ? where ID = ?";
    usersDelete = "delete from users where ID = ?";
  }
}

module.exports = sqlQuery;
