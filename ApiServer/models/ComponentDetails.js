const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows = await db.query(
    `SELECT cd.*,sp.PageName,sc.ComponentName from ComponentDetails cd join StaticPages sp on cd.PageId=sp.PageId join StaticComponents sc on cd.ComponentId=sc.ComponentId`
  );
  return helper.emptyOrRows(rows);
};

const fetchStaticPage = async () => {
  const rows = await db.query(`SELECT * from StaticPages`);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM ComponentDetails where ComponentDetailsId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetch,
  fetchById,
  fetchStaticPage,
};
