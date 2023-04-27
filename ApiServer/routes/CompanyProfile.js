const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Errorlog = require("../models/CompanyProfile");
const middleware = require("../service/middleware");
const { fetchByDynamic } = require("../models/Utility");

/* GET User. */
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await Errorlog.fetch(req.query));
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
    let data = await Errorlog.create(req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

router.get("/", async (req, res, next) => {
  try {
    res.json(
      await fetchByDynamic({tableName:"companyinformation", req}).catch((err) => {
        throw err;
      })
    );
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
  next();
});

module.exports = router;
