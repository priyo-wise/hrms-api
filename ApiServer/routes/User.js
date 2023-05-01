const express = require("express");
const router = express.Router();
const middleware = require("../service/middleware");
const session = require("../service/session");
const db = require("../models/db");
const utility = require("../models/Utility");
const { filter, where, map } = require("underscore");
const { deleteFile } = require("../service/fileFolderService");

router.get("/Permission", middleware.authorize, async (req, res, next) => {
  try {
    const menuList = `WITH c1 as ( SELECT * FROM menus WHERE MenuId in ( SELECT menurole.MenuId FROM menurole JOIN userroles on userroles.RoleId=menurole.RoleId WHERE userroles.EmployeeId=${session.getLoggedUser(
      req
    )} ) ), c2 as ( SELECT * FROM c1 UNION ALL SELECT * FROM menus WHERE MenuId in (SELECT ParentId from c1) ), c3 as ( select MenuId from c2 group by MenuId ), c4 as ( select t1.* from menus t1 join c3 t2 on t1.MenuId=t2.MenuId ) select * from c4;`;
    const permissionList = `SELECT * FROM staticpermissions WHERE PermissionId in ( SELECT rolepermissions.PermissionId FROM rolepermissions JOIN userroles on userroles.RoleId=rolepermissions.RoleId WHERE userroles.EmployeeId=${session.getLoggedUser(
      req
    )} )`;
    res.json({
      Menu: await db.query(menuList),
      Permission: await db.query(permissionList),
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});
router.get("/ActiveUserList", middleware.authorize, async (req, res) => {
  try {
    var userList = await utility
      .fetch("employees", { StatusId: 3 }, false, ["EmployeeId", "FullName"])
      .catch((err) => {
        throw err;
      });
    if ((req.query?.includeLoggedUser ?? "Yes") == "No")
      userList = filter(
        userList,
        (f) => f.EmployeeId != session.getLoggedUser(req)
      );
    switch (req.query?.user ?? "all") {
      case "own":
        userList = where(userList, { EmployeeId: session.getLoggedUser(req) });
        break;

      case "manage":
        var manageUser = await db
          .query(
            `SELECT EmployeeId FROM employeemanager WHERE (UTC_TIMESTAMP BETWEEN ValidFrom AND IFNULL(ValidUpto,UTC_TIMESTAMP)) AND ManagerID=${session.getLoggedUser(
              req
            )}`
          )
          .catch((err) => {
            throw err;
          });
        userList = filter(
          userList,
          (f) =>
            where(manageUser, { EmployeeId: f.EmployeeId }).length > 0 ||
            f.EmployeeId == session.getLoggedUser(req)
        );
        break;

      default:
        break;
    }
    res.json(userList);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.post("/Document", async (req, res) => {
  try {
    res.json(await utility.create(req.body, "employeedocuments").catch(err=>{throw err;}));
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});
router.delete("/Document/:id", async (req, res) => {
  try {
    var x1=await utility.fetch("employeedocuments",{DocumentId:req.params.id},true);
    await deleteFile(`uploads\\${x1.FilePath}`);
    await utility.remove("employeedocuments",{DocumentId:req.params.id});
    res.json(null);
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
});

module.exports = router;
