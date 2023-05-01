const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows = await db.query(
    `SELECT t1.*,t2.MenuText ,t3.RoleName from MenuRole t1 join Menus t2 on t1.MenuId=t2.MenuId join StaticRoles t3 on t1.RoleId=t3.RoleId`
  );
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM MenuRole where MenuRoleId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const fetchMenu = async () => {
  const rows = await db.query(`SELECT * from Menus where Route is not null`);
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetch,
  fetchById,
  fetchMenu,
};
