const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const Officelocation = require("../models/Officelocation");
const middleware = require("../service/middleware");

/* GET User. */
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await Officelocation.fetch(req.query));
    //res.json(data);
  } catch (err) {
    console.error(`Error while getting Permissions `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", async (req, res) => {
  let data = {
    location: await Officelocation.fetchById(req.params.id),    
    Company :await Officelocation.getCompany(), 
  };
   if (data.location.length > 0) data.location = data.location[0];
   else data.location = {};  
  //  data.Company = data.Company.data.map((m) => {
  //   return {
  //     id: m.CompanyId,
  //     name: m.CompanyName,
  //   };
  // });
  res.json(data);
});

router.post("/Submit", middleware.authorize, async function (req, res) {
  try {
    let data= await Officelocation.create(req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

module.exports = router;
