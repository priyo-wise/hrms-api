const db = require("./db");
const helper = require("../helper");
const config = require("../config");

const fetch = async () => {
  const rows = await db.query(
    `SELECT stc.*,st.TemplateName ,ssc.EarningOrDeductionName,  scm.CalculationMethod, concat( Code ,' - ',CalculationMethod) as CalculationMethod from salarytemplatecomponents stc join salarytemplates st on stc.TemplateId=st.TemplateId join staticsalarycomponents ssc on ssc.SalaryComponentsId=stc.SalaryComponentId join staticcalculationmethods scm on scm.CalculationMethodId=stc.CalculationMethodId`
  );
  return helper.emptyOrRows(rows);
};

const fetchById = async (id) => {
  const rows = await db.query(
    `select * from salarytemplatecomponents where TemplateComponentId=${id}`
  );
  return helper.emptyOrRows(rows);
};

const fetchDepend = async (id) => {
  return await db
    .query(
      `select t1.SalaryComponentId, t2.EarningOrDeductionName, t1.TemplateComponentId from salarytemplatecomponents t1 join staticsalarycomponents t2 on t1.SalaryComponentId=t2.SalaryComponentsId where t1.TemplateId=${id}`
    )
    .catch((err) => {
      throw err;
    });
};

const fetchBySalary = async () => {
  const rows = await db.query(`select * from salarytemplates`);

  return helper.emptyOrRows(rows);
};

const fetchBySalaryId = async (id) => {
  const rows = await db.query(
    `select * from salarytemplates where TemplateId=${id}`
  );

  return helper.emptyOrRows(rows);
};

const fetchByCalculation = async (id) => {
  const rows = await db.query(
    `SELECT *, concat( Code ,' - ',CalculationMethod) as CalculationMethod FROM staticcalculationmethods;`
  );
  return helper.emptyOrRows(rows);
};

const fetchByStatic = async (id) => {
  const rows = await db.query(`select * from staticsalarycomponents`);
  return helper.emptyOrRows(rows);
};

const fetchSalaryComponentByEmpId = async (fromDate, id) => {
  try {
    return await db.query(
      `SELECT t3.EarningOrDeductionName , t2.Amount, t2.SalaryComponentId, t3.EarningOrDeductionType
       FROM employeepackages t1 
       join employeepackagedetails t2 on t1.EmployeePackageId = t2.EmployeePackageId  
       join StaticSalaryComponents t3 on t3.SalaryComponentsId = t2.SalaryComponentId 
       WHERE  t1.FromDate <= '${fromDate}' and (t1.ToDate is null or t1.ToDate >= '${fromDate}') and EmployeeId = ${id}`);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  fetchById,
  fetch,
  fetchByStatic,
  fetchByCalculation,
  fetchBySalary,
  fetchBySalaryId,
  fetchSalaryComponentByEmpId,
  fetchDepend,
};
