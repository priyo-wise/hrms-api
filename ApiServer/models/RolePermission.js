const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows = await db.query(
    `SELECT t1.*,t2.Permission,t3.RoleName from rolepermissions t1 join StaticPermissions t2 on t1.PermissionId=t2.PermissionId join StaticRoles t3 on t1.RoleId=t3.RoleId`
  );
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM rolepermissions where RoleId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const remove = async (Roles) => {
  const rows = await db.query(
    `delete from rolepermissions where RoleId = ${Roles.RoleId}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  remove,
  fetch,
  fetchById,
};
