const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const userProfile = require("../models/userProfile");
const statcModel = require("../models/staticModel");
const roles = require("../models/Roles");
const UserRole = require("../models/UserRole");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await UserRole.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting User Role `, err.message);
    next(err);
  }
});

router.get("/Fetch1", middleware.authorize, async (req, res, next) => {
  try {
    let data = {
      users: await userProfile.getMultiple(),
      roles: await roles.fetch(),
    };

    data.users = data.users.data;
    res.json(data);
  } catch (err) {
    console.error(`Error while getting User Role `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "userroles");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.delete("/Remove/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove("userroles", "UserRoleId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
