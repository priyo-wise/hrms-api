const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows = await db.query(
    `SELECT sp.*,mns.MenuText from staticPages sp join Menus mns on sp.MenuId=mns.MenuId`
  );
  return helper.emptyOrRows(rows);
};

const fetchMenu = async () => {
  const rows = await db.query(`SELECT * from Menus `);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(`SELECT * FROM staticPages where PageId = ${id}`);
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetch,
  fetchById,
  fetchMenu,
};
