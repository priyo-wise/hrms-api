const express = require("express");
const {
  fetchByDynamic,
  create,
  update,
  remove,
  isCompanyExist,
} = require("../models/Utility");
const { authorize } = require("../service/middleware");
const { extend } = require("underscore");
const { getLoggedCompanyId } = require("../service/session");
const router = express.Router();

router.get("/:tableName", authorize, async (req, res, next) => {
  try {
    const CompanyId = await getLoggedCompanyId(req).catch((err) => {
      throw err;
    });
    res.json(
      await fetchByDynamic({ tableName: req.params.tableName, req, CompanyId }).catch(
        (err) => {
          throw err;
        }
      )
    );
  } catch (err) {
    res.status(400).json({
      Error: err.message,
    });
  }
  next();
});
router.post("/:tableName", authorize, async (req, res, next) => {
  try {
    if (
      await isCompanyExist(req.params.tableName).catch((err) => {
        throw err;
      })
    ) {
      req.body = extend(req.body, {
        CompanyId: await getLoggedCompanyId(req).catch((err) => {
          throw err;
        }),
      });
    }
    res.json(
      await create(req.body, req.params.tableName).catch((err) => {
        throw err;
      })
    );
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
  next();
});
router.put("/:tableName", authorize, async (req, res, next) => {
  try {
    // if (
    //   await isCompanyExist(req.params.tableName).catch((err) => {
    //     throw err;
    //   })
    // ) {
    //   req.body = extend(req.body, { CompanyId: getLoggedCompanyId(req) });
    // }
    await update(req.body, req.params.tableName, req.query).catch((err) => {
      throw err;
    });
    res.json(null);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
  next();
});
router.delete("/:tableName", authorize, async (req, res, next) => {
  try {
    await remove(req.params.tableName, req.query).catch((err) => {
      throw err;
    });
    res.json(null);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
  next();
});

module.exports = router;
