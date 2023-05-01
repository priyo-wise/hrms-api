const mysql = require("mysql2/promise");
const config = require("../config");
const _ = require("underscore");
const { map, mapObject, isDate } = require("underscore");
const { DateTime } = require("luxon");

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db).catch((err) => {
    throw err;
  });
  try {
    const [results] = await connection.execute(sql, params).catch((err) => {
      throw err;
    });
    if (!results) {
      results = [];
    }
    return results;
  } catch (err) {
    throw err;
  } finally {
    connection.end();
  }
}

const generateDynamicSqlSelectQuery = (tableName) => {
  return `select * from ${tableName}`;
};
const generateDynamicSqlSelectByIdQuery = (tableName, Id, ColumnName) => {
  return `select * from ${tableName} where ${ColumnName} = ${Id}`;
};
const generateDynamicSqlInsertQuery = (json, tableName) => {
  const key = _.reduce(
    _.keys(json),
    (memo, val) => `${memo}, ${val}`,
    ""
  ).substring(2);
  const value = _.reduce(
    _.values(json),
    (memo, val) => {
      if (val !== null) return `${memo}, '${val}'`;
      else return `${memo}, ${val}`;
    },
    ""
  ).substring(2);
  return `Insert Into ${tableName} (${key}) values(${value})`;
};
const generateDynamicSqlUpdateQuery = (json, tableName) => {
  const x1 = _.map(json, (val, key) => {
    if (val != null) return `${key} = '${val}'`;
    else return `${key} = ${val}`;
  });
  const x2 = _.reduce(x1, (memo, val) => `${memo}, ${val}`, "").substring(2);
  return `update ${tableName} set ${x2}`;
};

module.exports = {
  query,
  generateDynamicSqlInsertQuery,
  generateDynamicSqlUpdateQuery,
  generateDynamicSqlSelectQuery,
  generateDynamicSqlSelectByIdQuery,
};
