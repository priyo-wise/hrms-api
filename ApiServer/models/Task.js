const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const create = async (Task) => {
  if ((Task.TaskCategoryId || 0) == 0) {
    query = `Insert Into taskCategoryMaster (TaskCategoryId, TaskCategoryName)
   values ('${Task.TaskCategoryId}', '${Task.TaskCategoryName}')`;
  } else {
    query = `update taskCategoryMaster set TaskCategoryName='${Task.TaskCategoryName}' where TaskCategoryId='${Task.TaskCategoryId}' `;
  }
  await db.query(query);
};

const fetch = async () => {
  const rows = await db.query(`SELECT * from taskCategoryMaster`);
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM taskCategoryMaster where TaskCategoryId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const remove = async (Task) => {
  console.log(id);
  const rows = await db.query(
    `delete from taskCategoryMaster where TaskCategoryId = ${Task.TaskCategoryId}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  remove,
  create,
  fetch,
  fetchById,
};
