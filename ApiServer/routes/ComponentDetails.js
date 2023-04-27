const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Roles = require("../models/Roles");
const middleware = require("../service/middleware");
const session = require("../service/session");
const ComponentDetails = require("../models/ComponentDetails");
const statcModel = require("../models/staticModel");
const StaticComponents = require("../models/StaticComponents");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await ComponentDetails.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Components `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      details: await ComponentDetails.fetchById(req.params.id),
      component: await StaticComponents.fetch(),
      page: await ComponentDetails.fetchStaticPage(),
    };
    if (data.details.length > 0) data.details = data.details[0];
    else data.details = {};
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Roles `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "ComponentDetails");
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
      "ComponentDetails",
      "ComponentDetailsId",
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
    await statcModel.Remove(
      "ComponentDetails",
      "ComponentDetailsId",
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
module.exports = router;
