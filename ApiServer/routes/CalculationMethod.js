const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const session = require("../service/session");
const statcModel = require("../models/staticModel");
const utility = require("../models/Utility");
const db = require("../models/db");

router.get("/", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await statcModel.Fetch("staticcalculationmethods"));
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
        `SELECT * FROM staticcalculationmethods WHERE CalculationMethodId=${req.params.id}`
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
    req.body.CreatedAt = new Date().toISOString();
    req.body.CreatedBy = session.getLoggedUser(req);
    res.json(await utility.create(req.body, "staticcalculationmethods"));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.put("/:id", middleware.authorize, async function (req, res) {
  try {
    await utility.update(req.body, "staticcalculationmethods", {
      CalculationMethodId: req.params.id,
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
      "staticcalculationmethods",
      "CalculationMethodId",
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
