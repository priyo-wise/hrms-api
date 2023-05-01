const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const salaryPackageModel = require("../models/SalaryPackageModel");

router.get("/", middleware.authorize, async (req, res) => {
  try {
    res.json(await salaryPackageModel.fetchRecords());
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.get("/:id", middleware.authorize, async (req, res) => {
  try {
    res.json(await salaryPackageModel.fetchById(req.params.id));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.post("/", middleware.authorize, async (req, res) => {
  try {
    res.json(await salaryPackageModel.submit(req.body));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.put("/:id", middleware.authorize, async (req, res) => {
  try {
    req.body.EmployeePackageId = req.params.id;
    res.json(await salaryPackageModel.submit(req.body));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.delete("/:id", middleware.authorize, async (req, res) => {
  try {
    res.json(await salaryPackageModel.removePackageById(req.params.id));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

module.exports = router;
