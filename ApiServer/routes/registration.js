const express = require("express");
const router = express.Router();
const Registration = require("../models/registartion");
const middleware = require("../service/middleware");
const { fetch, create } = require("../models/Utility");
const { pick, extend } = require("underscore");
const { v4: uuidv4 } = require("uuid");

router.post("/checkEmployee/:step", async function (req, res, next) {
  try {
    let data = await Registration.checkEmployee(req.body, req.params.step);
    res.json(data);
  } catch (err) {
    console.error(`Error while Fetching Employee`, err.message);
    next(err);
  }
});

router.post(
  "/submitEmployee/:step/:EmployeeId",
  async function (req, res, next) {
    try {
      let data = await Registration.submitEmployee(
        req.params.EmployeeId,
        req.params.step
      );
      res.json(data);
    } catch (err) {
      console.error(`Error while submitting Employee`, err.message);
      next(err);
    }
  }
);

router.post("/create/:employeeId/:companyId", async function (req, res, next) {
  try {
    let data = await Registration.create(
      req.body,
      req.params.employeeId,
      req.params.companyId
    ).catch((err) => {
      throw err;
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await Registration.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting registration `, err.message);
    next(err);
  }
});
router.get("/FetchByStatus/:id", middleware.authorize, async (req, res) => {
  let data = await Registration.fetchByStatus(req.params.id);
  res.json(data);
});
router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  let data = await Registration.fetchById(req.params.id);
  res.json(data);
});

router.post("/EmployeeStatus", middleware.authorize, async function (req, res) {
  try {
    await Registration.UpdateEmployeeStatus(req.body);
    res.json(null);
  } catch (err) {
    console.error(`Error while getting Employee`, err.message);
  }
});

router.get("/fetchEmp", async function (req, res) {
  try {
    res.json(await Registration.FetchEmp());
  } catch (err) {
    console.error(`Error while getting Employee`, err.message);
  }
});
router.post("/Company", async (req, res, next) => {
  try {
    //#region Email address existing check
    await fetch("employees", { Email: req.body.Email })
      .then((c) => {
        if (c.length > 0)
          throw new Error("This email address already registered.");
      })
      .catch((err) => {
        throw err;
      });
    //#endregion
    //#region Company Registration
    req.body.Code = uuidv4();
    req.body.CompanyId = await create(
      JSON.parse(JSON.stringify(req.body)),
      "companyinformation"
    ).catch((err) => {
      throw err;
    });
    //#endregion
    //#region Default Employee Insert
    var employee = extend(
      pick(req.body, ["CompanyId", "Email", "Password", "Phone"]),
      { FullName: req.body.CompanyName, StatusId: 3 }
    );
    await create(employee, "employees")
      .then((c) => {
        employee.EmployeeId = c;
      })
      .catch((err) => {
        throw err;
      });
    //#endregion
    //#region Admin Role Assign
    await create(
      { EmployeeId: employee.EmployeeId, RoleId: 7 },
      "userroles"
    ).catch((err) => {
      throw err;
    });
    //#endregion

    //#region Company Guid return
    res.json(req.body.Code);
    //#endregion
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
  next();
});

module.exports = router;
