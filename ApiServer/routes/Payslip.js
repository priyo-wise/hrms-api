const express = require("express");
const router = express.Router();
const Payslip = require("../models/Payslip");
const userProfile = require("../models/userProfile");
const middleware = require("../service/middleware");
const session = require("../service/session");
const utility = require("../models/Utility");
const encryption = require("../service/encryption");
const _ = require("underscore");
const SalaryComponent = require("../models/SalaryTemplate");
const { extend } = require("underscore");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    res.json(
      await Payslip.fetch(req).catch((err) => {
        throw err;
      })
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.get("/Fetch/:id", async (req, res) => {
  try {
    res.json(await Payslip.fetchById(req.params.id));
  } catch (err) {
    res.status(400).json({
      Error: err,
    });
  }
});
router.get("/View/:id", middleware.authorize, async (req, res, next) => {
  try {
    res.json(
      await Payslip.fetchByIdForView(req.params.id).catch((err) => {
        throw err;
      })
    );
  } catch (err) {
    res.status(400).json({
      Error: err,
    });
  }
  next();
});

router.post("/Submit", middleware.authorize, async function (req, res) {
  try {
    res.json(await utility.create(getEncptdata(req.body), "employeepayslip"));
  } catch (err) {
    console.error(`Error while getting Payslip `, err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});
router.put("/Submit/:id", middleware.authorize, async function (req, res) {
  try {
    await utility.update(getEncptdata(req.body), "employeepayslip", {
      PayslipId: req.params.id,
    });
    res.json(null);
  } catch (err) {
    console.error(`Error while getting Payslip `, err.message);
    res.status(400).json({
      error: err.message,
    });
  }
});

router.post("/Payment", middleware.authorize, async (req, res, next) => {
  try {
    res.json(
      await Payslip.addPayment(req.body).catch((err) => {
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
router.delete("/Payment/:id", middleware.authorize, async (req, res, next) => {
  try {
    res.json(
      await Payslip.deletePayment(req.params.id).catch((err) => {
        throw err;
      })
    );
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
  next();
});

const getEncptdata = (requestJson) => {
  return _.mapObject(requestJson, (value, key) => {
    switch (key) {
      case "Basic":
      case "HRA":
      case "Bonus":
      case "SalaryAdvanceDeduction":
      case "GrossSalary":
      case "TotalDeduction":
      case "NetSalary":
        return encryption.encryptData(value);
      default:
        return value;
    }
  });
};

router.get("/Component/:id/:fromDate", async (req, res) => {
  try {
    res.json(
      await SalaryComponent.fetchSalaryComponentByEmpId(
        req.params.fromDate,
        req.params.id
      )
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.post("/", middleware.authorize, async (req, res) => {
  try {
    res.json(await Payslip.submit(req.body));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.put("/:id", middleware.authorize, async (req, res) => {
  try {
    res.json(
      await Payslip.submit(extend(req.body, { PayslipId: req.params.id }))
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.delete("/:id", middleware.authorize, async (req, res, next) => {
  try {
    await utility.remove("employeepayslip", { PayslipId: req.params.id });
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
  next();
});

module.exports = router;
