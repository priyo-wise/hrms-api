const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Roles = require("../models/Roles");
const middleware = require("../service/middleware");
const session = require("../service/session");
const userProfile = require("../models/userProfile");
const statcModel = require("../models/staticModel");
const utility = require("../models/Utility");
const db = require("../models/db");

router.get("/", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await statcModel.Fetch("staticsalarycomponents"));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.get("/Deduction", middleware.authorize, async (req, res, next) => {
  try {
    res.json(
      await statcModel.FetchByQuery(
        "select * from staticsalarycomponents where EarningOrDeductionType='Deduction'"
      )
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.get("/Earning", middleware.authorize, async (req, res, next) => {
  try {
    res.json(
      await statcModel.FetchByQuery(
        "select * from staticsalarycomponents where EarningOrDeductionType='Earning'"
      )
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.get("/:id", middleware.authorize, async (req, res) => {
  try {
    res.json(
      await db.query(
        `SELECT * FROM staticsalarycomponents WHERE SalaryComponentsId=${req.params.id}`
      )
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.post("/", middleware.authorize, async function (req, res) {
  try {
    console.log("create");
    req.body.CreatedAt = new Date().toISOString();
    req.body.CreatedBy = session.getLoggedUser(req);
    res.json(await utility.create(req.body, "staticsalarycomponents"));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.put("/:id", middleware.authorize, async function (req, res) {
  try {
    await utility.update(req.body, "staticsalarycomponents", {
      SalaryComponentsId: req.params.id,
    });
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.delete("/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove(
      "staticsalarycomponents",
      "SalaryComponentsId",
      req.params.id
    );
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
module.exports = router;
