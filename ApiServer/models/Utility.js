const db = require("./db");
const helper = require("../helper");
const {
  map,
  omit,
  reduce,
  keys,
  filter,
  without,
  findWhere,
  where,
  pick,
} = require("underscore");

const removeNestedObjectOrArray = (data) => {
  var keys = map(data, (value, key) => {
    if (
      value != null &&
      (typeof value === typeof {} || typeof value === typeof [])
    )
      return key;
    else return null;
  });
  return omit(data, keys);
};
const existingColumns = async (TABLE_NAME) => {
  return await fetch(
    "INFORMATION_SCHEMA.COLUMNS",
    { TABLE_NAME },
    false,
    ["COLUMN_NAME"]
  )
    .then((c) => map(c, (m) => m.COLUMN_NAME))
    .catch((err) => {
      throw err;
    });
};
const create = async (data, tableName) => {
  var s1 = await existingColumns(tableName)
    .catch((err) => {
      throw err;
    });
  data=pick(data,s1);
    
  const query = db.generateDynamicSqlInsertQuery(
    removeNestedObjectOrArray(data),
    tableName
  );
  const rows = await db.query(query);
  return helper.emptyOrRows(rows).insertId;
};
const update = async (data, tableName, condition) => {
  data = await existingColumns(tableName)
    .then((c) => pick(data, c ?? []))
    .catch((err) => {
      throw err;
    });

  let query = db.generateDynamicSqlUpdateQuery(
    removeNestedObjectOrArray(data),
    tableName
  );
  const x1 = map(condition, (val, key) => {
    if (val != null) return `${key} = '${val}'`;
    else return `${key} = ${val}`;
  });
  const x2 = reduce(x1, (memo, val) => `${memo} and ${val}`, "").substring(5);
  query += ` where ${x2}`;
  await db.query(query);
  return null;
};

const remove = async (tableName, condition) => {
  var query = `delete from ${tableName}`;
  const x1 = map(condition, (val, key) => {
    if (val != null) return `${key} = '${val}'`;
    else return `${key} = ${val}`;
  });
  const x2 = reduce(x1, (memo, val) => `${memo} and ${val}`, "").substring(5);
  query += ` where ${x2}`;
  await db.query(query);
  return null;
};
const fetch = async (
  tableName,
  condition = {},
  isFirstOrDefault = false,
  selectColumns = []
) => {
  var columns = "*";
  if (selectColumns.length > 0) {
    columns = reduce(selectColumns, (m, v) => `${m}, ${v}`, "").substring(2);
  }
  var query = `select ${columns} from ${tableName}`;
  if (keys(condition || {}).length > 0) {
    const x1 = map(condition, (val, key) => {
      if (val != null) return `${key} = '${val}'`;
      else return `${key} = ${val}`;
    });
    const x2 = reduce(x1, (memo, val) => `${memo} and ${val}`, "").substring(5);
    query += ` where ${x2}`;
  }
  var results = await db.query(query);
  if (isFirstOrDefault) {
    results = results.length > 0 ? results[0] : {};
  }
  return results;
};

const queryStr = async (queryStr) => {
  console.log(queryStr);
  var results = await db.query(queryStr);
  console.log(results);
  return results;
};
const fetchByDynamicCondition = async (fetchSqlQuery, req) => {
  if ((req?.query?.where ?? "") != "") {
    fetchSqlQuery = `select * from (${fetchSqlQuery}) t1 where ${req.query.where
      .replace(" eq ", " = ")
      .replace(" ne ", " <> ")
      .replace(" ge ", " >= ")
      .replace(" gt ", " > ")
      .replace(" le ", " <= ")
      .replace(" lt ", " < ")}`;
  }
  return await db.query(fetchSqlQuery).catch((err) => {
    throw err;
  });
};

const tableRelation = async ({ tableName }) => {
  return await db
    .query(
      "SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE  TABLE_SCHEMA = SCHEMA() AND REFERENCED_TABLE_NAME IS NOT NULL"
    )
    .then((c) =>
      filter(
        c ?? [],
        (f) => f.TABLE_NAME == tableName || f.REFERENCED_TABLE_NAME == tableName
      )
    )
    .catch((err) => {
      throw err;
    });
};
const selectStatement = (req) => {
  var select = req.query?.select;
  if ((req.query?.select ?? "") != "") {
  }
  return select;
};
const fetchByDynamic = async ({ tableName, req, CompanyId=0 }) => {
  req.query??={};
  req.query.where??="";
  if(CompanyId!=0){
    var v1 = [tableName].concat(
      (req.query.expand ?? "") == ""
        ? []
        : req.query.expand.replace(" ", "").split(","));
    v1 = await Promise.all(
      map(v1, (m) =>
        isCompanyExist(m).then((c) => ({ tebale: m, isCompany: c }))
      )
    );
    v1=where(v1,{isCompany:true});
    if(v1.length>0){
      v1=reduce(v1, (m,v)=>`${m} and ${v.tebale}.CompanyId eq ${CompanyId}`,'');
      if(req.query.where=="") v1=v1.substring(5);
      req.query.where+=v1;
    }
  }

  var schemaTable = await tableRelation({ tableName }).catch((err) => {
    throw err;
  });
  var baseQuery = "";
  req.query ??= {};

  baseQuery += `select ${(req.query.select ??= "*")}`;

  if ((req.query.expand ?? "").length > 0) req.query.expand += `, ${tableName}`;
  else req.query.expand = tableName;
  baseQuery += ` from ${req.query.expand}`;

  var condition = "";
  expandList = req.query.expand.replace(" ", "").split(",");
  if (expandList.length > 1) {
    condition += reduce(
      without(expandList, tableName),
      (m, v) => {
        var val =
          findWhere(schemaTable, { TABLE_NAME: v }) ??
          findWhere(schemaTable, { REFERENCED_TABLE_NAME: v });
        if (val != undefined) {
          return `${m} and ${val.TABLE_NAME}.${val.COLUMN_NAME}=${val.REFERENCED_TABLE_NAME}.${val.REFERENCED_COLUMN_NAME}`;
        }
        return m;
      },
      ""
    ).substring(5);
  }

  var extendedCodition = "";
  if ((req.query.where ?? "").length > 0) {
    extendedCodition = req.query.where
      .replaceAll(" eq ", " = ")
      .replaceAll(" ne ", " <> ")
      .replaceAll(" ge ", " >= ")
      .replaceAll(" gt ", " > ")
      .replaceAll(" le ", " <= ")
      .replaceAll(" lt ", " < ");
  }

  if (condition.length > 0 && extendedCodition.length > 0)
    condition += ` and ${extendedCodition}`;
  else if (extendedCodition.length > 0) {
    condition = extendedCodition;
  }
  if (condition.length > 0) baseQuery += ` where ${condition}`;

  if ((req.query.groupBy ?? "").length > 0)
    baseQuery += ` group by ${req.query.groupBy}`;
  if ((req.query.orderBy ?? "").length > 0)
    baseQuery += ` order by ${req.query.orderBy}`;
  return await db.query(baseQuery).catch((err) => {
    throw err;
  });
};
const isCompanyExist = async (tableName) => {
  return await fetch("INFORMATION_SCHEMA.KEY_COLUMN_USAGE", {
    TABLE_NAME: tableName,
    COLUMN_NAME: "CompanyId",
  })
    .then((c) => c.length > 0)
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  create,
  update,
  remove,
  fetch,
  queryStr,
  fetchByDynamicCondition,
  fetchByDynamic,
  isCompanyExist,
};
