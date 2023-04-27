const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const { response } = require("express");

async function Fetch(opt) {
  console.log(opt.Email);
  const rows = await db.query(`SELECT Email, Password FROM users`);
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

async function UpdateUserPassword(use) {
  const result = await db.query(
    `UPDATE users SET Password = '${use.NewPassword}' WHERE Email = '${use.Email}' && Password = '${use.OldPassword}';`
  );
  let redirection = result.affectedRows;
  return { redirection };
}

const Fetch1 = async () => {
  const rows = await db.query(`SELECT Email FROM users where UserID = 1`);
  return helper.emptyOrRows(rows);
};

module.exports = {
  Fetch,
  UpdateUserPassword,
  Fetch1,
};
