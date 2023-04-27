const express = require("express");
const router = express.Router();
const TimeSheet = require("../models/TimeSheet");
const middleware = require("../service/middleware");
const utility = require("../models/Utility");

router.get("/Report", middleware.authorize, async (req, res, next) => {
  try {
    let que =
      "select t1.*, Emp.FullName from EmployeeAttendance t1 join Employees Emp on Emp.EmployeeId=t1.EmployeeId";
    res.json(
      await utility.fetchByDynamicCondition(que, req).catch((err) => {
        throw err;
      })
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
  next();
});

module.exports = router;
