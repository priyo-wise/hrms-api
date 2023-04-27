const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "database-1.c0cm6ge9cesl.us-east-1.rds.amazonaws.com",
    user: "wise_employee",
    password: "Wise!202322",
    database: "wiseemployee",
    timezone: "utc",
  },
  listPerPage: 10,
  secret_key: "hjjlkljkljklklj89789ujklj",
  secret_iv: "wise",
  ecnryption_method: "aes-256-cbc",
};
module.exports = config;
