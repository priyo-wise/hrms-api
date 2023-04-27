const express = require("express");
const router = express.Router();
const applyleave = require("../models/Applyleave");

router.post("/create", async function (req, res, next) {
  try {
    res.json(await applyleave.create(JSON.parse(req.body)));
  } catch (err) {
    console.error(`Error while Adding leave`, err.message);
    next(err);
  }
});

router.get("/Fetch", async (req, res, next) => {
  try {
    let user = res.json(await applyleave.Fetch(req.query));
  } catch (err) {
    console.error(`Error while getting leaves `, err.message);
    next(err);
  }
});

module.exports = router;
