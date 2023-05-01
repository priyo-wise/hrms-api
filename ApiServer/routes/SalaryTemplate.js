const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const SalaryTemplate = require("../models/SalaryTemplate");
const statcModel = require("../models/staticModel");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(await statcModel.Fetch("salarytemplates"));
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
  try {
    res.json(await SalaryTemplate.fetchBySalaryId(req.params.id));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

// router.get("/Fetch/:id", middleware.authorize, async (req, res) => {
//   try {
//     if (req.params.id != 0) {
//       res.json(
//         await statcModel.FetchById(
//           "salarytemplates",
//           req.params.id,
//           "TemplateId"
//         )
//       );
//     } else {
//       res.json(await statcModel.Fetch("salarytemplates"));
//     }
//   } catch (err) {
//     console.error(`Error while getting Salary Templates `, err.message);
//     next(err);
//   }
// });

router.post("/Create", middleware.authorize, async function (req, res) {
  try {
    await statcModel.create(req.body, "salarytemplates");
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
      "salarytemplates",
      "TemplateId",
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

router.delete("/Delete/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove("salarytemplates", "TemplateId", req.params.id);
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
