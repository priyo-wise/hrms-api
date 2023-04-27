const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const db=require("../models/db");
const utility=require("../models/Utility");

router.get("/",middleware.authorize,async (req,res)=>{
    try{
        res.json(await db.query("select * from tasktype"));
    }catch(err){
        res.status(400).json({
            Error: err.message
        });
    }
});
router.get("/:id",middleware.authorize,async (req,res)=>{
    try{
        res.json(await db.query(`select * from tasktype where TaskTypeId=${req.params.id}`).then(c=>c.length>0?c[0]:{}));
    }catch(err){
        res.status(400).json({
            Error: err.message
        });
    }
});
router.post("/",middleware.authorize,async (req,res)=>{
    try{
        res.json(await utility.create(req.body,"tasktype"));
    }catch(err){
        res.status(400).json({
            Error: err.message
        });
    }
});
router.put("/:id",middleware.authorize,async (req,res)=>{
    try{
        await utility.update(req.body,"tasktype",{TaskTypeId:req.params.id});
        res.json(null);
    }catch(err){
        res.status(400).json({
            Error: err.message
        });
    }
});
router.delete("/:id",middleware.authorize,async (req,res)=>{
    try{
        await utility.remove("tasktype",{TaskTypeId:req.params.id});
        res.json(null);
    }catch(err){
        res.status(400).json({
            Error: err.message
        });
    }
});

module.exports=router;