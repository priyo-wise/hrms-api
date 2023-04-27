const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const currentdate = new Date();
const create = async (Errorlog) => {
  var query = "";
  const data = await db.query(
    `select CompanyId from companyinformation where CompanyName = "null"`
  );
  if (data.length == 1) {
    var msg = "";
    if ((Errorlog.CompanyId || 0) == 0) {
      query = "update companyinformation set";
      query += ` CompanyName='${Errorlog.CompanyName}'`;
      query += `,Type='${Errorlog.Type}'`;
      query += `,Phone='${Errorlog.Phone}'`;
      query += `,TIN='${Errorlog.TIN}'`;
      query += `,PanNo='${Errorlog.PanNo}'`;
      query += `,Email='${Errorlog.Email}'`;
      query += `,Fax='${Errorlog.Fax}'`;
      query += `,State='${Errorlog.State}'`;
      query += `,city='${Errorlog.city}'`;
      query += `,pincode='${Errorlog.pincode}'`;
      query += `,Address1='${Errorlog.Address1}'`;
      query += `,Address2='${Errorlog.Address2}'`;
      query += `,Address3='${Errorlog.Address3}'`;
      query += `,Remarks='${Errorlog.Remarks}'`;
      query += ` where CompanyId='${data[0].CompanyId}'`;
      msg = "Successfully Company Info Updated ";

      msg = "Successfully Company Info Added";
    }
  } else {
    query = "update companyinformation set";
    query += ` CompanyName='${Errorlog.CompanyName}'`;
    query += `,Type='${Errorlog.Type}'`;
    query += `,Phone='${Errorlog.Phone}'`;
    query += `,TIN='${Errorlog.TIN}'`;
    query += `,PanNo='${Errorlog.PanNo}'`;
    query += `,Email='${Errorlog.Email}'`;
    query += `,Fax='${Errorlog.Fax}'`;
    query += `,State='${Errorlog.State}'`;
    query += `,city='${Errorlog.city}'`;
    query += `,pincode='${Errorlog.pincode}'`;
    query += `,Address1='${Errorlog.Address1}'`;
    query += `,Address2='${Errorlog.Address2}'`;
    query += `,Address3='${Errorlog.Address3}'`;
    query += `,Remarks='${Errorlog.Remarks}'`;
    query += ` where CompanyId='${Errorlog.CompanyId}'`;
    msg = "Successfully Company Info Updated ";
  }
  if (query != "") {
    await db.query(query);
  }

  return msg;
};

const fetch = async () => {
  const rows = await db.query(`SELECT * FROM companyinformation;`);
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM companyinformation  where CompanyId = ${id}`
  );
  return helper.emptyOrRows(rows);
};
module.exports = {
  create,
  fetch,
  fetchById,
};
