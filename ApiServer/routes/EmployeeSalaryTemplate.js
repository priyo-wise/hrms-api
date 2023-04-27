const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const userProfile = require("../models/userProfile");
const status = require("../models/StatusType");
const salary = require("../models/EmployeeSalaryTemplate");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    const data = await salary.fetch(req.params.id);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async (req, res, next) => {
  try {
    const data = await salary.create(req.body);
    res.json(null);
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res, next) => {
  try {
    const data = {
      user: await userProfile.getMultiple(),
      status: await status.fetch(),
      salaryTemp: await salary.fetchById(req.params.id),
    };
    if (data.salaryTemp.length > 0) data.salaryTemp = data.salaryTemp[0];
    else data.salaryTemp = {};
    data.user = data.user.data;
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.delete("/Remove/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove(
      "EmployeeSalaryTemplate",
      "SalaryTemplateId",
      req.params.id
    );
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
