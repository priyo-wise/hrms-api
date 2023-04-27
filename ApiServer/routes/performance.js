const express = require("express");
const router = express.Router();
const performance = require("../models/performance");
const userProfile = require("../models/userProfile");
const middleware = require("../service/middleware");
const session = require("../service/session");

/* GET performance. */
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    let user = await userProfile.getUserProfile(session.getLoggedUser(req));
    user = user.data[0];
    if (user.IsManager == 1) {
      res.json(await performance.fetch());
    } else {
      res.json(await performance.fetchByUser(user.UserID));
    }
  } catch (err) {
    console.error(`Error while getting performance `, err.message);
    next(err);
  }
});
router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  let data = {
    performance: await performance.fetchById(req.params.id),
    users: { data: [] },
  };
  if (data.performance.length > 0) data.performance = data.performance[0];
  else data.performance={};
  if (data.performance.UserId == session.getLoggedUser(req)) {
    data.users = await userProfile.getUserProfile(data.performance.UserId);
  } else {
    data.users = await userProfile.getMultiple();
  }
  data.users = data.users.data;
  res.json(data);
});
router.post("/Submit", middleware.authorize, async function (req, res) {
  try {
    await performance.create(req.body);
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error:err.message
    })
  }
});

module.exports = router;
