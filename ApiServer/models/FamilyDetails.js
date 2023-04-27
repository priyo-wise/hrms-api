const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async (id) => {
  const rows = await db.query(
    `SELECT * from EmployeeFamily where EmployeeId=${id}`
  );
  return helper.emptyOrRows(rows);
};

const employeeFamilyDetailsFetchById = async (id) => {
  const rows = await db.query( `SELECT * from EmployeeFamily where EmployeeId=${id}` );
  return helper.emptyOrRows(rows);
};
const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * from EmployeeFamily where FamilyId=${id}`
  );
  return helper.emptyOrRows(rows);
};

const create = async (Family, id) => {
  var query = "";
  query = `Insert Into EmployeeFamily (Name, Relation,Age,Gender,BloodGroup,EmployeeId)
   values ('${Family.Name}', '${Family.Relation}', '${Family.Age}', '${Family.Gender}', '${Family.BloodGroup}', '${id}')`;

  await db.query(query);
};

module.exports = {
  fetch,
  fetchById,
  create,
  employeeFamilyDetailsFetchById,
};
