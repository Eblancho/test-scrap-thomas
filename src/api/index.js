const express = require('express');

const deces = require('./deces');
const testdb = require('./testdb');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/deces', deces);
router.use('/testdb', testdb);

module.exports = router;
