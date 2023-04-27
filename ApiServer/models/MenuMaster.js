const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows =
    await db.query(`SELECT Mnu.MenuId,Mnu.ParentId,Mnu.MenuText,Mnu.Route,Mnu.Icon ,  COALESCE(PrntMnu.MenuText,'-') AS 'ParentMenu'
    FROM menus AS Mnu LEFT JOIN menus AS PrntMnu on Mnu.ParentId = PrntMnu.MenuId `);
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
};

const fetchById = async (id) => {
  const rows = await db.query(`SELECT * FROM menus where MenuId = ${id}`);
  return rows.length > 0 ? rows[0] : {};
};

const fetchParent = async () => {
  return await db.query(
    `SELECT MenuText, MenuId FROM menus where route is null`
  );
};

module.exports = {
  fetch,
  fetchById,
  fetchParent,
};
