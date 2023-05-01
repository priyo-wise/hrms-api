const express = require("express");
const router = express.Router();
const DocumentType = require("../models/DocumentType");
const middleware = require("../service/middleware");
const statcModel = require("../models/staticModel");
const { fetch } = require("../models/Utility");

/* GET Document Type. */
router.get("/Fetch", async (req, res, next) => {
  try {
    res.json(
      await fetch("staticDocumentTypes", req.query).catch((err) => {
        Error: err.message;
      })
    );
  } catch (err) {
    console.error(`Error while getting Document Type `, err.message);
    next(err);
  }
});

router.get("/DocumentDetails/:id", async (req, res, next) => {
  var EmployeeId = null;
  if (req.params.id == 0) {
    EmployeeId = req.session.EmployeeId;
  } else {
    EmployeeId = req.params.id;
  }
  try {
    res.json(await DocumentType.employeeDocumentEmployeeFetchById(EmployeeId));
  } catch (err) {
    console.error(`Error while getting performance `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  let data = {
    DocumentType: await DocumentType.fetchById(req.params.id),
    users: { data: [] },
  };
  if (data.DocumentType.length > 0) data.DocumentType = data.DocumentType[0];
  else data.DocumentType = {};

  res.json(data);
});

router.post("/Submit", middleware.authorize, async function (req, res) {
  try {
    await DocumentType.create(req.body);
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "staticdocumenttypes");
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.put("/Update/:id", middleware.authorize, async function (req, res) {
  try {
    console.log(req.body, req.params.id);
    await statcModel.Update(
      req.body,
      "staticdocumenttypes",
      "DocumentTypeId",
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
    console.log("Test", req.params.id);
    await statcModel.Remove(
      "staticdocumenttypes",
      "DocumentTypeId",
      req.params.id
    );
    //res.json(null);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
