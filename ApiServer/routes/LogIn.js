const express = require("express");
const router = express.Router();
const LogIn = require("../models/LogIn");
const session = require("../service/session");
const mailSend = require("../service/mailSend");
const { fetch } = require("../models/Utility");

/* GET User. */
router.post("/Validate", async function (req, res, next) {
  try {
    const user=await fetch("employees",req.body,true).catch(err=>{throw err;});
    if ((user.EmployeeId??0)!=0) {
      if (user.StatusId == 3) {
        session.setLoggedUser(req, user.EmployeeId);
        return res.json(null);
      } else {
        throw new Error("Access Denied");
      }
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

router.post("/SendMail", async function (req, res, next) {
  try {
    const data = await LogIn.SendMail(req.body);

    if (data.length == 1) {
      var password = data[0].Password;
      var email = data[0].Email;
      const mail = mailSend.sent(
        data[0].Email,
        "Your Reset Password",
        false,
        "Your Email : " + email + " and Password : " + password + ""
      );
      res.json("Please Check Your Email");
    } else {
      res.json("Please Enter Registered Email");
    }
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

router.post("/Update", async function (req, res, next) {
  try {
    const id = session.getLoggedUser(req);
    const data = await LogIn.UpdateUserPassword(req.body, id);
    res.json(data);
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

router.get("/Fetch1", async (req, res, next) => {
  try {
    let user = res.json(await LogIn.Fetch1(req.query));
  } catch (err) {
    console.error(`Error while getting leaves `, err.message);
    next(err);
  }
});

module.exports = router;
