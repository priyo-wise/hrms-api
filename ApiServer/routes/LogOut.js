const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const session = require("../service/session");

router.get("/Clear", (req, res) => {
  try {
    session.clear(req);
    res.json(null);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

module.exports = router;
