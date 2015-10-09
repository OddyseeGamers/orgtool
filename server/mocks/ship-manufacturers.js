var payloads = {
  shipManufacturers: require("./fixtures/ship-manufacturers.json")
};

module.exports = function(app) {
  var express = require('express');
  var shipManufacturerRouter = express.Router();

  shipManufacturerRouter.get('/', function(req, res) {
    res.send(payloads.shipManufacturers);
  });

  shipManufacturerRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  shipManufacturerRouter.get('/:id', function(req, res) {
    var arr = payloads.shipManufacturers.shipManufacturers;
    var shipManu = {};
    var id = parseInt(req.params.id);

    for (var i = 0, len = arr.length; i < len; i++) {
      if (id === arr[i].id) {
        shipManu = arr[i];
      }
    }

    res.send({ 'shipManufacturer': shipManu });
  });

  shipManufacturerRouter.put('/:id', function(req, res) {
    res.send({
      'ship-manufacturer': {
        id: req.params.id
      }
    });
  });

  shipManufacturerRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/ship_manufacturers', shipManufacturerRouter);
};
