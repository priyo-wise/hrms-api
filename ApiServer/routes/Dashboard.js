const express = require("express");
const router = express.Router();
const dashboard = require("../models/Dashboard");
const middleware = require("../service/middleware");
const userProfile = require("../models/userProfile");
const session = require("../service/session");
const { identity } = require("underscore");

/* GET performance. */
router.get("/Fetch", middleware.authorize, async function (req, res, next) {
  try {
    let user = await userProfile.getUserProfile(session.getLoggedUser(req));
    let id = user[0].EmployeeId;
    let data = {
      users: await dashboard.getMultiple(),
      rating: await dashboard.fetchByEmpId(id),
      lastleaveStatus: await dashboard.fetchlastleaveStatus(id),
      Employeeleave: await dashboard.fetchEmpleave(id),
      EmployeeAssignProject: await dashboard.fetchEmpProject(id),
      ProjectManager: await dashboard.fetchProjectManager(),
    };
    data.rating = data.rating.details;
    data.users = data.users.data;
    data.timeSheet = await dashboard.getTimeSheetOverView(
      session.getLoggedUser(req)
    );
    res.json(data);
  } catch (err) {
    console.error(`Error while getting dashboard `, err.message);
    next(err);
  }
});

router.get(
  "/fetchCheckIn",
  middleware.authorize,
  async function (req, res, next) {
    try {
      const id = session.getLoggedUser(req);
      res.json(await dashboard.fetchCheckIn(id));
    } catch (err) {
      console.error(`Error while getting time `, err.message);
      next(err);
    }
  }
);

router.post("/Submit", middleware.authorize, async function (req, res, next) {
  try {
    const id = session.getLoggedUser(req);
    res.json(await dashboard.submit(id));
  } catch (err) {
    console.error(`Error while creating time `, err.message);
    next(err);
  }
});

router.get(
  "/fetchTopPerformers",
  middleware.authorize,
  async function (req, res, next) {
    try {
      res.json(await dashboard.fetchTopPerformers());
    } catch (err) {
      console.error(`Error while getting top performers `, err.message);
      next(err);
    }
  }
);

module.exports = router;
