const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Errorlog = require("../models/Errorlog");
const middleware = require("../service/middleware");

/* GET User. */
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await Errorlog.fetch(req.query));
    //res.json(data);
  } catch (err) {
    console.error(`Error while getting Permissions `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", async (req, res) => {
  let data = {
    Errorlog: await Errorlog.fetchById(req.params.id),
  };
   if (data.Errorlog.length > 0) data.Errorlog = data.Errorlog[0];
   else data.Errorlog = {};  
  res.json(data);
});

router.post("/Submit", middleware.authorize, async function (req, res) {
  try {
    let data= await Errorlog.create(req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

module.exports = router;
