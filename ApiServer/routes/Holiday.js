const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const HolidayMaster = require("../models/HolidayMaster");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await statcModel.Fetch("holidaymaster"));
  } catch (err) {
    console.error(`Error while getting Holiday `, err.message);
    next(err);
  }
});
router.get("/FetchUA", async (req, res, next) => {
  try {
    res.json(await statcModel.Fetch("holidaymaster"));
  } catch (err) {
    console.error(`Error while getting Holiday `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      HolidayMaster: await HolidayMaster.fetchById(req.params.id),
    };
    if (data.HolidayMaster.length > 0)
      data.HolidayMaster = data.HolidayMaster[0];
    else data.HolidayMaster = {};
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Holiday `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    console.log("create", req.body);
    await statcModel.create(req.body, "holidaymaster");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.put("/Update/:id", middleware.authorize, async function (req, res) {
  try {
    console.log("update", req.body);
    await statcModel.Update(
      req.body,
      "holidaymaster",
      "HolidayId",
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
    await statcModel.Remove("holidaymaster", "HolidayId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
