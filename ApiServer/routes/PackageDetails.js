const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const component = require("../models/SalaryTemplate");
const middleware = require("../service/middleware");
const package = require("../models/PackageDetails");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    const data = await package.fetch(req.params.id);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async (req, res, next) => {
  try {
    const data = await package.create(req.body);
    res.json(null);
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res, next) => {
  try {
    const data = {
      component: await component.fetchByStatic(),
      package: await package.fetchById(req.params.id),
    };
    if (data.package.length > 0) data.package = data.package[0];
    else data.package = {};
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.delete("/Remove/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove(
      "EmployeePackageDetails",
      "EmployeePackageId",
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
