const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const LeaveType = require("../models/LeaveType");
const middleware = require("../service/middleware");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await LeaveType.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Leave Types `, err.message);
    next(err);
  }
});

router.get("/FetchLeave", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await LeaveType.fetchLeave(req.query));
  } catch (err) {
    console.error(`Error while getting Leave Types `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      LeaveType: await LeaveType.fetchById(req.params.id),
      users: { data: [] },
    };
    if (data.LeaveType.length > 0) data.LeaveType = data.LeaveType[0];
    else data.LeaveType = {};

    res.json(data);
  } catch (err) {
    console.error(`Error while getting  Leave Types `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "staticleavetypes");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.put("/Update/:id", middleware.authorize, async function (req, res) {
  try {
    console.log(req.body, req.params.id);
    await statcModel.Update(
      req.body,
      "staticleavetypes",
      "LeaveId",
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
    await statcModel.Remove("staticleavetypes", "LeaveId", req.params.id);
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
