const express = require("express");
const router = express.Router();
const TimeSheet = require("../models/TimeSheet");
const middleware = require("../service/middleware");
const session = require("../service/session");
const userProfile = require("../models/userProfile");
//const project = require("../models/Project");
const db = require("../models/db");
const helper = require("../helper");
const statcModel = require("../models/staticModel");
const utility = require("../models/Utility");
const { deleteFile } = require("../service/fileFolderService");
const { pick } = require("underscore");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    await statcModel.create(req.body, "timesheet");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.get("/FetchAll/:id/:date", middleware.authorize, async (req, res) => {
  let timeSheetDate = req.params.date;
  let data = {
    TimeSheet: await TimeSheet.fetchById(req.params.id),
    EmployeeId: session.getLoggedUser(req),
  };
  if (data.TimeSheet.length > 0) data.TimeSheet = data.TimeSheet[0];
  else data.TimeSheet = {};
  if (data.TimeSheet.EmployeeId == session.getLoggedUser(req)) {
    timeSheetDate = data.TimeSheet.Date.toISOString();
    data.users = await userProfile.getUserProfile(data.TimeSheet.EmployeeId);
  } else {
    data.users = await userProfile.getMultiple();
  }
  let holiday = await db.query(
    `SELECT count(HolidayDate) as HolidayCount, HolidayName FROM holidaymaster where HolidayDate = '${timeSheetDate}'`
  );
  let approvedLeave = await db.query(
    `SELECT count(LeavesId)  as Leaves, DATE_FORMAT(LeaveFromDate,'%d-%m-%y') as LeaveFromDate,  DATE_FORMAT(LeaveToDate,'%d-%m-%y') as LeaveToDate
     FROM employeeleaves WHERE '${timeSheetDate}' between LeaveFromDate and LeaveToDate
      and EmployeeId=3 and ApprovalStatusId=3`
  );

  data.users = data.users.data;
  data.holiday = holiday;
  data.approvedLeave = approvedLeave;
  res.json(data);
});

router.post("/Submit", middleware.authorize, async (req, res) => {
  try {
    req.body.UpdatedBy = session.getLoggedUser(req);
    req.body.EmployeeId = session.getLoggedUser(req);
    req.body.RoleId = await utility
      .fetch("project_team", pick(req.body, ["EmployeeId", "ProjectId"]), true)
      .then((c) => c.ProjectRoleId)
      .catch((err) => {
        throw err;
      });
    const id = await utility.create(req.body, "timesheet").catch((err) => {
      throw err;
    });
    res.json(id);
  } catch (err) {
    console.error(`Error while creating TimeSheet  `, err.message);
  }
});
router.put("/Submit/:id", middleware.authorize, async (req, res) => {
  try {
    const s1 = await utility.fetch(
      "timesheet",
      { TimeSheetId: req.params.id },
      true
    );
    if (
      (s1?.Attachment ?? "") != "" &&
      (s1?.Attachment ?? "") != (req.body?.Attachment ?? "")
    ) {
      await deleteFile(`uploads\\${s1.Attachment}`);
    }
    req.body.UpdatedBy = session.getLoggedUser(req);
    await utility.update(req.body, "timesheet", {
      TimeSheetId: req.params.id,
    });
    res.json(null);
  } catch (err) {
    console.error(`Error while creating TimeSheet  `, err.message);
  }
});
router.delete("/:id", middleware.authorize, async (req, res, next) => {
  try {
    const s1 = await utility.fetch(
      "timesheet",
      { TimeSheetId: req.params.id },
      true
    );
    if ((s1?.Attachment ?? "") != "")
      await deleteFile(`uploads\\${s1.Attachment}`);
    await utility
      .remove("timesheet", { TimeSheetId: req.params.id })
      .catch((err) => {
        throw err;
      });
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
  next();
});
router.get("/Fetch/Own/:date", middleware.authorize, async (req, res) => {
  const rows = await db.query(
    `SELECT t1.*, t2.TaskCategoryName, t3.ProjectName from timesheet t1 join taskcategorymaster t2 on t1.TaskCategoryId=t2.TaskCategoryId join projectmaster t3 on t1.ProjectId=t3.ProjectId where t1.Date='${
      req.params.date
    }' and t1.EmployeeId=${session.getLoggedUser(req)}`
  );
  res.json(helper.emptyOrRows(rows));
});
router.get("/Report", middleware.authorize, async (req, res, next) => {
  try {
    let que =
      "select t1.*, t2.TaskCategoryName, t3.ProjectName, t4.FullName from timesheet t1 join taskcategorymaster t2 on t1.TaskCategoryId=t2.TaskCategoryId join projectmaster t3 on t1.ProjectId=t3.ProjectId join employees t4 on t4.EmployeeId=t1.EmployeeId";
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
