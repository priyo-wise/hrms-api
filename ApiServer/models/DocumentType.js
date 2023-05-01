const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const employeeDocumentEmployeeFetchById = async (id) => {
  const rows = await db.query(
    `SELECT employeedocuments.DocumentId,employeedocuments.EmployeeId,employeedocuments.Number,employeedocuments.FilePath,
employeedocuments.DocumentTypeId,employeedocuments.StatusId, staticdocumenttypes.DocumentType, staticstatus.Status
FROM employeedocuments 
join staticdocumenttypes on staticdocumenttypes.DocumentTypeId= employeedocuments.DocumentTypeId
join staticstatus on staticstatus.StatusId = employeedocuments.StatusId

where EmployeeId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const create = async (Document) => {
  var query = "";
  if ((Document.DocumentTypeId || 0) == 0) {
    query = `Insert Into staticDocumentTypes (DocumentTypeId, DocumentType, Status)
   values ('${Document.DocumentTypeId}', '${Document.DocumentType}', '${Document.Status}')`;
  } else {
    query = "update staticDocumentTypes set";

    query += ` DocumentType='${Document.DocumentType}'`;
    query += `, Status='${Document.Status}'`;
    query += `where DocumentTypeId='${Document.DocumentTypeId}'`;
  }
  await db.query(query);
};

const fetch = async () => {
  const rows = await db.query(`SELECT * from staticDocumentTypes`);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM staticDocumentTypes where DocumentTypeId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const remove = async (id) => {
  console.log(id);
  const rows = await db.query(
    `delete from staticDocumentTypes  where DocumentTypeId = ${id}`
  );
  console.log(rows);
  return helper.emptyOrRows(rows);
};

module.exports = {
  remove,
  create,
  fetch,
  fetchById,
  employeeDocumentEmployeeFetchById,
};
