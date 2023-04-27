const utility = require("./Utility");
const { DateTime } = require("luxon");
const { each, filter, find, max, findWhere, map } = require("underscore");
const { query } = require("./db");

const submit = async (reqJson) => {
  var existingPackages = await utility
    .fetch("employeepackages", { EmployeeId: reqJson.EmployeeId })
    .then((d) =>
      filter(
        d || [],
        (f) => f.EmployeePackageId != (reqJson.EmployeePackageId || 0)
      )
    );
  var s1 = find(
    existingPackages ?? [],
    (f) => DateTime.fromJSDate(f.FromDate) >= DateTime.now().toUTC()
  );
  if (
    (reqJson?.EmployeePackageId ?? 0) == 0 &&
    (s1?.EmployeePackageId ?? 0) != 0
  ) {
    reqJson.EmployeePackageId = s1.EmployeePackageId;
    existingPackages = filter(
      existingPackages ?? [],
      (f) => f.EmployeePackageId != s1.EmployeePackageId
    );
  }
  var existingPackage = find(existingPackages, (f) => f.ToDate == null);
  existingPackage ??= max(existingPackages, (f) => f.ToDate);
  existingPackage.ToDate = DateTime.fromISO(reqJson.FromDate)
    .plus(-1000)
    .toJSDate()
    .toISOString();
  if ((existingPackage?.EmployeePackageId ?? 0) !== 0) {
    await utility.update(existingPackage, "employeepackages", {
      EmployeePackageId: existingPackage.EmployeePackageId,
    });
  }
  if ((reqJson?.EmployeePackageId ?? 0) === 0) {
    reqJson.EmployeePackageId = await utility.create(
      reqJson,
      "employeepackages"
    );
  } else {
    await utility.update(reqJson, "employeepackages", {
      EmployeePackageId: reqJson.EmployeePackageId,
    });
  }
  await utility.remove("employeepackagedetails", {
    EmployeePackageId: reqJson.EmployeePackageId,
  });
  each(reqJson.Details, async (e) => {
    e.EmployeePackageId ??= reqJson.EmployeePackageId;
    await utility.create(e, "employeepackagedetails");
  });
  return reqJson;
};
const fetchRecords = async () => {
  try {
    var que =
      "SELECT t1.*, t2.FullName EmpName, t3.TemplateName FROM employeepackages t1 join employees t2 on t1.EmployeeId=t2.EmployeeId join salarytemplates t3 on t1.SalaryTemplateId=t3.TemplateId";
    return await query(que);
  } catch (err) {
    throw err;
  }
};
const removePackageById = async (id) => {
  try {
    var removeablePackage = await utility.fetch(
      "employeepackages",
      { EmployeePackageId: id },
      true
    );
    var previousPackage = await utility
      .fetch("employeepackages", { EmployeeId: removeablePackage.EmployeeId })
      .then((r) =>
        findWhere(
          r || [],
          (f) =>
            f.EmployeePackageId != removeablePackage.EmployeePackageId &&
            f.ToDate ==
              DateTime.fromJSDate(removeablePackage.FromDate)
                .plus(-1000)
                .toUTC()
        )
      );
    if ((previousPackage?.EmployeePackageId ?? 0) != 0) {
      previousPackage.ToDate = null;
      await utility.update(previousPackage, "employeepackages", {
        EmployeePackageId: previousPackage.EmployeePackageId,
      });
    }
    await utility.remove("employeepackages", {
      EmployeePackageId: removeablePackage.EmployeePackageId,
    });
    return null;
  } catch (err) {
    throw err;
  }
};
const fetchById = async (EmployeePackageId) => {
  var package = await utility.fetch(
    "employeepackages",
    { EmployeePackageId },
    true
  );
  package.Details = await utility.fetch("employeepackagedetails", {
    EmployeePackageId,
  });
  return package;
};

module.exports = {
  submit,
  fetchRecords,
  removePackageById,
  fetchById,
};
