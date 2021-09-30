//TA03 PLACEHOLDER
const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'ta03.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

router.post('/search', (req, res, next) => {
  const selectedTag = req.body.selectedTag;
  if (!selectedTag || selectedTag == 'Select Tag') {
    return res.redirect('/week3/ta03');
  }
  // get tag recieved from req
  res.redirect('/week3/ta03?tag=' + selectedTag);
});

router.get('/', (req, res, next) => {
  getProductsFromFile(cards => {
    //create array of unique tags
    const uniqueTags = [];
    for (card of cards) {
      for (let i = 0; i < card.tags.length; i++) {
        if (!uniqueTags.includes(card.tags[i])) {
          uniqueTags.push(card.tags[i]);
        } 
      }
    }
    uniqueTags.sort();

    //rebuild card list if a tag was selected
    if (req.query.tag) {
      for (let i = cards.length - 1; i > -1; i--) {
        let cardInfo = cards[i];
        let cardTag = cardInfo.tags;

        if (!cardTag.includes(req.query.tag)) {
          cards.splice(i, 1);
        } 
      }
    }

    res.render('ta03', {
      pageTitle: 'Team Activity 03',
      path: '/week3/ta03',
      cards: cards,
      tags: uniqueTags,
      selectedTag: req.query.tag
    });
  });
});

module.exports = router;