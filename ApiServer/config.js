const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "localhost",
    user: "root",
    password: "",
    database: "employees",
    timezone: "utc",
  },
  listPerPage: 10,
  secret_key: "hjjlkljkljklklj89789ujklj",
  secret_iv: "wise",
  ecnryption_method: "aes-256-cbc",
};
module.exports = config;
