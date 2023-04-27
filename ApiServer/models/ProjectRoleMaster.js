const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows =
    await db.query(`SELECT ProjectRole.ProjectRoleId,ProjectRole.ParentId,ProjectRole.DisplayDescription,  COALESCE(PrntProjectRole.DisplayDescription,'-') AS 'ParentProjectRole'
    FROM static_project_roles AS ProjectRole LEFT JOIN static_project_roles AS PrntProjectRole on ProjectRole.ParentId = PrntProjectRole.ProjectRoleId `);
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
};

const fetchById = async (id) => {
    console.log("ProjectRoleId",id);
  const rows = await db.query(`SELECT * FROM static_project_roles where ProjectRoleId = ${id}`);
  return rows.length > 0 ? rows[0] : {};
};

const fetchParent = async () => {
  return await db.query(
    `SELECT DisplayDescription, ProjectRoleId FROM static_project_roles`
  );
};

module.exports = {
  fetch,
  fetchById,
  fetchParent,
};
