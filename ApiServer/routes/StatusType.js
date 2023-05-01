const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const StatusType = require("../models/StatusType");
const middleware = require("../service/middleware");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await StatusType.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Status type `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      StatusType: await StatusType.fetchById(req.params.id),
      users: { data: [] },
    };
    if (data.StatusType.length > 0) data.StatusType = data.StatusType[0];
    else data.StatusType = {};

    res.json(data);
  } catch (err) {
    console.error(`Error while getting Status type `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "staticstatus");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.put("/Update/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Update(
      req.body,
      "staticstatus",
      "StatusId",
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
    await statcModel.Remove("staticstatus", "StatusId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
