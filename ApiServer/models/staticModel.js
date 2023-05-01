const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const _ = require("underscore");
//const { query } = require("express");

const Fetch = async (tableName) => {
  const query = db.generateDynamicSqlSelectQuery(tableName);
  const rows = await db.query(query);
  return rows;
};

const FetchByQuery = async (query) => {
  const rows = await db.query(query);
  return rows;
};

const FetchById = async (tableName, Id, ColumnName) => {
  const query = db.generateDynamicSqlSelectByIdQuery(tableName, Id, ColumnName);
  const rows = await db.query(query);
  return rows;
};

const create = async (performance, tableName) => {
  const query = db.generateDynamicSqlInsertQuery(performance, tableName);
  const rows = await db.query(query);
  return helper.emptyOrRows(rows).insertId;
};

const Update = async (jsonData, tableName, IDColName, IDColValue) => {
  var query = db.generateDynamicSqlUpdateQuery(jsonData, tableName);
  query += ` where ${IDColName}=${IDColValue}`;
  const rows = await db.query(query);
  return helper.emptyOrRows(rows).insertId;
};

const Remove = async (tableName, IDColName, IDColValue) => {
  const rows = await db.query(
    `delete from ${tableName} where ${IDColName}= ${IDColValue}`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  create,
  Update,
  Remove,
  Fetch,
  FetchById,
  FetchByQuery,
};
