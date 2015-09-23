var payloads = {
  units: require("./fixtures/units.json")
};

module.exports = function(app) {
  var express = require('express');
  var unitsRouter = express.Router();

  unitsRouter.get('/', function(req, res) {
    res.send(payloads.units);
  });

  unitsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  unitsRouter.get('/:id', function(req, res) {
    var unitArr = payloads.units.units;
    var unit = {};
    var id = parseInt(req.params.id);

    for (var i = 0, len = unitArr.length; i < len; i++) {
      if (id === unitArr[i].id) {
        unit = unitArr[i];
      }
    }

    res.send({ 'unit': unit });
  });

  unitsRouter.put('/:id', function(req, res) {
    res.send({
      'units': {
        id: req.params.id
      }
    });
  });

  unitsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/units', unitsRouter);
};
