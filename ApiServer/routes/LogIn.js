const express = require("express");
const router = express.Router();
const LogIn = require("../models/LogIn");
const userProfile = require("../models/userProfile");
const middleware = require("../service/middleware");
const session = require("../service/session");

/* GET User. */
router.post("/Fetch", async function (req, res, next) {
  try {
    const user = await LogIn.Fetch(JSON.parse(req.body));
    res.json(user);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

router.post("/Update", async function (req, res, next) {
  try {
    res.json(await LogIn.UpdateUserPassword(JSON.parse(req.body)));
    const data = JSON.parse(req.body);
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

router.get("/Fetch1", async (req, res, next) => {
  try {
    let user = res.json(await LogIn.Fetch1(req.query));
  } catch (err) {
    console.error(`Error while getting leaves `, err.message);
    next(err);
  }
});

module.exports = router;
