const express = require('express');
const router = express.Router();

const commandesController = require('../../controllers/commandes');

router.get('/', commandesController.getAllCommande);
router.post('/', commandesController.createCommande);

router.get('/:commandeId', commandesController.getOneCommandeProducts);
router.post(
  '/prepare/:commandeId/:productId',
  commandesController.preparerProduit
);
router.post(
  '/package/:commandeId/:productId',
  commandesController.mettreEnColis
);
router.post('/:commandeId/:productName', commandesController.addProduct);

module.exports = router;
