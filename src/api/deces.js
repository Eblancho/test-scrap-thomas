const express = require('express');
const Browser = require('../class/browser');
const Deces = require('../class/deces');

const router = express.Router();

router.get('/today', async (req, res) => {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day = today.getDate();
  
  // Lancement du navigateur
  const browser = new Browser();
  await browser.init();

  // Création de ton objet Deces
  const deces = new Deces(browser);
  await deces.init();

  try {
    // Récupération des deces
    const list = await deces.getDeaths(year, month, day);
    res.json(list);
  } catch (error) {
    console.log(error);
    // Si il y a une erreur lors de la récupération, affichage des erreurs
    res.status(500).json(error);
  }

  await browser.close();
});

module.exports = router;
