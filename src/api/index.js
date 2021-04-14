const express = require('express');

const deces = require('./deces');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/deces', deces);

module.exports = router;
