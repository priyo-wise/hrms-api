const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const statcModel = require("../models/staticModel");
const {
  pick,
  groupBy,
  keys,
  reduce,
  map,
  extend,
  where,
  findWhere,
} = require("underscore");
const utility = require("../models/Utility");
const { getLoggedUser, getLoggedCompanyId } = require("../service/session");
const { query } = require("../models/db");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    const CompanyId = await getLoggedCompanyId(req).catch((err) => {
      throw err;
    });
    res.json(await utility.fetch("projectMaster",{CompanyId}));
  } catch (err) {
    console.error(`Error while getting Project `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    const CompanyId = await getLoggedCompanyId(req).catch((err) => {
      throw err;
    });
    await statcModel.create(extend(req.body,{CompanyId}), "projectmaster");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.put("/Update/:id", middleware.authorize, async function (req, res) {
  try {
    const CompanyId = await getLoggedCompanyId(req).catch((err) => {
      throw err;
    });
    await statcModel.Update(
      extend(req.body,{CompanyId}),
      "projectmaster",
      "ProjectId",
      req.params.id
    );
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

router.delete("/Remove/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove("projectmaster", "ProjectId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

router.get("/Team/Assign", middleware.authorize, async (req, res, next) => {
  try {
    const companyId = await getLoggedCompanyId(req).catch((err) => {
      throw err;
    });
    var que =
      `SELECT
      t1.*,
      project_team.CreatedDate
  FROM
      (
      SELECT
          projectmaster.ProjectId,
          projectmaster.ProjectName,
          employees.EmployeeId,
          employees.FullName,
          employees.Designation,
          employees.Department
      FROM
          projectmaster,
          employees
      WHERE
          employees.CompanyId = '${companyId}' AND projectmaster.CompanyId = '${companyId}'
  ) t1
  LEFT JOIN project_team ON project_team.ProjectId = t1.ProjectId AND t1.EmployeeId = project_team.EmployeeId`;
    res.json(
      await utility.fetchByDynamicCondition(que, req).catch((err) => {
        throw err;
      })
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
  next();
});
router.post("/Team", middleware.authorize, async (req, res, next) => {
  try {
    const condition = pick(req.body, ["ProjectId", "EmployeeId"]);
    const s1 = await utility.fetch("project_team", condition).catch((err) => {
      throw err;
    });
    if (s1.length > 0) {
      if ((req.body?.ProjectRoleId ?? "") == "") {
        await utility.remove("project_team", condition).catch((err) => {
          throw err;
        });
      } else {
        await utility
          .update(req.body, "project_team", condition)
          .catch((err) => {
            throw err;
          });
      }
    } else {
      await utility.create(req.body, "project_team").catch((err) => {
        throw err;
      });
    }
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
  next();
});
router.delete(
  "/Team/:ProjectId/:EmployeeId",
  middleware.authorize,
  async (req, res, next) => {
    try {
      await utility
        .remove("project_team", pick(req.params, ["ProjectId", "EmployeeId"]))
        .catch((err) => {
          throw err;
        });
      res.json(null);
    } catch (err) {
      res.status(400).json({
        Error: err.message,
      });
    }
    next();
  }
);
router.get("/byLoggedUser", middleware.authorize, async (req, res, next) => {
  try {
    var que = `SELECT projectmaster.* FROM projectmaster JOIN project_team ON projectmaster.ProjectId=project_team.ProjectId WHERE project_team.EmployeeId=${getLoggedUser(
      req
    )}`;
    res.json(
      await query(que).catch((err) => {
        throw err;
      })
    );
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
  next();
});
router.get(
  "/Team/Member/Under",
  middleware.authorize,
  async (req, res, next) => {
    try {
      const companyId = await getLoggedCompanyId(req).catch((err) => {
        throw err;
      });
      var que = `with recursive myProject as (
      select ProjectId, ProjectRoleId from employees.project_team where EmployeeId='${getLoggedUser(
        req
      )}'
    ), roles(ProjectId, ProjectRoleId) as (
      select ProjectId, ProjectRoleId from myProject
      union all
      select r.ProjectId, p.ProjectRoleId from static_project_roles p inner join roles r on p.ParentId=r.ProjectRoleId where p.CompanyId='${companyId}'
    ), myUnderTeam as (
      select t2.* from roles t1 join project_team t2 on t2.ProjectId=t1.ProjectId and t2.ProjectRoleId=t1.ProjectRoleId
    ), teamMembers as (
      select EmployeeId, FullName from employees where EmployeeId in (select EmployeeId from myUnderTeam) and CompanyId='${companyId}'
    )
    select * from teamMembers`;
      res.json(
        await query(que).catch((err) => {
          throw err;
        })
      );
    } catch (err) {
      res.status(400).json({ Error: err.message });
    }
    next();
  }
);
router.get("/Team", middleware.authorize, async (req, res, next) => {
  try {
    var s1 = `SELECT t2.* FROM project_team t1 JOIN projectmaster t2 ON t1.ProjectId=t2.ProjectId WHERE t1.EmployeeId='${getLoggedUser(
      req
    )}'`;
    res.json(
      await query(s1).catch((err) => {
        throw err;
      })
    );
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
  next();
});
router.get("/Team/Member", middleware.authorize, async (req, res, next) => {
  try {
    var result = [];
    const companyId = await getLoggedCompanyId(req).catch((err) => {
      throw err;
    });
    var s1 = await query(
      `SELECT p.ProjectId, p.ProjectName, t2.EmployeeId, r.ProjectRoleId, r.DisplayDescription FROM project_team t1 INNER JOIN project_team t2 ON t1.ProjectId = t2.ProjectId INNER JOIN projectmaster p ON p.ProjectId = t2.ProjectId INNER JOIN static_project_roles r ON r.ProjectRoleId = t2.ProjectRoleId WHERE t1.EmployeeId ='${getLoggedUser(
        req
      )}'`
    ).catch((err) => {
      throw err;
    });
    if (s1.length > 0) {
      result = await query(
        `SELECT EmployeeId, Designation, FullName, Email, Phone, staticstatus.Status, staticstatus.StatusMeaning FROM employees INNER JOIN staticstatus on employees.StatusId=staticstatus.StatusId WHERE employees.StatusId=3 AND EmployeeId in (${reduce(
          keys(groupBy(s1 ?? [], "EmployeeId")),
          (m, v) => `${m},${v}`,
          ""
        ).substring(1)}) and CompanyId='${companyId}'`
      )
        .then((r) =>
          map(r, (obj) =>
            extend(obj, {
              Roles: where(s1, { EmployeeId: obj.EmployeeId }),
            })
          )
        )
        .catch((err) => {
          throw err;
        });
    }

    if ((req.query?.search ?? "") != "") {
      sql = `SELECT EmployeeId, Designation, FullName, Email, Phone, staticstatus.Status, staticstatus.StatusMeaning FROM employees INNER JOIN staticstatus on employees.StatusId=staticstatus.StatusId WHERE employees.StatusId=3 AND FullName LIKE '%${req.query.search}%' and CompanyId='${companyId}'`;
      result = await query(sql)
        .then((r) =>
          map(
            r ?? [],
            (obj) => findWhere(result, { EmployeeId: obj.EmployeeId }) ?? obj
          )
        )
        .catch((err) => {
          throw err;
        });
    }
    res.json(result);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
  next();
});

module.exports = router;
