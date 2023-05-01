const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const ApplyLeave = require("../models/Applyleave");
const middleware = require("../service/middleware");
const session = require("../service/session");
const userProfile = require("../models/userProfile");
const LeaveType = require("../models/LeaveType");
const dashboard = require("../models/Dashboard");

/* GET User. */
router.get("/Fetch/Own", middleware.authorize, async (req, res, next) => {
  try {
    let user = await userProfile.getUserProfile(session.getLoggedUser(req));
    let empid = user[0].EmployeeId;
    let data = {
      AllLeave: await ApplyLeave.fetchleaveByEmployee(empid),
      EmployeeID: session.getLoggedUser(req),
      Employeeleave: await dashboard.fetchEmpleave(empid),
    };
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Own Leave `, err.message);
    next(err);
  }
});
router.get("/Fetch/All", middleware.authorize, async (req, res, next) => {
  try {
    let user = await userProfile.getUserProfile(session.getLoggedUser(req));
    let id = user[0].EmployeeId;
    let data = {
      EmployeeID: session.getLoggedUser(req),
      Employeeleave: await dashboard.fetchEmpleave(id),
      // RemainingSickleave: await ApplyLeave.fetchSickleave(session.getLoggedUser(req)),
      // RemainingCasualleave: await ApplyLeave.fetchCasualleave(session.getLoggedUser(req)),
      AllLeave: await ApplyLeave.fetch(),
    };
    //res.json(await ApplyLeave.fetch(req.query));
    res.json(data);
  } catch (err) {
    console.error(`Error while getting All Leave `, err.message);
    next(err);
  }
});
router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    let user = await userProfile.getUserProfile(session.getLoggedUser(req));
    let id = user[0].EmployeeId;
    let data = {
      EmployeeID: session.getLoggedUser(req),
      Employeeleave: await dashboard.fetchEmpleave(id),
      // RemainingSickleave: await ApplyLeave.fetchSickleave(session.getLoggedUser(req)),
      // RemainingCasualleave: await ApplyLeave.fetchCasualleave(session.getLoggedUser(req)),
      AllLeave: await ApplyLeave.fetch(),
    };
    //res.json(await ApplyLeave.fetch(req.query));
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Permissions `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id",middleware.authorize,  async function (req, res) {
  try{
  let user = await userProfile.getUserProfile(session.getLoggedUser(req));
  let empid = user[0].EmployeeId;
  let data = {
    ApplyLeave: await ApplyLeave.fetchById(req.params.id),
    leaveType: await LeaveType.fetch(empid),
    EmployeeData: await userProfile.getUserProfile(empid),
  };

  if (data.ApplyLeave.length > 0) data.ApplyLeave = data.ApplyLeave[0];
  else data.ApplyLeave = {};
  res.json(data);
} catch (err) {
  console.error(`Error while getting user `, err.message);
}
});

router.get("/Fetchleave/:id", async (req, res) => {
  let data = await ApplyLeave.fetchleaveById(req.params.id);
  res.json(await ApplyLeave.fetchleaveById(req.params.id));
});

router.post("/Submit", middleware.authorize, async function (req, res) {
  try {
    let data = await ApplyLeave.create(req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});
router.post(
  "/ChangeLeaveStatus",
  middleware.authorize,
  async function (req, res) {
    try {
      let data = await ApplyLeave.updateleavestatus(req.body);
      res.json(data);
    } catch (err) {
      console.error(`Error while getting user `, err.message);
    }
  }
);
router.post("/Remainingleave", middleware.authorize, async function (req, res) {
  try {
    let data = {
      RemainingSickleave: await ApplyLeave.fetchSickleave(
        session.getLoggedUser(req)
      ),
      RemainingCasualleave: await ApplyLeave.fetchCasualleave(
        session.getLoggedUser(req)
      ),
    };
    res.json(data);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

// router.post("/Delete", middleware.authorize, async function (req, res) {
//   try {
//     await Permission.delete(req.body);
//     res.json(null);
//   } catch (err) {
//     res.status(400).json({
//       error: err.message,
//     });
//   }
// });

module.exports = router;
