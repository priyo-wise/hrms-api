const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const TaxMaster = require("../models/TaxMaster");
const middleware = require("../service/middleware");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await TaxMaster.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Tax `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      TaxMaster: await TaxMaster.fetchById(req.params.id),
      users: { data: [] },
    };
    if (data.TaxMaster.length > 0) data.TaxMaster = data.TaxMaster[0];
    else data.TaxMaster = {};

    res.json(data);
  } catch (err) {
    console.error(`Error while getting Tax `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "TaxesMaster");
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
    await statcModel.Update(req.body, "TaxesMaster", "TaxId", req.params.id);
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
    await statcModel.Remove("TaxesMaster", "TaxId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
