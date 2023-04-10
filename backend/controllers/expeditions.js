const dataColis = require('../DATA/colis.json'); //simulation de Base de données
const dataProduitsCommandes = require('../DATA/produitsCommandes.json'); //simulation de Base de données

exports.createExpedtion = (req, res, next) => {
  dataColis.push(req.body);
  res.status(201).json(dataColis);
};

exports.getAllExpedition = (req, res, next) => {
  res.status(200).json(dataColis);
};

exports.getProductsExpedition = (req, res, next) => {
  res
    .status(200)
    .json(
      dataProduitsCommandes.filter(
        (pdt) => pdt.numSuivi === req.params.expeditionName
      )
    );
};

exports.mettreEnColis = async (req, res, next) => {
  //verification Colis
  let colis = dataColis.find((x) => x.name === req.params.colis);
  if (!colis) {
    colis = {
      id: dataColis.length + 1,
      name: req.params.colis,
      state: 'en cours',
    };
    dataColis.push(colis);
  }
  let pdtCommande = dataProduitsCommandes.find(
    (x) => x.id === parseInt(req.params.productId)
  );
  pdtCommande.state = 'en colis';
  pdtCommande.numSuivi = req.params.colis;

  res
    .status(200)
    .json(
      dataProduitsCommandes.filter(
        (cmd) => cmd.commandeId === parseInt(pdtCommande.commandeId)
      )
    );
};
