const express = require('express');

const router = express.Router();

router.get('/coucou', async (req, res) => {
  res.json({
    message: 'test sequelize route'
  });
});

module.exports = router;
