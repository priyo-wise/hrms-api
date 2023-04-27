const express = require("express");
const router = express.Router();
const userProfile = require("../models/userProfile");

/* GET performance. */
router.get("/Fetch", async function (req, res, next) {
  try {
    res.json(await userProfile.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});
/* GET User Profile. */
router.get("/Fetch/:UserID", async function (req, res, next) {
  try {
    res.json(await userProfile.getUserProfile(req.params.UserID));
    console.log("hii");
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

router.post("/Create", async function (req, res, next) {
  try {
    res.json(await userProfile.create(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

router.post("/Update", async function (req, res, next) {
  try {
    res.json(await userProfile.UpdateUserProfile(JSON.parse(req.body)));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

module.exports = router;
