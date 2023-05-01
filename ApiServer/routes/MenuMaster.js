const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const MenuMaster = require("../models/MenuMaster");
const middleware = require("../service/middleware");
const session = require("../service/session");
const userProfile = require("../models/userProfile");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    let user = await userProfile.getUserProfile(session.getLoggedUser(req));
    res.json(await MenuMaster.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Menu Master `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      MenuMaster: await MenuMaster.fetchById(req.params.id),
      parent: await MenuMaster.fetchParent(),
    };
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Menu Master `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "menus");
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
    await statcModel.Update(req.body, "menus", "MenuId", req.params.id);
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
    await statcModel.Remove("menus", "MenuId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
