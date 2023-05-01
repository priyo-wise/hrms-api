const db = require("./db");
const helper = require("../helper");
const _ = require("underscore");
const encryption = require("../service/encryption");
const utility = require("./Utility");
const { each, extend, reduce } = require("underscore");
const { getLoggedUser } = require("../service/session");

const create = async (Payslip) => {
  Payslip.Basic = encryption.encryptData(Payslip.Basic);
  Payslip.HRA = encryption.encryptData(Payslip.HRA);
  Payslip.Bonus = encryption.encryptData(Payslip.Bonus);
  Payslip.SalaryAdvanceDeduction = encryption.encryptData(
    Payslip.SalaryAdvanceDeduction
  );
  Payslip.GrossSalary = encryption.encryptData(Payslip.GrossSalary);
  Payslip.TotalDeduction = encryption.encryptData(Payslip.TotalDeduction);
  Payslip.NetSalary = encryption.encryptData(Payslip.NetSalary);
  var query = "";
  if ((Payslip.PayslipId || 0) == 0) {
    query = db.generateDynamicSqlInsertQuery(
      _.omit(Payslip, ["PayslipId"]),
      "employeepayslip"
    );
  } else {
    query = db.generateDynamicSqlUpdateQuery(
      _.omit(Payslip, ["PayslipId"]),
      "employeepayslip"
    );
    query += ` where PayslipId='${Payslip.PayslipId}'`;
  }
  await db.query(query);
};

const fetch = async (req) => {
  var que="SELECT employeepayslip.*, employees.FullName   FROM employeepayslip join employees on employeepayslip.EmployeeId=employees.EmployeeId";
  var condition=[];
  if(req?.query?.AllUser=="N") condition.push(`employeepayslip.EmployeeId=${getLoggedUser(req)}`);
  if(req?.query?.OnlyPublish=="Y") condition.push(`employeepayslip.StatusId=7`);
  if(condition.length>0){
    var s1=reduce(condition,(m,v)=>`${m} and ${v}`,"").substring(5);
    que+=` where ${s1}`;
  }
  return await db
    .query(que)
    .catch((err) => {
      throw err;
    });
  // return helper.emptyOrRows(rows);
};
const fetchByUser = async () => {
  return await db
    .query(
      `SELECT t1.PayslipId, t1.TotalWorkingDays, t1.UnpaidAbsenceDays, t1.FromDate, t1.ToDate, t1.GrossSalary,
        t1.TotalDeductions, t1.NetSalary, t1.IncludeKRAScoreInPayslip, t2.FullName
        FROM employeepayslip t1 join employees t2 on t1.EmployeeId=t2.EmployeeId;`
    )
    .catch((err) => {
      throw err;
    });
  // return _.map(helper.emptyOrRows(rows), (m) => {
  //   m.SalaryAdvanceDeduction = encryption.decryptData(m.SalaryAdvanceDeduction);
  //   m.GrossSalary = encryption.decryptData(m.GrossSalary);
  //   m.TotalDeduction = encryption.decryptData(m.TotalDeduction);
  //   m.NetSalary = encryption.decryptData(m.NetSalary);
  //   return m;
  //});
};
const fetchById = async (id) => {
  return await utility
    .fetch("employeepayslip", { PayslipId: id }, true)
    .then(async (d) =>
      extend(d, {
        Details: await utility
          .fetch(
            "employeepayslipcomponents",
            {
              PayslipId: id,
            },
            false
          )
          .then(async (d) =>
            extend(d, {
              ComponentDetails: await utility.fetch("staticsalarycomponents", {
                SalaryComponentsId: id,
              }),
            })
          ),
      })
    );
};
const submit = async (data) => {
  try {
    if (data.FromDate!=undefined &&
      await db
        .query(
          `SELECT * FROM employeepayslip WHERE ('${
            data.FromDate
          }' <= ToDate) AND EmployeeId=${data.EmployeeId} and PayslipId<>${
            data?.PayslipId ?? 0
          }`
        )
        .then((r) => r.length > 0)
    ) {
      throw "Data can not be submited, conflict duplicate record";
    }
    if ((data?.PayslipId ?? 0) == 0) {
      data.PayslipId = await utility.create(data, "employeepayslip");
    } else {
      await utility.update(data, "employeepayslip", {
        PayslipId: data.PayslipId,
      });
    }
    if(data?.StatusId!=7){
      await utility.remove("employeepayslipcomponents", {
        PayslipId: data.PayslipId,
      });
      each(data.employeepayslipcomponents, async (e) => {
        e.PayslipId = data.PayslipId;
        await utility.create(e, "employeepayslipcomponents");
      });
    }
    return data;
  } catch (err) {
    throw err;
  }
};
const fetchByIdForView = async (id = null) => {
  id ??= 0;
  const qu1 = `select employees.FullName,
  employees.Designation,
  employees.EmployeeCode,
  employees.Department,
  DATE_FORMAT(employeepayslip.FromDate, '%M-%y') AS PayMonth,
  employeepayslip.TotalWorkingDays,
  DATE_FORMAT(employees.DOJ, '%d-%m-%Y') AS DOJ,
  employeefinance.BankName,
  employeefinance.BankAccountNo,
  employeefinance.NameInAccount,
  employeefinance.IFSCCode,
  employeefinance.PFAccountNo,
  employeefinance.PFUANNo, 
  employeepayslip.* 
  from employeepayslip 
  join employees on employees.EmployeeId=employeepayslip.EmployeeId
  left join employeefinance on employeefinance.EmployeeId=employeepayslip.EmployeeId
  where employeepayslip.PayslipId=${id}`;
  let rec = await db
    .query(qu1)
    .then((c) => (c.length > 0 ? c[0] : {}))
    .catch((err) => {
      throw err;
    });
  const qu2 = `select t2.EarningOrDeductionName, t2.EarningOrDeductionType, 
  t2.PreTaxORPostTax, t1.CalculatedAmount from employeepayslipcomponents t1 
  JOIN staticsalarycomponents t2 on t1.SalaryComponentId=t2.SalaryComponentsId 
  WHERE t1.PayslipId=${id}`;
  rec.Components = await db.query(qu2).catch((err) => {
    throw err;
  });
  rec.PaymentDetails = await utility
    .fetch("employeepayslippayments", {
      PayslipId: id,
    })
    .catch((err) => {
      throw err;
    });
  return rec;
};
const addPayment = async (body = null) => {
  body ??= {};
  body.PayslipId ??= 0;
  if (body.PayslipId > 0) {
    body.EmployeePayslipPaymentId = await utility
      .create(body, "employeepayslippayments")
      .catch((err) => {
        throw err;
      });
    return body;
  } else {
    throw new Error("Payslip is not valid");
  }
};
const deletePayment = async (id = null) => {
  id ??= 0;
  await utility
    .remove("employeepayslippayments", { EmployeePayslipPaymentId: id })
    .catch((err) => {
      throw err;
    });
  return null;
};

module.exports = {
  create,
  fetch,
  fetchByUser,
  fetchById,
  fetchByIdForView,
  submit,
  addPayment,
  deletePayment,
};
