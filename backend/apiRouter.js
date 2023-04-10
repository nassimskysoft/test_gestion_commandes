//Imports
const express = require('express');

const racine = require('./routes/api/racine');
const commandes = require('./routes/api/commandes');
const expedition = require('./routes/api/expeditions');

const apiRouter = express.Router();

//Router

exports.router = (function () {
  apiRouter.use('/', racine);
  apiRouter.use('/commandes', commandes);
  apiRouter.use('/expedition', expedition);

  return apiRouter;
})();
