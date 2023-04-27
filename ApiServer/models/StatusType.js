const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const create = async (StatusType) => {
  var query = "";
  if ((StatusType.StatusId || 0) == 0) {
    query = `Insert Into staticStatus (StatusId, Status,StatusMeaning)
   values ('${StatusType.StatusId}', '${StatusType.Status}', '${StatusType.StatusMeaning}')`;
  } else {
    query = "update staticStatus set";

    query += ` Status='${StatusType.Status}'`;
    query += `, StatusMeaning='${StatusType.StatusMeaning}'`;
    query += `where StatusId='${StatusType.StatusId}'`;
  }
  await db.query(query);
};

const fetch = async () => {
  const rows = await db.query(`SELECT * from staticStatus`);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM staticStatus where StatusId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const remove = async (StatusType) => {
  console.log(id);
  const rows = await db.query(
    `delete from staticStatus  where StatusId = ${StatusType.StatusId}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  remove,
  create,
  fetch,
  fetchById,
};
