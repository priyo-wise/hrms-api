const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const SalaryARInvoice = require("../models/SalaryARInvoice");
const middleware = require("../service/middleware");
const ARTypeMaster = require("../models/ARTypeMaster");
const userProfile = require("../models/userProfile");

/* GET User. */
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await SalaryARInvoice.fetch(req.query));
    //res.json(data);
  } catch (err) {
    console.error(`Error while getting Permissions `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", async (req, res) => {
  let data = {
    ARInvoice: await SalaryARInvoice.fetchById(req.params.id),    
    ARType :await ARTypeMaster.fetch(),   
    Employee :await userProfile.getMultiple(),
  };
   if (data.ARInvoice.length > 0) data.ARInvoice = data.ARInvoice[0];
   else data.ARInvoice = {}; 
   data.Employee = data.Employee.data.map((m) => {
    return {
      id: m.EmployeeId,
      name: m.FullName,
    };
  });
  res.json(data);
});

router.post("/Submit", middleware.authorize, async function (req, res) {
  try {
    let data= await SalaryARInvoice.create(req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

module.exports = router;
