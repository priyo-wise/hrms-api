const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  console.log("hii");
  const rows = await db.query(`SELECT * from HolidayMaster`);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM HolidayMaster where HolidayId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  fetch,
  fetchById,
};
