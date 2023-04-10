const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./apiRouter').router;
const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());

const port = process.env.PORT || 5005;

server.use('/api/', apiRouter);
server.listen(port, () => {
  console.log(`[OK] Serveur lancé dans le port ${port}`);
});
