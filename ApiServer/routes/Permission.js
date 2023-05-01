const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Permission = require("../models/Permission");
const middleware = require("../service/middleware");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await Permission.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Permission `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      Permission: await Permission.fetchById(req.params.id),
      users: { data: [] },
    };
    if (data.Permission.length > 0) data.Permission = data.Permission[0];
    else data.Permission = {};

    res.json(data);
  } catch (err) {
    console.error(`Error while getting Permission `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    console.log("hii");
    await statcModel.create(req.body, "staticpermissions");
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
      "staticpermissions",
      "PermissionId",
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
    await statcModel.Remove("staticpermissions", "PermissionId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
