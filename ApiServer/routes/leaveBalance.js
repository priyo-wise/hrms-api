const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const leaveBalance = require("../models/leaveBalance");
const middleware = require("../service/middleware");
const session = require("../service/session");
const userProfile = require("../models/userProfile");
const LeaveType = require("../models/LeaveType");
const performance = require("../models/performance");
/* GET User. */
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await leaveBalance.fetch(req.query));
    //res.json(data);
  } catch (err) {
    console.error(`Error while getting Permissions `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", async (req, res) => {

  let data = {
    leaveBalance: await leaveBalance.fetchById(req.params.id),
    leaveType: await LeaveType.fetch(),
    Employee :await userProfile.getMultiple(),    
    EmployeeID:session.getLoggedUser(req),
  };
   if (data.leaveBalance.length > 0) data.leaveBalance = data.leaveBalance[0];
   else data.leaveBalance = {};  
   data.Employee = data.Employee.data.map((m) => {
    return {
      id: m.EmployeeId,
      name: m.FullName,
    };
  });
  console.log("text",data);
  res.json(data);
});

router.post("/Submit", middleware.authorize, async function (req, res) {
  try {
    let data= await leaveBalance.create(req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

module.exports = router;
