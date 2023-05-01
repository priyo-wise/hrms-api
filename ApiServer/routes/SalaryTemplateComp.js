const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const SalaryTemplate = require("../models/SalaryTemplate");
const statcModel = require("../models/staticModel");
const utility = require("../models/Utility");

router.get("/Fetch", middleware.authorize, async (req, res, next) => {
  try {
    const depend = await SalaryTemplate.fetch(req.params.id);
    res.json(depend);
  } catch (err) {
    console.error(
      `Error while getting Salary Templates component`,
      err.message
    );
    next(err);
  }
});

router.get("/FetchDepend/:id", middleware.authorize, async (req, res, next) => {
  try {
    const depend = await SalaryTemplate.fetchDepend(req.params.id ?? 0).catch(
      (err) => {
        throw err;
      }
    );
    res.json(depend);
  } catch (err) {
    res.status(400).json({
      Error: err.message
    });
  }
});

router.get("/ByTemplate/:id", middleware.authorize, async (req, res) => {
  try {
    res.json(
      await utility.fetch("view_template_component", {
        TemplateId: req.params.id,
      })
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.get("/Fetch/:id", middleware.authorize, async (req, res, next) => {
  try {
    const data = {
      salary: await SalaryTemplate.fetchBySalary(),
      static: await SalaryTemplate.fetchByStatic(),
      component: await SalaryTemplate.fetchById(req.params.id),
      calculation: await SalaryTemplate.fetchByCalculation(),
    };
    if (data.component.length > 0) data.component = data.component[0];
    else data.component = {};
    res.json(data);
  } catch (err) {
    console.error(`Error while getting Salary Templates `, err.message);
    next(err);
  }
});

router.post("/", middleware.authorize, async function (req, res) {
  try {
    console.log(req.body);
    res.json(await utility.create(req.body, "salarytemplatecomponents"));
  } catch (err) {
    console.log(err);
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.put("/:id", middleware.authorize, async function (req, res) {
  try {
    await utility.update(req.body, "salarytemplatecomponents", {
      TemplateComponentId: req.params.id,
    });
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.delete("/Delete/:id", middleware.authorize, async function (req, res) {
  try {
    await statcModel.Remove(
      "salarytemplatecomponents",
      "TemplateComponentId",
      req.params.id
    );
    res.json(null);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
