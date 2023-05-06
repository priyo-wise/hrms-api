const express = require("express");
const router = express.Router();
const userProfile = require("../models/userProfile");
const middleware = require("../service/middleware");
const session = require("../service/session");

/* GET performance. */

router.get(
  "/FetchManager",
  middleware.authorize,
  async function (req, res, next) {
    try {
      res.json(await userProfile.FetchManagerByRole(2));
    } catch (err) {
      console.error(`Error while getting user `, err.message);
      next(err);
    }
  }
);

router.get(
  "/Fetchlocation",
  middleware.authorize,
  async function (req, res, next) {
    try {
      res.json(await userProfile.Fetchlocation());
    } catch (err) {
      console.error(`Error while getting user `, err.message);
      next(err);
    }
  }
);

router.get("/Fetch", middleware.authorize, async function (req, res, next) {
  try {
    res.json(await userProfile.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

/* GET User Profile. */
router.get(
  "/Fetch/:EmployeeId",
  middleware.authorize,
  async function (req, res, next) {
    try {
      
      if (req.params.EmployeeId == 0)
        res.json(await userProfile.getUserProfile(req.session.EmployeeId));
      else res.json(await userProfile.getUserProfile(req.params.EmployeeId));
    } catch (err) {
      console.error(`Error while getting user `, err.message);
      next(err);
    }
  }
);

router.get("/Fetch1", middleware.authorize, async function (req, res, next) {
  try {
    let user = await userProfile.getUserProfile(session.getLoggedUser(req));
    let id = user.data[0].EmployeeId;
    let data = {
      document: await userProfile.fetchByEmpId(id),
    };
    res.json(data);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
    next(err);
  }
});

router.post(
  "/CreateEmployeeManager/:ManagerId/:EmployeeId/:Status",
  middleware.authorize,
  async function (req, res, next) {
    try {
      res.json(
        await userProfile.CreateEmployeeManager(
          req.params.ManagerId,
          req.params.EmployeeId,
          req.session.EmployeeId,
          req.params.Status
        )
      );
    } catch (err) {
      console.error(`Error while updatting Document Status`, err.message);
      next(err);
    }
  }
);

router.post(
  "/CreateEmployeeOfficelocation",
  middleware.authorize,
  async function (req, res, next) {
    try {
      let data = await userProfile.CreateEmployeeOfficelocation(req.body);
      res.json(data);
    } catch (err) {
      console.error(`Error while getting user `, err.message);
      next(err);
    }
  }
);
router.post(
  "/UpdateEmployeeDocument/:DocumentId/:Status",
  middleware.authorize,
  async function (req, res, next) {
    try {
      res.json(
        await userProfile.UpdateEmployeeDocument(
          req.params.DocumentId,
          req.params.Status,
          req.session.EmployeeId
        )
      );
    } catch (err) {
      console.error(`Error while updatting Document Status`, err.message);
      next(err);
    }
  }
);
router.post("/Create", middleware.authorize, async function (req, res, next) {
  try {
    res.json(await userProfile.create(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

router.post("/Update", async function (req, res, next) {
  try {
    res.json(await userProfile.UpdateUserProfile(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});


router.post("/UpdateProfile", async function (req, res, next) {
  console.log("user Profile img",req.body);
  try {
    res.json(await userProfile.UpdateUserProfilePhoto(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

router.get(
  "/FetchDocType/:DocumentId",
  middleware.authorize,
  function (req, res, next) {
    try {
      res.json(userProfile.FetchDocType(req.params.DocumentId));
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
