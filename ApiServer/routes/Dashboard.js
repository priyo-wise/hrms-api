const express = require('express');
const router = express.Router();
const dashboard = require('../models/Dashboard');

/* GET performance. */
router.get('/Fetch', async function(req, res, next) {
  try {
    res.json(await dashboard.getMultiple());
  } catch (err) {
    console.error(`Error while getting dashboard `, err.message);
    next(err);
  }
});

module.exports = router;