const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const KeyRating = require("../models/KeyRating");
const middleware = require("../service/middleware");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await KeyRating.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Roles `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      KeyRating: await KeyRating.fetchById(req.params.id),
      users: { data: [] },
    };
    if (data.KeyRating.length > 0) data.KeyRating = data.KeyRating[0];
    else data.KeyRating = {};

    res.json(data);
  } catch (err) {
    console.error(`Error while getting Roles `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "statickra");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.put("/Update/:id", middleware.authorize, async function (req, res) {
  try {
    console.log("vds");
    await statcModel.Update(req.body, "statickra", "KRAId", req.params.id);
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.delete("/Remove/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove("statickra", "KRAId", req.params.id);
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
