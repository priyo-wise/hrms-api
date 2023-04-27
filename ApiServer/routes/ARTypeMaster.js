const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const ARTypeMaster = require("../models/ARTypeMaster");
const middleware = require("../service/middleware");

/* GET User. */
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await ARTypeMaster.fetch(req.query));
    //res.json(data);
  } catch (err) {
    console.error(`Error while getting Permissions `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", async (req, res) => {
  let data = {
    ARType: await ARTypeMaster.fetchById(req.params.id),    
    SalaryComponent :await ARTypeMaster.salarycomponents(), 
  };
   if (data.ARType.length > 0) data.ARType = data.ARType[0];
   else data.ARType = {}; 
  res.json(data);
});

router.post("/Submit", middleware.authorize, async function (req, res) {
  try {
    let data= await ARTypeMaster.create(req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

module.exports = router;
