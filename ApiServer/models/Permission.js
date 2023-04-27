const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows = await db.query(`SELECT * from staticPermissions`);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM staticPermissions  where PermissionId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetch,
  fetchById,
};
