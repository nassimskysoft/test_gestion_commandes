const express = require('express');
const router = express.Router();

const expeditionsController = require('../../controllers/expeditions');

router.get('/', expeditionsController.getAllExpedition);
router.post('/', expeditionsController.createExpedtion);

router.get('/:expeditionName', expeditionsController.getProductsExpedition);

router.post('/package/:colis/:productId', expeditionsController.mettreEnColis);

module.exports = router;
