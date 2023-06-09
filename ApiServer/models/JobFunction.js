const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows = await db.query(`SELECT * from stastaticjobfunctions`);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM stastaticjobfunctions where JobFunctionId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetch,
  fetchById,
};
