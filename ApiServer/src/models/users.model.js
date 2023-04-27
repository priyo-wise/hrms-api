class users {
  constructor(dg) {
    this.dg = dg;
  }

  insertRecord(jsonData, callBack) {
    var usersInsert = "insert into users (Name, Email, Status) values (?, ?,?)";
    var params = [];
    params.push(jsonData["Name"]);
    params.push(jsonData["Email"]);
    params.push(jsonData["Status"]);
    this.dg.execute(usersInsert, params, callBack);
  }

  getRecords(resourceId, callBack) {
    var usersSelect = "select ID,Name, Email, Status from users";
    var sql = usersSelect;
    var params = [];
    if (resourceId != "") {
      sql = sql + " where ID = ?";
      params.push(resourceId);
    }
    this.dg.query(sql, params, callBack);
  }

  updateRecord(resourceId, jsonData, callBack) {
    var usersUpdate = "update users set Name = ?, Email = ? where ID = ?";
    var sql = usersUpdate;
    var params = [];
    params.push(jsonData["Name"]);
    params.push(jsonData["Email"]);
    params.push(resourceId);

    this.dg.execute(sql, params, callBack);
  }

  deleteRecord(resourceId, callBack) {
    var usersDelete = "delete from users where ID = ?";
    var sql = usersDelete;
    var params = [];
    params.push(resourceId);
    console.log("Delete Called", sql);
    this.dg.execute(sql, params, callBack);
  }
}

module.exports = users;
