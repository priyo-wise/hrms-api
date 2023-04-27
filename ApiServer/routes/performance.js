const express = require("express");
const router = express.Router();
const performance = require("../models/performance");
const userProfile = require("../models/userProfile");
const middleware = require("../service/middleware");
const session = require("../service/session");
const _ = require("underscore");

/* GET performance. */
router.get("/Fetch/Own", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await performance.fetchByUser(session.getLoggedUser(req)));
  } catch (err) {
    console.error(`Error while getting performance `, err.message);
    next(err);
  }
});
router.get("/Fetch/All", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await performance.fetch());
  } catch (err) {
    console.error(`Error while getting performance `, err.message);
    next(err);
  }
});
router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  let data = {
    performance: await performance.fetchById(req.params.id),
    users: { data: [] },
    details: await performance.fetchDetails(req.params.id),
  };
  if (data.performance.length > 0) data.performance = data.performance[0];
  else data.performance = {};
  if (data.performance.EmployeeId == session.getLoggedUser(req)) {
    data.users = await userProfile.getUserProfile(data.performance.EmployeeId);
  } else {
    data.users = await userProfile.getMultiple();
  }
  data.users = data.users.data;
  res.json(data);
});
router.post("/Submit", middleware.authorize, async (req, res) => {
  try {
    req.body.EmployeeId??=session.getLoggedUser(req);
    await performance.create(req.body);
    res.json(null);
  } catch (err) {
    console.error(`Error while getting keyRating `, err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
