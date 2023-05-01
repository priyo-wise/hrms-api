const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const statcModel = require("../models/staticModel");
const roles = require("../models/Roles");
const RolePermission = require("../models/RolePermission");
const Permission = require("../models/Permission");
const utility = require("../models/utility");

/* GET RolePermission */
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await RolePermission.fetch(req.query));
  } catch (err) {
    console.error(`Error while getting RolePermission `, err.message);
    next(err);
  }
});

router.get("/Fetch1", middleware.authorize, async (req, res) => {
  try {
    let data = {
      permission: await Permission.fetch(),
      roles: await roles.fetch(),
    };
    res.json(data);
  } catch (err) {
    console.error(`Error while getting RolePermission `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    res.json(await utility.create(req.body, "rolepermissions"));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.delete("/:id", middleware.authorize, async (req, res, next) => {
  try {
    await utility
      .remove("rolepermissions", {
        RolePermissionId: req.params.id,
      })
      .catch((err) => {
        throw err;
      });
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
  next();
});
module.exports = router;
