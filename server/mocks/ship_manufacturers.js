var payloads = {
  shipManufacturers: require("./fixtures/ship_manufacturers.json")
};

module.exports = function(app) {
  var express = require('express');
  var shipManufacturersRouter = express.Router();

  shipManufacturersRouter.get('/', function(req, res) {
    res.send(payloads.shipManufacturers);
  });

  shipManufacturersRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  shipManufacturersRouter.get('/:id', function(req, res) {
    res.send({
      'ship-manufacturers': {
        id: req.params.id
      }
    });
  });

  shipManufacturersRouter.put('/:id', function(req, res) {
    res.send({
      'ship-manufacturers': {
        id: req.params.id
      }
    });
  });

  shipManufacturersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/ship_manufacturers', shipManufacturersRouter);
};
