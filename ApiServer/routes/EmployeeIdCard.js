const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const EmployeeIdCard = require("../models/EmployeeIdCard");
const middleware = require("../service/middleware");

/* GET User. */
router.post("/FetchCard", middleware.authorize, async (req, res) => {
  try {
   
    let data= await EmployeeIdCard.fetch(req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Permissions `, err.message);
   // next(err);
  }
});

router.get("/FetchActiveIdCard", middleware.authorize, async (req, res) => {  
  try {
    const data = {
      IdCardDetails: await EmployeeIdCard.fetchActiveEmployeeIdCard(req.query),
    };
    if (data.IdCardDetails.length > 0) data.IdCardDetails = data.IdCardDetails;
    else data.IdCardDetails = {};
    res.json(data);
  } catch (err) {
    console.error(`Error while getting performance `, err.message);
    next(err);
  }
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
