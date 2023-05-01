const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Roles = require("../models/Roles");
const middleware = require("../service/middleware");
const session = require("../service/session");
const userProfile = require("../models/userProfile");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    let user = await userProfile.getUserProfile(session.getLoggedUser(req));
    res.json(await Roles.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Roles `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    let data = {
      Roles: await Roles.fetchById(req.params.id),
      users: { data: [] },
    };
    if (data.Roles.length > 0) data.Roles = data.Roles[0];
    else data.Roles = {};

    res.json(data);
  } catch (err) {
    console.error(`Error while getting Roles `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "staticroles");
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
    await statcModel.Update(req.body, "staticroles", "RoleId", req.params.id);
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
    await statcModel.Remove("staticroles", "RoleId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});
module.exports = router;
