const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const FamilyDetails = require("../models/FamilyDetails");
const middleware = require("../service/middleware");
const session = require("../service/session");
const statcModel = require("../models/staticModel");

/* GET Family Details. */
router.get("/Fetch", async (req, res, next) => {
  try {
    const data = {
      FamilyDetails: await FamilyDetails.fetch(session.getLoggedUser(req)),
    };
    if (data.FamilyDetails.length > 0) data.FamilyDetails = data.FamilyDetails;
    else data.FamilyDetails = {};
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  let data = {
    FamilyDetails: await FamilyDetails.fetchById(req.params.id),
  };
  if (data.FamilyDetails.length > 0) data.FamilyDetails = data.FamilyDetails[0];
  else data.FamilyDetails = {};

  res.json(data);
});
router.get("/FetchFamilyDetails/:id", async (req, res, next) => {
  var EmployeeId = null;
  if (req.params.id == 0) {
    EmployeeId = req.session.EmployeeId;
  } else {
    EmployeeId = req.params.id;
  }
  try {
    const data = {
      FamilyDetails: await FamilyDetails.employeeFamilyDetailsFetchById(EmployeeId),
    };
    if (data.FamilyDetails.length > 0) data.FamilyDetails = data.FamilyDetails;
    else data.FamilyDetails = {};
    res.json(data);
  } catch (err) {
    console.error(`Error while getting performance `, err.message);
    next(err);
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    const id = session.getLoggedUser(req);
    await FamilyDetails.create(req.body, id);
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.put("/Update/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Update(
      req.body,
      "employeeFamily",
      "FamilyId",
      req.params.id
    );
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

router.delete("/Remove/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove("employeeFamily", "FamilyId", req.params.id);
    res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
