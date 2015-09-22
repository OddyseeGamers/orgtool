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
    res.send({
      'units': {
        id: req.params.id
      }
    });
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
