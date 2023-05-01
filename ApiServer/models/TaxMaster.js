const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows = await db.query(`SELECT * from TaxesMaster `);
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
};

const fetchById = async (id) => {
  const rows = await db.query(`SELECT * FROM TaxesMaster where TaxId = ${id}`);
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetch,
  fetchById,
};
