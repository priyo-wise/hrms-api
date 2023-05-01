const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const MenuRole = require("../models/MenuRole");
const statcModel = require("../models/staticModel");
const roles = require("../models/Roles");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await MenuRole.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting Menu Roles `, err.message);
    next(err);
  }
});

router.get("/Fetch1", middleware.authorize, async (req, res) => {
  try {
    let data = {
      menu: await MenuRole.fetchMenu(),
      roles: await roles.fetch(),
    };

    res.json(data);
  } catch (err) {
    console.error(`Error while getting Menu Roles `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "menurole");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.delete("/Remove/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove("menurole", "MenuRoleId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});
module.exports = router;
