const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const userProfile = require("../models/userProfile");
const status = require("../models/StatusType");
const Finance = require("../models/FinanceTemplate");
const statcModel = require("../models/staticModel");
const encryption = require("../service/encryption");
const _ = require("underscore");
const { extend } = require("underscore");
const utility = require("../models/Utility");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    const data = await Finance.fetch(req.params.id);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    res.json(await utility.create(req.body, "EmployeeFinance"));
  } catch (err) {
    console.error(`Error while getting Bank Details `, err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

router.put("/Update/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Update(
      req.body,
      "EmployeeFinance",
      "FinanceId",
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

router.get("/Fetch/:id", middleware.authorize, async (req, res, next) => {
  try {
    const data = {
      user: await userProfile.getMultiple(),
      status: await status.fetch(),
      finance: await Finance.fetchById(req.params.id),
    };
    if (data.finance.length > 0) data.finance = data.finance[0];
    else data.finance = {};
    data.user = data.user.data;
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.delete("/Remove/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove("employeefinance", "FinanceId", req.params.id);
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
