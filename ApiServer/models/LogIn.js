const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const { response } = require("express");

async function Validate(opt) {
  const rows = await db.query(
    `SELECT * FROM employees WHERE Email = '${opt.Email}' && Password = '${opt.Password}'; `
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

async function UpdateUserPassword(use, id) {
  const result = await db.query(
    `UPDATE employees SET Password = '${use.NewPassword}' WHERE  EmployeeId = '${id}' && Password = '${use.OldPassword}';`
  );
  let redirection = result.affectedRows;
  if (redirection > 0) {
    message = "Password Updated Successfully";
  } else {
    message = "Incorrect Old Password";
  }
  return message;
}

const Fetch1 = async () => {
  const rows = await db.query(`SELECT Email FROM employees`);
  return helper.emptyOrRows(rows);
};

const SendMail = async (mail) => {
  const rows = await db.query(
    `Select Email,Password from Employees where Email='${mail.Email}'`
  );
  return rows;
};

module.exports = {
  Validate,
  UpdateUserPassword,
  Fetch1,
  SendMail,
};
