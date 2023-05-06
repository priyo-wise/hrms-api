const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const Notification = require("../models/Notification");
const statcModel = require("../models/staticModel");
const session = require("../service/session");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await Notification.fetch(session.getLoggedUser(req)));
  } catch (err) {
    console.error(`Error while getting Notifications `, err.message);
    next(err);
  }
});

router.post("/Create", async function (req, res) {
  try {
    await statcModel.create(req.body, "EmployeeActionNotification");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.delete("/Remove/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove(
      "EmployeeActionNotification",
      "ActionNotificationId",
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
