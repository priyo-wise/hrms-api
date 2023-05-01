const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const db=require("../models/db");
const utility=require("../models/Utility");

/* GET User. */
router.get("/", middleware.authorize, async (req, res, next) => {
  try {
    res.json(
      await db.query(
        "SELECT t1.*, t2.CoreCode, t2.DisplayDescription FROM taskcategorymaster t1 LEFT join tasktype t2 on t1.TaskTypeId=t2.TaskTypeId"
      )
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.get("/:id", middleware.authorize, async (req, res) => {
  try{
    var query=`select * from taskcategorymaster where TaskCategoryId=${req.params.id}`;
    res.json(await db.query(query).then(c=>c.length>0?c[0]:c));
  }catch(err){
    res.status(400).json({
      Error:err.message
    });
  }
});

router.post("/", middleware.authorize, async (req, res)=> {
  try {
    res.json(await utility.create(req.body,"taskcategorymaster"));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.put("/:id", middleware.authorize, async (req, res)=> {
  try {
    await utility.update(req.body,"taskcategorymaster",{TaskCategoryId:req.params.id});
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

router.delete("/:id", middleware.authorize, async (req, res)=> {
  try {
    await utility.remove("taskcategorymaster",{TaskCategoryId:req.params.id});
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

module.exports = router;
