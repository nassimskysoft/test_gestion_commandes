const express = require('express');

const os = require('os');

const router = express.Router();

router.get('/', (req, res) => {
  console.log('racine -> os ', os.platform());
  res.status(200).json('Welcome to API :) os=> ' + os.platform());
});

module.exports = router;
