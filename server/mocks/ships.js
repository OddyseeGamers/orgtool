var payloads = {
  ships: require("./fixtures/ships.json")
};

module.exports = function(app) {
  var express = require('express');
  var shipsRouter = express.Router();

  shipsRouter.get('/', function(req, res) {
    res.send(payloads.ships);
  });

  shipsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  shipsRouter.get('/:id', function(req, res) {
    var shipArr = payloads.ships.ships;
    var ship = {};
    var id = parseInt(req.params.id);

    for (var i = 0, len = shipArr.length; i < len; i++) {
      if (id === shipArr[i].id) {
        ship = shipArr[i];
      }
    }

    res.send({ 'ship': ship });
  });

  shipsRouter.put('/:id', function(req, res) {
    res.send({
      'ships': {
        id: req.params.id
      }
    });
  });

  shipsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/ships', shipsRouter);
};
