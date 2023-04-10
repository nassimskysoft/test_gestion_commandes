const dataCommandes = require('../DATA/commandes.json'); //simulation de Base de données
const dataProduitsCommandes = require('../DATA/produitsCommandes.json'); //simulation de Base de données

const QRCode = require('qrcode');

exports.createCommande = (req, res, next) => {
  dataCommandes.push(req.body);
  res.status(201).json(dataCommandes);
};

exports.addProduct = async (req, res, next) => {
  if (
    !req.params.productName.match(/^(KeyNetic|KeyVibe)_V[1-9]\d*_[A-Z0-9]{6}$/i)
  ) {
    res.status(404).json({ messageError: 'Réference produit non valide' });
  } else if (
    dataProduitsCommandes.find((pdt) => pdt.name === req.params.productName)
  ) {
    res.status(404).json({ messageError: 'Produit en doublon' });
  } else {
    let qrcode = '';
    await QRCode.toDataURL(req.params.productName)
      .then((x) => {
        qrcode = x;
      })
      .catch((err) => {
        console.log(err);
      });

    dataProduitsCommandes.push({
      id: dataProduitsCommandes.length + 1,
      state: 'à préparer',
      commandeId: parseInt(req.params.commandeId),
      ...req.body,
      qrcode: qrcode,
    });
    res
      .status(201)
      .json(
        dataProduitsCommandes.filter(
          (cmd) => cmd.commandeId === parseInt(req.params.commandeId)
        )
      );
  }
};

exports.preparerProduit = async (req, res, next) => {
  dataProduitsCommandes.find(
    (x) => x.id === parseInt(req.params.productId)
  ).state = 'préparé';
  res
    .status(200)
    .json(
      dataProduitsCommandes.filter(
        (cmd) => cmd.commandeId === parseInt(req.params.commandeId)
      )
    );
};

exports.mettreEnColis = async (req, res, next) => {
  dataProduitsCommandes.find(
    (x) => x.id === parseInt(req.params.productId)
  ).state = 'en colis';
  res
    .status(200)
    .json(
      dataProduitsCommandes.filter(
        (cmd) => cmd.commandeId === parseInt(req.params.commandeId)
      )
    );
};

exports.getOneCommandeProducts = (req, res, next) => {
  const data = dataProduitsCommandes.filter(
    (cmd) => cmd.commandeId === parseInt(req.params.commandeId)
  );

  res.status(200).json(data);
};

exports.getAllCommande = (req, res, next) => {
  res.status(200).json(dataCommandes);
};
