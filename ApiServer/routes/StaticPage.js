const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Roles = require("../models/Roles");
const middleware = require("../service/middleware");
const session = require("../service/session");
const StaticPage = require("../models/StaticPage");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await StaticPage.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Pages `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      Page: await StaticPage.fetchById(req.params.id),
      menu: await StaticPage.fetchMenu(),
    };
    if (data.Page.length > 0) data.Page = data.Page[0];
    else data.Page = {};
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Roles `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "staticPages");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.put("/Update/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Update(req.body, "staticPages", "PageId", req.params.id);
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
    await statcModel.Remove("staticpages", "PageId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});
module.exports = router;
